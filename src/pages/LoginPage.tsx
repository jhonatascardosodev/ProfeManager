import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
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
      console.info('Login (demo)', { email: email.trim(), remember })
    }, 650)
  }

  return (
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
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="login-password">Senha</label>
          <input
            id="login-password"
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
          <Link className="link-muted" to="/esqueci-senha">
            Esqueci a senha
          </Link>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="login-footer">
        Não tem conta?{' '}
        <Link to="/criar-conta">Criar conta</Link>
      </p>
    </div>
  )
}
