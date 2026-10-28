import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ApiError, login } from '../lib/api'
import { translateApiMessage } from '../lib/errors'
import { loginSchema, type LoginValues } from '../lib/schemas'
import { useAuth } from '../context/authStore'
import PasswordInput from '../components/PasswordInput'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  async function onSubmit(values: LoginValues) {
    setError(null)
    try {
      const result = await login(values.email, values.password)
      authLogin(
        result.access_token,
        { name: result.user.name, email: result.user.email },
        values.remember,
      )
      toast.success(`Olá, ${result.user.name}!`)
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
    }
  }

  return (
    <div className="login-card">
      <header className="login-header">
        <h1>Bem-vindo de volta</h1>
        <p className="login-sub">Entre com sua conta para acessar o painel do professor.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="form-field">
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={errors.email ? true : undefined}
            {...register('email')}
          />
          {errors.email ? <p className="field-error">{errors.email.message}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="login-password">Senha</label>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            aria-invalid={errors.password ? true : undefined}
            {...register('password')}
          />
          {errors.password ? <p className="field-error">{errors.password.message}</p> : null}
        </div>

        <div className="form-row">
          <label className="checkbox">
            <input type="checkbox" {...register('remember')} />
            Lembrar de mim
          </label>
          <Link className="link-muted" to="/esqueci-senha">
            Esqueci a senha
          </Link>
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="btn-spinner" size={18} aria-hidden /> Entrando…
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <p className="login-footer">
        Não tem conta?{' '}
        <Link to="/criar-conta">Criar conta</Link>
      </p>
    </div>
  )
}
