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
  iso
    ? new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

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
    <section className="historial-global-container">
      <div className="historial-header">
        <h2 className="titulo-seccion">Historial de Revisiones</h2>
        <p className="nota">Registro de quién aprobó, rechazó o subió cada documento. Se muestran los últimos 200 movimientos.</p>
      </div>

      {/* Botones de filtro modernos en formato píldora */}
      <div className="filtros" role="tablist">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            role="tab"
            className="filtro"
            aria-pressed={filtro === f.id}
            onClick={() => setFiltro(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="error-banner" role="alert">
          <span>⚠️</span> {error}
        </div>
      ) : null}

      <div className="tabla-caja">
        {cargando ? (
          <div className="estado-contenedor">
            <div className="spinner"></div>
            <p className="vacio">Cargando historial...</p>
          </div>
        ) : visibles.length === 0 && !error ? (
          <div className="estado-vacio">
            <span className="icono-vacio">📋</span>
            <p className="vacio">No hay movimientos para este filtro.</p>
          </div>
        ) : (
          <div className="tabla-wrapper">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Acción / Estado</th>
                  <th>Documento</th>
                  <th>Conductor</th>
                  <th>Realizado por</th>
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
                    <td>
                      <span className="fecha-texto">{fecha(h.creado_en)}</span>
                    </td>
                    <td>
                      <div className="accion-celda">
                        <span className={`etiqueta ${CLASE[h.accion] ?? 'neutro'}`}>
                          {h.accion.charAt(0).toUpperCase() + h.accion.slice(1)}
                        </span>
                        {h.accion === 'rechazado' && h.motivo ? (
                          <div className="motivo-historial">
                            <span>Motivo:</span> {h.motivo}
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <span className="doc-tipo-texto">{NOMBRES_DOC[h.tipo] ?? h.tipo}</span>
                    </td>
                    <td>
                      <div className="chofer-perfil-celda">
                        <div className="chofer-avatar-min">
                          {h.chofer_nombre ? h.chofer_nombre.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div className="chofer-nombre">{h.chofer_nombre}</div>
                          <div className="chofer-correo">{h.chofer_email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {h.actor_es_admin ? (
                        <div className="actor-admin">
                          <div className="chofer-nombre">{h.actor_nombre ?? 'Administrador'}</div>
                          <div className="chofer-correo">{h.actor_email}</div>
                        </div>
                      ) : (
                        <span className="chofer-correo actor-chofer">El conductor mismo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}