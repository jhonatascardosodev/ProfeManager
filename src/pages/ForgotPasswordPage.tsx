import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ApiError, forgotPassword } from '../lib/api'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../lib/schemas'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [devResetLink, setDevResetLink] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    setError(null)
    setMessage(null)
    setDevResetLink(null)

    try {
      const result = await forgotPassword(values.email)
      setMessage(result.message)
      if (result.reset_link) {
        setDevResetLink(result.reset_link)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível enviar o pedido.')
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="forgot-email">E-mail</label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              aria-invalid={errors.email ? true : undefined}
              {...register('email')}
            />
            {errors.email ? <p className="field-error">{errors.email.message}</p> : null}
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="btn-spinner" size={18} aria-hidden /> Enviando…
              </>
            ) : (
              'Enviar link'
            )}
          </button>

          <p className="login-footer">
            <Link to="/entrar">Voltar para entrar</Link>
          </p>
        </form>
      )}
    </div>
  )
}
