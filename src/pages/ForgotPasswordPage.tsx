import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Informe seu e-mail.')
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setSent(true)
      console.info('Recuperação de senha (demo)', { email: email.trim() })
    }, 650)
  }

  return (
    <div className="login-card">
      <h1>Esqueci a senha</h1>
      <p className="login-sub">
        {sent
          ? 'Se existir uma conta com esse e-mail, você receberá instruções em instantes.'
          : 'Informe seu e-mail para receber o link de redefinição.'}
      </p>

      {sent ? (
        <p className="login-footer" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
          <Link to="/entrar">Voltar para entrar</Link>
        </p>
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
