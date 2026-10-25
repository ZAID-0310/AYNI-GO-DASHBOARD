import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import './ListaChoferes.css';

const FILTROS = [
  { id: 'pendientes', label: 'Por revisar', vacio: 'No hay choferes con documentos por revisar.' },
  { id: 'rechazados', label: 'Rechazados', vacio: 'Ningún chofer tiene documentos rechazados.' },
  { id: 'verificados', label: 'Verificados', vacio: 'Todavía no hay choferes verificados.' },
  { id: 'sin_documentos', label: 'Sin documentos', vacio: 'Todos los choferes ya subieron documentos.' },
  { id: 'todos', label: 'Todos', vacio: 'Aún no hay choferes registrados.' },
];

const fecha = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Sin documentos';

export default function ListaChoferes({ onAbrir }) {
  const [filtro, setFiltro] = useState('pendientes');
  const [choferes, setChoferes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setError('');
    supabase.rpc('admin_lista_choferes', { p_filtro: filtro }).then(({ data, error: e }) => {
      if (!vigente) return;
      if (e) setError('No se pudo cargar la lista. Recarga la página e inténtalo de nuevo.');
      else setChoferes(data ?? []);
      setCargando(false);
    });
    return () => { vigente = false; };
  }, [filtro]);

  const actual = FILTROS.find((f) => f.id === filtro);

  return (
    <section>
      <h2 className="titulo-seccion">Choferes</h2>
      <p className="nota">Revisa la documentación de cada chofer antes de habilitarlo.</p>

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
        ) : choferes.length === 0 && !error ? (
          <p className="vacio">{actual.vacio}</p>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>Chofer</th>
                <th>Documentos</th>
                <th>Estado</th>
                <th>Último documento subido</th>
              </tr>
            </thead>
            <tbody>
              {choferes.map((c) => (
                <tr
                  key={c.id}
                  className="fila-click"
                  tabIndex={0}
                  onClick={() => onAbrir(c.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onAbrir(c.id); }}
                >
                  <td>
                    <div className="chofer-nombre">{c.nombre}</div>
                    <div className="chofer-correo">{c.email}</div>
                  </td>
                  <td>
                    <div className="conteos">
                      {c.pendientes > 0 && <span className="etiqueta pendiente">{c.pendientes} por revisar</span>}
                      {c.aprobados > 0 && <span className="etiqueta aprobado">{c.aprobados} aprobados</span>}
                      {c.rechazados > 0 && <span className="etiqueta rechazado">{c.rechazados} rechazados</span>}
                      {c.subidos === 0 && <span className="etiqueta neutro">Sin documentos</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`etiqueta ${c.chofer_verificado ? 'aprobado' : 'neutro'}`}>
                      {c.chofer_verificado ? 'Verificado' : 'No verificado'}
                    </span>
                  </td>
                  <td>{fecha(c.ultima_subida)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}