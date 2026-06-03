import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, forgotPassword } from '../lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [devResetLink, setDevResetLink] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setDevResetLink(null)

    if (!email.trim()) {
      setError('Informe seu e-mail.')
      return
    }

    setLoading(true)
    try {
      const result = await forgotPassword(email.trim())
      setMessage(result.message)
      if (result.reset_link) {
        setDevResetLink(result.reset_link)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível enviar o pedido.')
    } finally {
      setLoading(false)
    }
  }

  const sent = Boolean(message)

  return (
    <div className="login-card">
      <h1>Esqueci a senha</h1>
      <p className="login-sub">
        {sent
          ? message
          : 'Informe seu e-mail para receber o link de redefinição.'}
      </p>

      {sent ? (
        <>
          {devResetLink ? (
            <p className="form-success" role="status">
              Modo desenvolvimento: use o link abaixo para redefinir a senha.
              <br />
              <Link
                className="link-muted"
                to={`/redefinir-senha?token=${new URL(devResetLink).searchParams.get('token') ?? ''}`}
              >
                Abrir página de redefinição
              </Link>
            </p>
          ) : null}
          <p className="login-footer" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
            <Link to="/entrar">Voltar para entrar</Link>
          </p>
        </>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="forgot-email">E-mail</label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar link'}
          </button>

          <p className="login-footer">
            <Link to="/entrar">Voltar para entrar</Link>
          </p>
        </form>
      )}
    </div>
  )
}
