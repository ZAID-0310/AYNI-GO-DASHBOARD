import useHistorialGlobal from './useHistorialGlobal';
import {
  FILTROS,
  NOMBRES_DOC,
  ESTILOS_ACCION,
  formatearFecha,
  capitalizar,
  inicial,
} from './historialConstantes';

/* ---------- Piezas de presentación ---------- */

function FiltroPildora({ activo, label, conteo, onClick }) {
  return (
    <button
      role="tab"
      aria-selected={activo}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2
        ${
          activo
            ? 'border-emerald-900 bg-emerald-900 text-white shadow-md shadow-emerald-900/20'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
        }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
          activo ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {conteo ?? 0}
      </span>
    </button>
  );
}

function Etiqueta({ accion }) {
  const estilo = ESTILOS_ACCION[accion] ?? ESTILOS_ACCION.neutro;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${estilo}`}
    >
      {capitalizar(accion)}
    </span>
  );
}

function Avatar({ nombre }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-sm font-bold text-white">
      {inicial(nombre)}
    </div>
  );
}

function EstadoCarga() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-900" />
      <p className="text-sm text-slate-500">Cargando historial...</p>
    </div>
  );
}

function EstadoVacio() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20">
      <span className="text-4xl">📋</span>
      <p className="text-sm text-slate-500">No hay movimientos para este filtro.</p>
    </div>
  );
}

function FilaHistorial({ h, onAbrir }) {
  return (
    <tr
      tabIndex={0}
      onClick={() => onAbrir(h.chofer_id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onAbrir(h.chofer_id);
      }}
      className="cursor-pointer transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
    >
      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
        {formatearFecha(h.creado_en)}
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col items-start gap-2">
          <Etiqueta accion={h.accion} />
          {h.accion === 'rechazado' && h.motivo && (
            <p className="max-w-xs rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-800">
              <span className="font-semibold">Motivo:</span> {h.motivo}
            </p>
          )}
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
        {NOMBRES_DOC[h.tipo] ?? h.tipo}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar nombre={h.chofer_nombre} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{h.chofer_nombre}</p>
            <p className="truncate text-xs text-slate-500">{h.chofer_email}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        {h.actor_es_admin ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {h.actor_nombre ?? 'Administrador'}
            </p>
            <p className="truncate text-xs text-slate-500">{h.actor_email}</p>
          </div>
        ) : (
          <span className="text-xs italic text-slate-500">El conductor mismo</span>
        )}
      </td>
    </tr>
  );
}

/* ---------- Componente principal ---------- */

export default function HistorialGlobal({ onAbrirChofer }) {
  const { visibles, conteos, filtro, setFiltro, cargando, error, limite } =
    useHistorialGlobal();

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      {/* Encabezado */}
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Historial de Revisiones
        </h2>
        <p className="mt-2 text-base text-slate-500">
          Registro de quién aprobó, rechazó o subió cada documento. Se muestran los últimos{' '}
          {limite} movimientos.
        </p>
      </header>

      {/* Filtros */}
      <div role="tablist" className="mb-6 flex flex-wrap gap-3">
        {FILTROS.map((f) => (
          <FiltroPildora
            key={f.id}
            label={f.label}
            conteo={conteos[f.id]}
            activo={filtro === f.id}
            onClick={() => setFiltro(f.id)}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          <span aria-hidden>⚠️</span> {error}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {cargando ? (
          <EstadoCarga />
        ) : visibles.length === 0 && !error ? (
          <EstadoVacio />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left">
              <thead className="border-b border-slate-200 bg-slate-50/60">
                <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Fecha y hora</th>
                  <th className="px-6 py-4">Acción / Estado</th>
                  <th className="px-6 py-4">Documento</th>
                  <th className="px-6 py-4">Conductor</th>
                  <th className="px-6 py-4">Realizado por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibles.map((h) => (
                  <FilaHistorial key={h.id} h={h} onAbrir={onAbrirChofer} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}