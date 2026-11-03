export const NOMBRES_DOC = {
  dni: 'DNI',
  licencia_conducir: 'Licencia de conducir',
  soat: 'SOAT',
  tarjeta_propiedad: 'Tarjeta de propiedad',
};

export const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'aprobado', label: 'Aprobados' },
  { id: 'rechazado', label: 'Rechazados' },
  { id: 'subido', label: 'Subidos por el chofer' },
];

// Clases de Tailwind para cada estado (badge tipo píldora)
export const ESTILOS_ACCION = {
  subido: 'bg-amber-50 text-amber-800 border-amber-200',
  aprobado: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rechazado: 'bg-red-50 text-red-800 border-red-200',
  neutro: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const formatearFecha = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

export const capitalizar = (texto = '') =>
  texto.charAt(0).toUpperCase() + texto.slice(1);

export const inicial = (nombre) =>
  nombre ? nombre.charAt(0).toUpperCase() : 'C';