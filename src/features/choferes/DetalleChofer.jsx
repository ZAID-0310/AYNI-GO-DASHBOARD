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
    <section>
      <button className="boton-texto" onClick={onVolver}>← Volver a la lista</button>

      {cargando ? <p className="vacio">Cargando...</p> : null}
      {error ? <p className="error" role="alert">{error}</p> : null}

      {usuario ? (
        <>
          <h2 className="titulo-seccion">{usuario.nombre}</h2>
          <p className="nota">
            {usuario.email}
            {usuario.telefono ? ` · ${usuario.telefono}` : ''}
          </p>
          <span className={`etiqueta ${usuario.chofer_verificado ? 'aprobado' : 'neutro'}`}>
            {usuario.chofer_verificado ? 'Verificado' : 'No verificado'}
          </span>

          <h3 className="subtitulo-detalle">Vehículo</h3>
          {vehiculos.length === 0 ? (
            <p className="nota">No registró vehículo.</p>
          ) : (
            vehiculos.map((v) => (
              <div key={v.placa} className="caja-detalle">
                <strong>{v.placa}</strong> · {v.modelo} · {v.capacidad_pasajeros} pasajeros
              </div>
            ))
          )}

          <h3 className="subtitulo-detalle">Documentos</h3>
          {documentos.length === 0 ? (
            <p className="nota">Todavía no subió documentos.</p>
          ) : (
              documentos.map((d) => (
              <DocumentoItem
                key={d.id}
                doc={d}
                onRevisado={() => { cargar(true); setVersion((v) => v + 1); }}
              />
                        ))
          )}

          <HistorialChofer choferId={choferId} version={version} />
        </>
      ) : null}
    </section>
  );
}