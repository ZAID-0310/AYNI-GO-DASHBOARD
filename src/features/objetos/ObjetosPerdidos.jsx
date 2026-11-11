import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import './ObjetosPerdidos.css';

const ESTADOS = {
  pendiente: 'Pendiente',
  enviado_al_chofer: 'Enviado al chofer',
  resuelto: 'Resuelto',
  descartado: 'Descartado',
};

const fecha = (v) => (v ? new Date(v).toLocaleString('es-PE') : '—');

function Detalle({ id, onVolver }) {
  const [d, setD] = useState(null);
  const [error, setError] = useState(null);
    const [trabajando, setTrabajando] = useState(false);
  const [aviso, setAviso] = useState(null);

  const cargar = useCallback(async () => {
    setError(null);
    const { data, error: err } = await supabase.rpc('admin_detalle_objeto_perdido', { p_id: id });
    if (err) setError(err.message);
    else setD(data);
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

    const enviarCorreo = async () => {
    if (!window.confirm('¿Enviar este reporte al correo del chofer? Se le compartirá el teléfono del pasajero.')) return;
    setTrabajando(true);
    setError(null);
    setAviso(null);
    const { data, error: err } = await supabase.functions.invoke('enviar-correo-objeto', {
      body: { id },
    });
    setTrabajando(false);
    if (err) {
      let mensaje = err.message;
      try {
        const cuerpo = await err.context?.json?.();
        if (cuerpo?.error) mensaje = cuerpo.error;
      } catch {}
      setError(mensaje);
      return;
    }
    setAviso(data?.aviso ?? `Correo enviado a ${data?.enviado_a ?? 'el chofer'}.`);
    cargar();
  };

  const cambiar = async (estado) => {
    setTrabajando(true);
    setError(null);
    const { error: err } = await supabase.rpc('admin_cambiar_estado_objeto', {
      p_id: id,
      p_estado: estado,
    });
    setTrabajando(false);
    if (err) setError(err.message);
    else cargar();
  };

  return (
    <div className="op-contenedor">
      <button className="op-volver" onClick={onVolver}>← Volver a la lista</button>
      {error ? <p className="op-error">{error}</p> : null}
      {aviso ? <p className="op-aviso">{aviso}</p> : null}
      {!d ? (
        !error && <p>Cargando…</p>
      ) : (
        <div className="op-tarjeta">
          <div className="op-cabecera">
            <h2>{d.objeto}</h2>
            <span className={`op-estado op-estado-${d.estado}`}>{ESTADOS[d.estado] ?? d.estado}</span>
          </div>

          <dl className="op-datos">
            <dt>Detalles</dt>
            <dd>{d.detalles || '—'}</dd>
            <dt>Pasajero</dt>
            <dd>{d.pasajero_nombre || '—'}</dd>
            <dt>Teléfono del pasajero</dt>
            <dd>{d.telefono}</dd>
            <dt>Autorizó compartir su teléfono</dt>
            <dd>{fecha(d.autorizado_en)}</dd>
            <dt>Chofer</dt>
            <dd>{d.chofer_nombre || '—'}</dd>
            <dt>Correo del chofer</dt>
            <dd>{d.chofer_email || '—'}</dd>
            <dt>Viaje</dt>
            <dd>
              {fecha(d.fecha_viaje)}
              {d.destino_viaje ? ` · ${d.destino_viaje}` : ''}
            </dd>
            <dt>Reportado</dt>
            <dd>{fecha(d.creado_en)}</dd>
            <dt>Enviado al chofer</dt>
            <dd>{fecha(d.enviado_en)}</dd>
          </dl>

                    <div className="op-acciones">
            <button
              disabled={trabajando || d.estado === 'resuelto' || d.estado === 'descartado' || !d.chofer_email}
              onClick={enviarCorreo}
            >
              {d.estado === 'enviado_al_chofer' ? 'Reenviar al chofer' : 'Enviar al chofer'}
            </button>
            <button className="op-secundario" disabled={trabajando || d.estado === 'resuelto'} onClick={() => cambiar('resuelto')}>
              Marcar resuelto
            </button>
            <button
              className="op-secundario"
              disabled={trabajando || d.estado === 'descartado'}
              onClick={() => cambiar('descartado')}
            >
              Descartar
            </button>
            {d.estado !== 'pendiente' ? (
              <button className="op-secundario" disabled={trabajando} onClick={() => cambiar('pendiente')}>
                Volver a pendiente
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ObjetosPerdidos() {
  const [filtro, setFiltro] = useState('pendiente');
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [abierto, setAbierto] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    const { data, error: err } = await supabase.rpc('admin_lista_objetos_perdidos', {
      p_estado: filtro || null,
    });
    if (err) {
      setError(err.message);
      setLista([]);
    } else {
      setLista(Array.isArray(data) ? data : []);
    }
    setCargando(false);
  }, [filtro]);

  useEffect(() => {
    if (!abierto) cargar();
  }, [cargar, abierto]);

  if (abierto) return <Detalle id={abierto} onVolver={() => setAbierto(null)} />;

  return (
    <div className="op-contenedor">
      <h2>Objetos perdidos</h2>
      <div className="op-filtros">
        <label>
          Estado{' '}
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(ESTADOS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="op-error">{error}</p> : null}
      {cargando ? (
        <p>Cargando…</p>
      ) : lista.length === 0 ? (
        <p>No hay reportes con ese estado.</p>
      ) : (
        <div className="op-scroll">
          <table className="op-tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Objeto</th>
                <th>Pasajero</th>
                <th>Chofer</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((r) => (
                <tr key={r.id} onClick={() => setAbierto(r.id)}>
                  <td>{fecha(r.creado_en)}</td>
                  <td>{r.objeto}</td>
                  <td>{r.pasajero_nombre || '—'}</td>
                  <td>{r.chofer_nombre || '—'}</td>
                  <td>
                    <span className={`op-estado op-estado-${r.estado}`}>{ESTADOS[r.estado] ?? r.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}