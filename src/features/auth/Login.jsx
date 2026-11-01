import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Login({ onEntrar, aviso }) {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(aviso || '');
  const [enviando, setEnviando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState('admin');

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

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'row',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      background: '#041517',
      overflow: 'hidden'
    }}>
      
      {/* ---------------- PANEL IZQUIERDO (Verde esmeralda claro y vivo) ---------------- */}
      <div style={{
        flex: '1.1',
        background: 'linear-gradient(145deg, #0f766e 0%, #084c44 50%, #042925 100%)',
        color: '#ffffff',
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Logo superior izquierdo con el icono exacto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: '#065f46',
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <svg style={{ width: '26px', height: '26px', fill: '#ffffff' }} viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>AYNI</span>
              <span style={{ background: '#FFB800', color: '#000000', fontSize: '18px', fontWeight: '900', padding: '2px 8px', borderRadius: '8px', marginLeft: '6px' }}>GO ➜</span>
            </div>
          </div>
        </div>

        <div style={{ paddingLeft: '4px' }}>
          <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '600' }}>• Tu viaje, tu seguridad</span>
        </div>

        {/* Contenido Central del Panel Izquierdo */}
        <div style={{ maxWidth: '480px', margin: '20px 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 184, 0, 0.15)',
            color: '#FFB800',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            marginBottom: '20px',
            border: '1px solid rgba(255, 184, 0, 0.3)'
          }}>
            🛡️ Sistema Institucional Seguro
          </div>

          <h1 style={{ fontSize: '38px', fontWeight: '800', lineHeight: '1.2', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
            Gestión Inteligente de Movilidad
          </h1>
          <p style={{ fontSize: '14px', color: '#a7f3d0', lineHeight: '1.6', margin: '0 0 32px 0' }}>
            Accede al panel centralizado para administrar rutas universitarias, conductores verificados y monitoreo en tiempo real.
          </p>

          {/* Tarjetas de características */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📍</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>Monitoreo GPS e itinerarios en vivo</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>👤</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>Verificación biométrica de conductores</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📊</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>Reportes de seguridad y analítica</span>
            </div>
          </div>
        </div>

        {/* Footer inferior izquierdo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#a7f3d0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', display: 'inline-block' }}></span>
            Servidores Operativos
          </span>
          <span>v2.4.0</span>
        </div>
      </div>

      {/* ---------------- PANEL DERECHO (Formulario Blanco) ---------------- */}
      <div style={{
        flex: '1.2',
        background: '#ffffff',
        color: '#0f172a',
        padding: '40px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto'
      }}>
        
        {/* Cabecera del formulario y Selector de Roles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0', color: '#0f172a' }}>Iniciar Sesión</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Ingresa tus credenciales para acceder a la plataforma</p>
          </div>

          {/* Botones Admin / Conductor */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setRolSeleccionado('admin')}
              style={{
                background: rolSeleccionado === 'admin' ? '#ffffff' : 'transparent',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                color: rolSeleccionado === 'admin' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                boxShadow: rolSeleccionado === 'admin' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => setRolSeleccionado('conductor')}
              style={{
                background: rolSeleccionado === 'conductor' ? '#ffffff' : 'transparent',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                color: rolSeleccionado === 'conductor' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                boxShadow: rolSeleccionado === 'conductor' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              🚗 Conductor
            </button>
          </div>
        </div>

        {/* Badge de Modo */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          padding: '10px 16px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#166534' }}>
            🛡️ Modo: Administrador de Flotas / Campus
          </span>
          <span style={{ fontSize: '10px', fontWeight: '700', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px' }}>
            Oficial
          </span>
        </div>

        {/* FORMULARIO DE ACCESO */}
        <form onSubmit={entrar} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '420px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
              CORREO ELECTRÓNICO INSTITUCIONAL
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@ayni-go.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px' }}>✉️</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                CONTRASEÑA
              </label>
              <span style={{ fontSize: '11px', color: '#0f766e', fontWeight: '600', cursor: 'pointer' }}>¿Olvidaste tu contraseña?</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={mostrarPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 38px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px' }}>🔒</span>
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {mostrarPassword ? 'Ocultar' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '15px', height: '15px', accentColor: '#0f766e' }} />
              Mantener sesión iniciada
            </label>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Encriptación TLS 256-bit</span>
          </div>

          {error && (
            <div role="alert" style={{
              padding: '10px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            style={{
              width: '100%',
              padding: '14px',
              background: '#0f766e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            {enviando ? 'Verificando acceso...' : 'Entrar al Dashboard ➜'}
          </button>
        </form>

        {/* Footer inferior derecho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '20px', width: '100%', maxWidth: '420px' }}>
          <span>&copy; {new Date().getFullYear()} AYNI-GO Inc. Todos los derechos reservados.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ cursor: 'pointer' }}>Soporte Técnico</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Privacidad</span>
          </div>
        </div>

      </div>
    </div>
  );
}