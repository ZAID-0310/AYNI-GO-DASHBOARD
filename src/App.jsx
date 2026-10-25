import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './features/auth/Login';
import ListaChoferes from './features/choferes/ListaChoferes';
import DetalleChofer from './features/choferes/DetalleChofer';
import HistorialGlobal from './features/historial/HistorialGlobal';

export default function App() {
  // 'cargando' | 'login' | 'panel'
  const [vista, setVista] = useState('cargando');
  const [email, setEmail] = useState('');
  const [choferId, setChoferId] = useState(null);
  const [seccion, setSeccion] = useState('choferes'); // 'choferes' | 'historial'

  // Al abrir: si ya hay sesión guardada, comprobar que sigue siendo admin
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

  if (vista === 'cargando') return <div className="cargando">Cargando...</div>;
  if (vista === 'login') return <Login onEntrar={comprobar} />;

  return (
    <>
      <header className="barra">
                <h1 className="marca">Ayni Go</h1>
        <nav className="menu-panel">
          <button
            className="menu-item"
            aria-current={seccion === 'choferes'}
            onClick={() => { setSeccion('choferes'); setChoferId(null); }}
          >
            Choferes
          </button>
          <button
            className="menu-item"
            aria-current={seccion === 'historial'}
            onClick={() => { setSeccion('historial'); setChoferId(null); }}
          >
            Historial
          </button>
        </nav>
        <div className="barra-usuario">
          <span>{email}</span>
          <button className="boton-texto" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </header>
      <main className="contenido">
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
    </>
  );
}