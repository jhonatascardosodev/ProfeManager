import { Link, Outlet } from 'react-router-dom'
import logo from '../Profmlogo-transparent.png'

export default function AuthShell() {
  return (
    <div className="login-page">
      <aside className="login-aside" aria-label="Apresentação da marca">
        <div className="brand">
          <Link className="brand-mark" to="/entrar">
            <img className="brand-logo" src={logo} alt="Logo PROFMLOGO" />
          </Link>
        </div>
      </aside>

      <main className="login-main">
        <Outlet />
      </main>
    </div>
  )
}
