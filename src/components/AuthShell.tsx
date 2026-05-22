import { Link, Outlet } from 'react-router-dom'
import { logoProfmBrand } from '../assets'

export default function AuthShell() {
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
