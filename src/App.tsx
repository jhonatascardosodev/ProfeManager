import { type FormEvent, useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.')
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      // Demo: só mostra no console — troque por chamada à API real
      console.info('Login (demo)', { email: email.trim(), remember })
    }, 650)
  }

  return (
    <div className="login-page">
      <aside className="login-aside" aria-label="Apresentação da marca">
        <div className="brand">
          <a className="brand-mark" href="/">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
              <rect width="36" height="36" rx="10" fill="#ffffff" />
              <path
                d="M11 24V12h4.2c2.4 0 4 1.5 4 3.6 0 1.2-.5 2.2-1.4 2.9l2.4 5.5h-2.8l-2.1-5h-1.3V24H11zm4.2-7.8c1 0 1.6-.6 1.6-1.5 0-.9-.6-1.5-1.6-1.5h-1.4v3h1.4z"
                fill="#1d4ed8"
              />
            </svg>
            ProfeManager
          </a>
        </div>
      </aside>

      <main className="login-main">
        <div className="login-card">
          <h1>Entrar</h1>
          <p className="login-sub">Digite suas credenciais para continuar.</p>

          <form onSubmit={handleSubmit} noValidate>
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(ev) => setRemember(ev.target.checked)}
                />
                Lembrar de mim
              </label>
              <button type="button" className="link-muted">
                Esqueci a senha
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="login-footer">
            Não tem conta? <a href="#">Criar conta</a>
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
