import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './features/auth/Login';
import ListaChoferes from './features/choferes/ListaChoferes';
import DetalleChofer from './features/choferes/DetalleChofer';
import HistorialGlobal from './features/historial/HistorialGlobal';
import Header from './components/Header';

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

  const irASeccion = (nombre) => {
    setSeccion(nombre);
    setChoferId(null);
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setChoferId(null);
    setSeccion('choferes');
    setVista('login');
  };

  if (vista === 'cargando') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 text-slate-500 font-semibold">
        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-[#0E4E48] rounded-full animate-spin" />
        <p>Iniciando Ayni Go Admin...</p>
      </div>
    );
  }

  if (vista === 'login') return <Login onEntrar={comprobar} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        seccion={seccion}
        email={email}
        onCambiarSeccion={irASeccion}
        onCerrarSesion={cerrarSesion}
      />

      <main className="flex-1 w-full">
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