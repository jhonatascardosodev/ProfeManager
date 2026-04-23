import { Link, Outlet } from 'react-router-dom'

export default function AuthShell() {
  return (
    <div className="login-page">
      <aside className="login-aside" aria-label="Apresentação da marca">
        <div className="brand">
          <Link className="brand-mark" to="/entrar">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
              <rect width="36" height="36" rx="10" fill="#ffffff" />
              <path
                d="M11 24V12h4.2c2.4 0 4 1.5 4 3.6 0 1.2-.5 2.2-1.4 2.9l2.4 5.5h-2.8l-2.1-5h-1.3V24H11zm4.2-7.8c1 0 1.6-.6 1.6-1.5 0-.9-.6-1.5-1.6-1.5h-1.4v3h1.4z"
                fill="#1d4ed8"
              />
            </svg>
            ProfeManager
          </Link>
        </div>
      </aside>

      <main className="login-main">
        <Outlet />
      </main>
    </div>
  )
}
