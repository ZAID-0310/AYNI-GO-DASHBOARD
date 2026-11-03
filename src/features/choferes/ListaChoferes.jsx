import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

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
    <div style={{ maxWidth: '1300px', width: '100%', margin: '0 auto', padding: '40px 32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
          Gestión de Choferes
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Revisa la documentación y estado de cada conductor antes de habilitarlo en la plataforma.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }} role="tablist">
        {FILTROS.map((f) => {
          const activo = filtro === f.id;
          return (
            <button
              key={f.id}
              role="tab"
              aria-pressed={activo}
              onClick={() => setFiltro(f.id)}
              style={{
                background: activo ? '#0E4E48' : '#ffffff',
                color: activo ? '#ffffff' : '#475569',
                border: activo ? '1px solid #0E4E48' : '1px solid #cbd5e1',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: activo ? '0 4px 12px rgba(14, 78, 72, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {error ? (
        <div role="alert" style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚠️</span> {error}
        </div>
      ) : null}

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        {cargando ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#0E4E48', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 0.8s linear infinite' }}></div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Cargando lista de choferes...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : choferes.length === 0 && !error ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>📂</span>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#475569' }}>{actual.vacio}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '16px 24px' }}>Conductor</th>
                  <th style={{ padding: '16px 24px' }}>Documentos</th>
                  <th style={{ padding: '16px 24px' }}>Estado del Sistema</th>
                  <th style={{ padding: '16px 24px' }}>Última Actividad</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {choferes.map((c) => (
                  <tr
                    key={c.id}
                    tabIndex={0}
                    onClick={() => onAbrir(c.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onAbrir(c.id); }}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#0E4E48', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', boxShadow: '0 2px 6px rgba(14, 78, 72, 0.2)' }}>
                          {c.nombre ? c.nombre.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{c.nombre}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {c.pendientes > 0 && <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', border: '1px solid #fde68a' }}>{c.pendientes} por revisar</span>}
                        {c.aprobados > 0 && <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', border: '1px solid #a7f3d0' }}>{c.aprobados} aprobados</span>}
                        {c.rechazados > 0 && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', border: '1px solid #fecaca' }}>{c.rechazados} rechazados</span>}
                        {c.subidos === 0 && <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: '1px solid #e2e8f0' }}>Sin documentos</span>}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{
                        background: c.chofer_verificado ? '#d1fae5' : '#fef3c7',
                        color: c.chofer_verificado ? '#065f46' : '#92400e',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        border: c.chofer_verificado ? '1px solid #a7f3d0' : '1px solid #fde68a',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.chofer_verificado ? '#10b981' : '#d97706' }}></span>
                        {c.chofer_verificado ? 'Verificado' : 'No verificado'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                      {fecha(c.ultima_subida)}
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onAbrir(c.id); }}
                        style={{ background: '#0E4E48', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 6px rgba(14, 78, 72, 0.2)' }}
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}