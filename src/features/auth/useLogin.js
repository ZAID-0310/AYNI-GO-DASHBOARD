import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function useLogin({ onEntrar, aviso }) {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(aviso || '');
  const [enviando, setEnviando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState('admin');

  const alternarPassword = () => setMostrarPassword((v) => !v);

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

  return {
    email, setEmail,
    clave, setClave,
    error,
    enviando,
    mostrarPassword, alternarPassword,
    rolSeleccionado, setRolSeleccionado,
    entrar,
  };
}