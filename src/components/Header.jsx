export default function Header({ seccion, email, onCambiarSeccion, onCerrarSesion }) {
  const claseMenu = (activo) =>
    `px-4 py-2 rounded-xl text-[13px] font-bold border transition ${
      activo
        ? 'bg-green-50 border-green-200 text-[#0E4E48]'
        : 'border-transparent text-slate-500 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="h-[72px] px-4 md:px-8 flex items-center justify-between gap-6">
        {/* Marca */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#0E4E48] text-[#FFB800] font-black text-[15px] flex items-center justify-center shadow-md">
            AG
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black text-[#0E4E48] tracking-tight">AYNI</span>
            <span className="bg-[#FFB800] text-black text-[11px] font-black px-1.5 py-px rounded">GO</span>
            <span className="hidden sm:inline text-[11px] font-bold text-[#0E4E48] uppercase ml-2">
              Panel Admin
            </span>
          </div>
        </div>

        {/* Menú */}
        <nav className="flex gap-2 mr-auto md:ml-6" aria-label="Navegación principal">
          <button className={claseMenu(seccion === 'choferes')} onClick={() => onCambiarSeccion('choferes')}>
            🚗 Choferes
          </button>
          <button className={claseMenu(seccion === 'historial')} onClick={() => onCambiarSeccion('historial')}>
            📋 Historial
          </button>
        </nav>

        {/* Usuario */}
        <div className="flex items-center gap-5">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase">Sesión activa</span>
            <span className="text-[13px] font-semibold text-slate-900 max-w-[240px] truncate" title={email}>
              {email}
            </span>
          </div>
          <button
            onClick={onCerrarSesion}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3.5 py-2 rounded-xl text-xs font-bold transition"
          >
            🚪 Salir
          </button>
        </div>
      </div>
    </header>
  );
}