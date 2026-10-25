import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const NOMBRES_DOC = {
  dni: 'DNI',
  licencia_conducir: 'Licencia de conducir',
  soat: 'SOAT',
  tarjeta_propiedad: 'Tarjeta de propiedad',
};

const VERBO = {
  subido: 'subió',
  aprobado: 'aprobó',
  rechazado: 'rechazó',
};

const CLASE = {
  subido: 'pendiente',
  aprobado: 'aprobado',
  rechazado: 'rechazado',
};

const fecha = (iso) =>
  new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });

export default function HistorialChofer({ choferId, version }) {
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    setError('');
    supabase
      .rpc('admin_historial_documentos', { p_chofer_id: choferId, p_limite: 100 })
      .then(({ data, error: e }) => {
        if (!vigente) return;
        if (e) setError('No se pudo cargar el historial.');
        else setFilas(data ?? []);
        setCargando(false);
      });
    return () => { vigente = false; };
  }, [choferId, version]);

  return (
    <>
      <h3 className="subtitulo-detalle">Historial</h3>
      {cargando ? <p className="nota">Cargando...</p> : null}
      {error ? <p className="error" role="alert">{error}</p> : null}
      {!cargando && !error && filas.length === 0 ? (
        <p className="nota">Aún no hay movimientos registrados.</p>
      ) : null}

      {filas.map((h) => {
        const quien = h.actor_es_admin
          ? `${h.actor_nombre ?? 'Administrador'} (${h.actor_email ?? 'sin correo'})`
          : 'El chofer';
        return (
          <div key={h.id} className="caja-detalle documento-fila">
            <div>
              <div className="chofer-nombre">
                {quien} {VERBO[h.accion] ?? h.accion} {NOMBRES_DOC[h.tipo] ?? h.tipo}
              </div>
              <div className="chofer-correo">{fecha(h.creado_en)}</div>
              {h.accion === 'rechazado' && h.motivo ? (
                <div className="chofer-correo">Motivo: {h.motivo}</div>
              ) : null}
            </div>
            <span className={`etiqueta ${CLASE[h.accion] ?? 'neutro'}`}>{h.accion}</span>
          </div>
        );
      })}
    </>
  );
}