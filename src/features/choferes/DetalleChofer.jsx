import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import './DetalleChofer.css';
import DocumentoItem from './DocumentoItem';
import HistorialChofer from './HistorialChofer';

export default function DetalleChofer({ choferId, onVolver }) {
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  const cargar = (silencioso = false) => {
    if (!silencioso) setCargando(true);
    setError('');
    supabase
      .rpc('admin_detalle_chofer', { p_chofer_id: choferId })
      .then(({ data, error: e }) => {
        if (e) setError('No se pudo cargar el detalle. Inténtalo de nuevo.');
        else setDetalle(data);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choferId]);

  const usuario = detalle?.usuario;
  const vehiculos = detalle?.vehiculos ?? [];
  const documentos = detalle?.documentos ?? [];

  return (
    <div className="detalle-chofer-container">
      {/* Barra superior de navegación */}
      <div className="detalle-actions-bar">
        <button className="boton-texto" onClick={onVolver}>
          <span className="icono-flecha">←</span> Volver a la lista
        </button>
      </div>

      {cargando && (
        <div className="estado-contenedor">
          <div className="spinner"></div>
          <p className="vacio">Cargando información del conductor...</p>
        </div>
      )}

      {error && (
        <div className="error-banner" role="alert">
          <span>⚠️</span> {error}
        </div>
      )}

      {!cargando && usuario && (
        <div className="detalle-content">
          {/* Tarjeta de Cabecera / Perfil del Conductor */}
          <div className="card-perfil">
            <div className="perfil-info-principal">
              <div className="avatar-placeholder">
                {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="perfil-datos">
                <div className="titulo-con-badge">
                  <h2 className="titulo-seccion">{usuario.nombre}</h2>
                  <span className={`etiqueta ${usuario.chofer_verificado ? 'aprobado' : 'neutro'}`}>
                    {usuario.chofer_verificado ? '✓ Verificado' : 'Pendiente de verificación'}
                  </span>
                </div>
                <p className="nota contacto-info">
                  <span>✉️ {usuario.email}</span>
                  {usuario.telefono ? ` · 📞 ${usuario.telefono}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Grid Principal del Dashboard */}
          <div className="dashboard-grid">
            {/* Columna Izquierda: Vehículos y Documentos */}
            <div className="columna-principal">
              <section className="seccion-bloque">
                <h3 className="subtitulo-detalle">🚗 Vehículo registrado</h3>
                {vehiculos.length === 0 ? (
                  <p className="nota vacio-nota">El conductor no registró ningún vehículo.</p>
                ) : (
                  vehiculos.map((v) => (
                    <div key={v.placa} className="caja-detalle vehiculo-card">
                      <div className="vehiculo-badge-placa">{v.placa}</div>
                      <div className="vehiculo-info">
                        <p><strong>Modelo:</strong> {v.modelo}</p>
                        <p><strong>Capacidad:</strong> {v.capacidad_pasajeros} pasajeros</p>
                      </div>
                    </div>
                  ))
                )}
              </section>

              <section className="seccion-bloque">
                <h3 className="subtitulo-detalle">📂 Documentación</h3>
                {documentos.length === 0 ? (
                  <p className="nota vacio-nota">Todavía no ha subido documentos.</p>
                ) : (
                  <div className="documentos-lista">
                    {documentos.map((d) => (
                      <DocumentoItem
                        key={d.id}
                        doc={d}
                        onRevisado={() => { cargar(true); setVersion((v) => v + 1); }}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Columna Derecha: Historial de Actividad */}
            <div className="columna-lateral">
              <section className="seccion-bloque sticky-sidebar">
                <h3 className="subtitulo-detalle">📊 Historial de Actividad</h3>
                <HistorialChofer choferId={choferId} version={version} />
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}