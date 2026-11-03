import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';

const LIMITE = 200;

export default function useHistorialGlobal() {
  const [filas, setFilas] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;

    supabase
      .rpc('admin_historial_documentos', { p_chofer_id: null, p_limite: LIMITE })
      .then(({ data, error: e }) => {
        if (!vigente) return;
        if (e) {
          setError('No se pudo cargar el historial. Recarga la página e inténtalo de nuevo.');
        } else {
          setFilas(data ?? []);
        }
        setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  const visibles = useMemo(
    () => (filtro === 'todos' ? filas : filas.filter((f) => f.accion === filtro)),
    [filas, filtro]
  );

  // Conteo por filtro para mostrar en las píldoras
  const conteos = useMemo(() => {
    const c = { todos: filas.length };
    filas.forEach((f) => {
      c[f.accion] = (c[f.accion] ?? 0) + 1;
    });
    return c;
  }, [filas]);

  return { visibles, conteos, filtro, setFiltro, cargando, error, limite: LIMITE };
}