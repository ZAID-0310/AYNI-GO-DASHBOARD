import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const NOMBRES_DOC = {
  dni: 'DNI',
  licencia_conducir: 'Licencia de conducir',
  soat: 'SOAT',
  tarjeta_propiedad: 'Tarjeta de propiedad',
};

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'aprobado', label: 'Aprobados' },
  { id: 'rechazado', label: 'Rechazados' },
  { id: 'subido', label: 'Subidos por el chofer' },
];

const CLASE = { subido: 'pendiente', aprobado: 'aprobado', rechazado: 'rechazado' };

const fecha = (iso) =>
  new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });

export default function HistorialGlobal({ onAbrirChofer }) {
  const [filas, setFilas] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    supabase
      .rpc('admin_historial_documentos', { p_chofer_id: null, p_limite: 200 })
      .then(({ data, error: e }) => {
        if (!vigente) return;
        if (e) setError('No se pudo cargar el historial. Recarga la página e inténtalo de nuevo.');
        else setFilas(data ?? []);
        setCargando(false);
      });
    return () => { vigente = false; };
  }, []);

  const visibles = filtro === 'todos' ? filas : filas.filter((f) => f.accion === filtro);

  return (
    <section>
      <h2 className="titulo-seccion">Historial de revisiones</h2>
      <p className="nota">Quién aprobó o rechazó cada documento. Se muestran los últimos 200 movimientos.</p>

      <div className="filtros">
        {FILTROS.map((f) => (
          <button key={f.id} className="filtro" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {error ? <p className="error" role="alert">{error}</p> : null}

      <div className="tabla-caja">
        {cargando ? (
          <p className="vacio">Cargando...</p>
        ) : visibles.length === 0 && !error ? (
          <p className="vacio">No hay movimientos para este filtro.</p>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Acción</th>
                <th>Documento</th>
                <th>Chofer</th>
                <th>Hecho por</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((h) => (
                <tr
                  key={h.id}
                  className="fila-click"
                  tabIndex={0}
                  onClick={() => onAbrirChofer(h.chofer_id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onAbrirChofer(h.chofer_id); }}
                >
                  <td>{fecha(h.creado_en)}</td>
                  <td>
                    <span className={`etiqueta ${CLASE[h.accion] ?? 'neutro'}`}>{h.accion}</span>
                    {h.accion === 'rechazado' && h.motivo ? (
                      <div className="chofer-correo">Motivo: {h.motivo}</div>
                    ) : null}
                  </td>
                  <td>{NOMBRES_DOC[h.tipo] ?? h.tipo}</td>
                  <td>
                    <div className="chofer-nombre">{h.chofer_nombre}</div>
                    <div className="chofer-correo">{h.chofer_email}</div>
                  </td>
                  <td>
                    {h.actor_es_admin ? (
                      <>
                        <div className="chofer-nombre">{h.actor_nombre ?? 'Administrador'}</div>
                        <div className="chofer-correo">{h.actor_email}</div>
                      </>
                    ) : (
                      <span className="chofer-correo">El chofer</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}