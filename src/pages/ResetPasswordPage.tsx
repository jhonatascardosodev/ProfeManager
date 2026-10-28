import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError, resetPassword } from '../lib/api'
import { resetPasswordSchema, type ResetPasswordValues } from '../lib/schemas'
import PasswordInput from '../components/PasswordInput'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams])

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(values: ResetPasswordValues) {
    setError(null)
    try {
      const result = await resetPassword(token, values.password)
      setSuccess(result.message)
      toast.success('Senha redefinida!')
      window.setTimeout(() => navigate('/entrar', { replace: true }), 2000)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível redefinir a senha.')
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="reset-password">Nova senha</label>
            <PasswordInput
              id="reset-password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              aria-invalid={errors.password ? true : undefined}
              {...register('password')}
            />
            {errors.password ? <p className="field-error">{errors.password.message}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="reset-confirm">Confirmar senha</label>
            <PasswordInput
              id="reset-confirm"
              autoComplete="new-password"
              placeholder="Repita a senha"
              aria-invalid={errors.confirmPassword ? true : undefined}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <p className="field-error">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="btn-spinner" size={18} aria-hidden /> Salvando…
              </>
            ) : (
              'Redefinir senha'
            )}
          </button>
        </form>
      )}

      <p className="login-footer">
        <Link to="/entrar">Voltar para entrar</Link>
      </p>
    </div>
  )
}
