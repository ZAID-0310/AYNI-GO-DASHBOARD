import { useState } from 'react';
import { supabase } from "../../lib/supabase";

export default function Login({ onEntrar, aviso }) {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(aviso || '');
  const [enviando, setEnviando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    const { error: eLogin } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: clave,
    });
    if (eLogin) {
      setError('Correo o contraseña incorrectos.');
      setEnviando(false);
      return;
    }

    // Solo entra quien tiene rol admin (lo decide la base de datos)
    const { data: esAdmin, error: eAdmin } = await supabase.rpc('es_admin');
    if (eAdmin || !esAdmin) {
      await supabase.auth.signOut();
      setError('Esta cuenta no tiene acceso al panel de administración.');
      setEnviando(false);
      return;
    }

    setEnviando(false);
    onEntrar();
  };

  return (
    <main className="login">
      <form className="login-tarjeta" onSubmit={entrar}>
        <h1 className="marca">Ayni Go</h1>
        <p className="subtitulo">Panel de administración</p>

        <label className="campo">
          <span>Correo</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="campo">
          <span>Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </label>

        {error ? <p className="error" role="alert">{error}</p> : null}

        <button className="boton" type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}