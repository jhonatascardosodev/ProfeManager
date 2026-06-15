import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logoProfmBrand } from '../assets'
import { useAuth } from '../context/AuthContext'

const AUTH_ROUTES = new Set(['/entrar', '/criar-conta', '/esqueci-senha', '/redefinir-senha'])

function LogoutIcon() {
  return (
    <svg className="app-rail-icon-svg" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
      />
    </svg>
  )
}

export default function AuthShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout, status } = useAuth()
  const isAuthRoute = AUTH_ROUTES.has(pathname)
  const isAppRoute = status === 'authenticated' && !isAuthRoute

  function handleLogout() {
    logout()
    navigate('/entrar', { replace: true })
  }

  if (isAppRoute) {
    const profileActive = pathname === '/perfil'
    const teacherInitial = (user?.name?.trim().charAt(0) || 'P').toUpperCase()

    return (
      <div className="login-page login-page--app">
        <aside className="app-rail" aria-label="Navegação do professor">
          <Link className="app-rail-brand" to="/boas-vindas" title="Painel de serviços">
            <img className="app-rail-logo" src={logoProfmBrand} alt="PROFM" />
          </Link>

          <nav className="app-rail-nav">
            <Link
              className={`app-rail-link${profileActive ? ' app-rail-link--active' : ''}`}
              to="/perfil"
              title="Meu perfil"
              aria-current={profileActive ? 'page' : undefined}
            >
              <span className="app-rail-avatar" aria-hidden>
                {teacherInitial}
              </span>
              <span className="app-rail-label">Perfil</span>
            </Link>
          </nav>

          <button type="button" className="app-rail-link app-rail-link--logout" onClick={handleLogout}>
            <LogoutIcon />
            <span className="app-rail-label">Sair</span>
          </button>
        </aside>

        <main className="login-main login-main--app">
          <Outlet />
        </main>
      </div>
    )
  }

  if (!isAuthRoute) {
    return (
      <div className="login-page login-page--solo">
        <main className="login-main">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="login-page">
      <aside className="login-aside" aria-label="Apresentação da marca">
        <div className="brand">
          <Link className="brand-mark" to="/entrar">
            <img className="brand-logo" src={logoProfmBrand} alt="Logo PROFM" />
          </Link>
        </div>
      </aside>

      <main className="login-main">
        <Outlet />
      </main>
    </div>
  )
}
