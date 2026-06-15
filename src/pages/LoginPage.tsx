import { type FormEvent, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ApiError, login } from '../lib/api'
import { isValidEmail, translateApiMessage } from '../lib/errors'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Preencha e-mail e senha.')
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Informe um e-mail válido.')
      return
    }

    setLoading(true)
    try {
      const result = await login(trimmedEmail, password)
      authLogin(result.access_token, { name: result.user.name, email: result.user.email })
      if (!remember) {
        // token stays; "remember" could gate sessionStorage vs localStorage later
      }
      const redirectTo =
        (location.state as { from?: string } | null)?.from ?? '/boas-vindas'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof TypeError) {
        setError(translateApiMessage('Failed to fetch'))
      } else {
        setError('Não foi possível entrar. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-card">
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
