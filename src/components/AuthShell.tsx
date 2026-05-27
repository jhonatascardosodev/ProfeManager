import { Link, Outlet, useLocation } from 'react-router-dom'
import { logoProfmBrand } from '../assets'

const AUTH_ROUTES = new Set(['/entrar', '/criar-conta', '/esqueci-senha'])

export default function AuthShell() {
  const { pathname } = useLocation()
  const isAuthRoute = AUTH_ROUTES.has(pathname)

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
