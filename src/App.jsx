import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './features/auth/Login';
import ListaChoferes from './features/choferes/ListaChoferes';
import DetalleChofer from './features/choferes/DetalleChofer';
import HistorialGlobal from './features/historial/HistorialGlobal';
import './App.css';

export default function App() {
  const [vista, setVista] = useState('cargando');
  const [email, setEmail] = useState('');
  const [choferId, setChoferId] = useState(null);
  const [seccion, setSeccion] = useState('choferes'); // 'choferes' | 'historial'

  const comprobar = async () => {
    const { data } = await supabase.auth.getSession();
    const usuario = data?.session?.user;
    if (!usuario) {
      setVista('login');
      return;
    }
    const { data: esAdmin } = await supabase.rpc('es_admin');
    if (!esAdmin) {
      await supabase.auth.signOut();
      setVista('login');
      return;
    }
    setEmail(usuario.email ?? '');
    setVista('panel');
  };

  useEffect(() => {
    comprobar();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setChoferId(null);
    setSeccion('choferes');
    setVista('login');
  };

  if (vista === 'cargando') {
    return (
      <div className="pantalla-cargando">
        <div className="spinner-lg"></div>
        <p>Iniciando Ayni Go Admin...</p>
      </div>
    );
  }

  if (vista === 'login') return <Login onEntrar={comprobar} />;

  return (
    <div className="app-layout">
      {/* Navbar Superior de Administración */}
      <header className="barra-superior">
        <div className="barra-contenido">
          <div className="marca-brand">
            <div className="logo-badge">AG</div>
            <h1 className="marca-titulo">Ayni Go <span>Admin</span></h1>
          </div>

          <nav className="menu-navegacion" aria-label="Navegación principal">
            <button
              className={`menu-item ${seccion === 'choferes' ? 'activo' : ''}`}
              onClick={() => { setSeccion('choferes'); setChoferId(null); }}
            >
              🚘 Choferes
            </button>
            <button
              className={`menu-item ${seccion === 'historial' ? 'activo' : ''}`}
              onClick={() => { setSeccion('historial'); setChoferId(null); }}
            >
              📋 Historial
            </button>
          </nav>

          <div className="barra-usuario">
            <div className="usuario-info">
              <span className="usuario-label">Administrador</span>
              <span className="usuario-email" title={email}>{email}</span>
            </div>
            <button className="boton-cerrar-sesion" onClick={cerrarSesion} title="Cerrar sesión">
              🚪 <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Área de Contenido Principal */}
      <main className="contenido-principal">
        {choferId ? (
          <DetalleChofer choferId={choferId} onVolver={() => setChoferId(null)} />
        ) : seccion === 'historial' ? (
          <HistorialGlobal
            onAbrirChofer={(id) => { setSeccion('choferes'); setChoferId(id); }}
          />
        ) : (
          <ListaChoferes onAbrir={setChoferId} />
        )}
      </main>
    </div>
  );
}