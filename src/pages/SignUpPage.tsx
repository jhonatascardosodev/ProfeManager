import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, signup } from '../lib/api'
import { signUpSchema, type SignUpValues } from '../lib/schemas'
import { useAuth } from '../context/authStore'
import PasswordInput from '../components/PasswordInput'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit(values: SignUpValues) {
    setError(null)
    try {
      const result = await signup(values.name, values.email, values.password)
      authLogin(result.access_token, { name: result.user.name, email: result.user.email })
      toast.success('Conta criada com sucesso!')
      navigate('/boas-vindas', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar a conta.')
    }
  }

  return (
    <div className="login-card login-card--signup">
      <h1>Criar conta</h1>
      <p className="login-sub">Preencha os dados para começar a usar o ProfeManager.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="form-field">
          <label htmlFor="signup-name">Nome completo</label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            aria-invalid={errors.name ? true : undefined}
            {...register('name')}
          />
          {errors.name ? <p className="field-error">{errors.name.message}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="signup-email">E-mail</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={errors.email ? true : undefined}
            {...register('email')}
          />
          {errors.email ? <p className="field-error">{errors.email.message}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="signup-password">Senha</label>
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            aria-invalid={errors.password ? true : undefined}
            {...register('password')}
          />
          {errors.password ? <p className="field-error">{errors.password.message}</p> : null}
        </div>

        <div className="form-field">
          <label htmlFor="signup-confirm">Confirmar senha</label>
          <PasswordInput
            id="signup-confirm"
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
              <Loader2 className="btn-spinner" size={18} aria-hidden /> Criando conta…
            </>
          ) : (
            'Criar conta'
          )}
        </button>
      </form>

      <p className="login-footer">
        Já tem uma conta? <Link to="/entrar">Entrar</Link>
      </p>
    </div>
  )
}
