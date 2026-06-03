import { type FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError, resetPassword } from '../lib/api'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams])

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError('Link inválido. Solicite uma nova redefinição de senha.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      const result = await resetPassword(token, password)
      setSuccess(result.message)
      window.setTimeout(() => navigate('/entrar', { replace: true }), 2000)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível redefinir a senha.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="login-card">
        <h1>Redefinir senha</h1>
        <p className="form-error" role="alert">
          Link inválido ou ausente.
        </p>
        <p className="login-footer">
          <Link to="/esqueci-senha">Solicitar novo link</Link>
          {' · '}
          <Link to="/entrar">Entrar</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="login-card">
      <h1>Nova senha</h1>
      <p className="login-sub">Defina uma nova senha para sua conta.</p>

      {success ? (
        <p className="form-success" role="status">
          {success}
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="reset-password">Nova senha</label>
            <input
              id="reset-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="reset-confirm">Confirmar senha</label>
            <input
              id="reset-confirm"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando…' : 'Redefinir senha'}
          </button>
        </form>
      )}

      <p className="login-footer">
        <Link to="/entrar">Voltar para entrar</Link>
      </p>
    </div>
  )
}
