import useLogin from './useLogin';
import { estilos as s } from './Login.styles';

const CARACTERISTICAS = [
  { icono: '📍', texto: 'Monitoreo GPS e itinerarios en vivo' },
  { icono: '👤', texto: 'Verificación biométrica de conductores' },
  { icono: '📊', texto: 'Reportes de seguridad y analítica' },
];

export default function Login({ onEntrar, aviso }) {
  const {
    email, setEmail,
    clave, setClave,
    error,
    enviando,
    mostrarPassword, alternarPassword,
    rolSeleccionado, setRolSeleccionado,
    entrar,
  } = useLogin({ onEntrar, aviso });

  return (
    <div style={s.contenedor}>
      {/* ---------- Panel izquierdo ---------- */}
      <div style={s.panelIzquierdo}>
        <div style={s.logoFila}>
          <div style={s.logoIcono}>
            <svg style={s.logoSvg} viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div style={s.logoTexto}>
            <span style={s.logoAyni}>AYNI</span>
            <span style={s.logoGo}>GO ➜</span>
          </div>
        </div>

        <span style={s.lema}>• Tu viaje, tu seguridad</span>

        <div style={s.centro}>
          <div style={s.badgeSeguro}>🛡️ Sistema Institucional Seguro</div>
          <h1 style={s.titulo}>Gestión Inteligente de Movilidad</h1>
          <p style={s.descripcion}>
            Accede al panel centralizado para administrar rutas universitarias, conductores verificados y monitoreo en tiempo real.
          </p>

          <div style={s.listaTarjetas}>
            {CARACTERISTICAS.map((c) => (
              <div key={c.texto} style={s.tarjeta}>
                <span style={s.tarjetaIcono}>{c.icono}</span>
                <span style={s.tarjetaTexto}>{c.texto}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.pieIzquierdo}>
          <span style={s.estado}>
            <span style={s.estadoPunto}></span>
            Servidores Operativos
          </span>
          <span>v2.4.0</span>
        </div>
      </div>

      {/* ---------- Panel derecho ---------- */}
      <div style={s.panelDerecho}>
        <div style={s.cabecera}>
          <div>
            <h2 style={s.cabeceraTitulo}>Iniciar Sesión</h2>
            <p style={s.cabeceraSub}>Ingresa tus credenciales para acceder a la plataforma</p>
          </div>

          <div style={s.selectorRoles}>
            <button
              type="button"
              onClick={() => setRolSeleccionado('admin')}
              style={s.botonRol(rolSeleccionado === 'admin')}
            >
              👑 Admin
            </button>
          </div>
        </div>

        <div style={s.badgeModo}>
          <span style={s.badgeModoTexto}>🛡️ Modo: Administrador de Flotas / Campus</span>
          <span style={s.badgeModoOficial}>Oficial</span>
        </div>

        <form onSubmit={entrar} style={s.formulario}>
          <div>
            <label style={s.etiqueta}>CORREO ELECTRÓNICO INSTITUCIONAL</label>
            <div style={s.campo}>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@ayni-go.com"
                required
                style={s.inputEmail}
              />
              <span style={s.iconoCampo}>✉️</span>
            </div>
          </div>

          <div>
            <div style={s.etiquetaFila}>
              <label style={s.etiquetaSinMargen}>CONTRASEÑA</label>
              <span style={s.olvido}>¿Olvidaste tu contraseña?</span>
            </div>
            <div style={s.campo}>
              <input
                type={mostrarPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="••••••••••••"
                required
                style={s.inputClave}
              />
              <span style={s.iconoCampo}>🔒</span>
              <button type="button" onClick={alternarPassword} style={s.botonOjo}>
                {mostrarPassword ? 'Ocultar' : '👁️'}
              </button>
            </div>
          </div>

          <div style={s.opciones}>
            <label style={s.checkboxLabel}>
              <input type="checkbox" style={s.checkbox} />
              Mantener sesión iniciada
            </label>
            <span style={s.tls}>Encriptación TLS 256-bit</span>
          </div>

          {error && (
            <div role="alert" style={s.alerta}>
              {error}
            </div>
          )}

          <button type="submit" disabled={enviando} style={s.botonEntrar(enviando)}>
            {enviando ? 'Verificando acceso...' : 'Entrar al Dashboard ➜'}
          </button>
        </form>

        <div style={s.pieDerecho}>
          <span>&copy; {new Date().getFullYear()} AYNI-GO Inc. Todos los derechos reservados.</span>
          <div style={s.pieLinks}>
            <span style={s.pieLink}>Soporte Técnico</span>
            <span>•</span>
            <span style={s.pieLink}>Privacidad</span>
          </div>
        </div>
      </div>
    </div>
  );
}