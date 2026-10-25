import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const NOMBRES_DOC = {
  dni: 'DNI',
  licencia_conducir: 'Licencia de conducir',
  soat: 'SOAT',
  tarjeta_propiedad: 'Tarjeta de propiedad',
};

const ETIQUETA_ESTADO = {
  pendiente: { clase: 'pendiente', texto: 'Por revisar' },
  aprobado: { clase: 'aprobado', texto: 'Aprobado' },
  rechazado: { clase: 'rechazado', texto: 'Rechazado' },
};

const fecha = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

export default function DocumentoItem({ doc, onRevisado }) {
  const [url, setUrl] = useState(null);
  const [cargandoUrl, setCargandoUrl] = useState(false);
  const [rechazando, setRechazando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const est = ETIQUETA_ESTADO[doc.estado] ?? ETIQUETA_ESTADO.pendiente;
  const esPdf = doc.archivo_path?.toLowerCase().endsWith('.pdf');

  const verDocumento = async () => {
    setError('');
    setCargandoUrl(true);
    const { data, error: e } = await supabase.storage
      .from('documentos-choferes')
      .createSignedUrl(doc.archivo_path, 300);
    setCargandoUrl(false);
    if (e || !data?.signedUrl) {
      setError('No se pudo abrir el archivo.');
      return;
    }
    setUrl(data.signedUrl);
  };

  const revisar = async (estado) => {
    setError('');
    if (estado === 'rechazado' && !motivo.trim()) {
      setError('Escribe el motivo del rechazo.');
      return;
    }
    setGuardando(true);
    const { error: e } = await supabase.rpc('revisar_documento', {
      p_id: doc.id,
      p_estado: estado,
      p_motivo: estado === 'rechazado' ? motivo.trim() : null,
    });
    setGuardando(false);
    if (e) {
      setError('No se pudo guardar la revisión. Inténtalo de nuevo.');
      return;
    }
    setRechazando(false);
    setMotivo('');
    setUrl(null);
    onRevisado();
  };

  return (
    <div className="caja-detalle">
      <div className="documento-fila">
        <div>
          <div className="chofer-nombre">{NOMBRES_DOC[doc.tipo] ?? doc.tipo}</div>
          <div className="chofer-correo">Subido: {fecha(doc.subido_en)}</div>
          {doc.estado === 'rechazado' && doc.motivo_rechazo ? (
            <div className="chofer-correo">Motivo: {doc.motivo_rechazo}</div>
          ) : null}
        </div>
        <span className={`etiqueta ${est.clase}`}>{est.texto}</span>
      </div>

      <div className="acciones-doc">
        {url ? (
          <button className="boton-texto" onClick={() => setUrl(null)}>Ocultar</button>
        ) : (
          <button className="boton-texto" onClick={verDocumento} disabled={cargandoUrl}>
            {cargandoUrl ? 'Abriendo...' : 'Ver documento'}
          </button>
        )}
        {!rechazando ? (
          <>
            <button className="boton-aprobar" onClick={() => revisar('aprobado')} disabled={guardando || doc.estado === 'aprobado'}>
              Aprobar
            </button>
            <button className="boton-rechazar" onClick={() => setRechazando(true)} disabled={guardando}>
              Rechazar
            </button>
          </>
        ) : null}
      </div>

      {rechazando ? (
        <div className="bloque-rechazo">
          <textarea
            className="campo-motivo"
            rows={2}
            placeholder="Motivo del rechazo (lo verá el chofer)"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          <div className="acciones-doc">
            <button className="boton-rechazar" onClick={() => revisar('rechazado')} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Confirmar rechazo'}
            </button>
            <button className="boton-texto" onClick={() => { setRechazando(false); setError(''); }}>
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="error" role="alert">{error}</p> : null}

      {url ? (
        <div className="visor">
          {esPdf ? (
            <iframe src={url} title={NOMBRES_DOC[doc.tipo] ?? doc.tipo} className="visor-pdf" />
          ) : (
            <img src={url} alt={NOMBRES_DOC[doc.tipo] ?? doc.tipo} className="visor-img" />
          )}
        </div>
      ) : null}
    </div>
  );
}