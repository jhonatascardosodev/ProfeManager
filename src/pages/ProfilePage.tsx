import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { ApiError } from '../lib/api'
import { useChangePassword, useMeQuery, useUpdateProfile } from '../lib/queries'
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordValues,
  type ProfileValues,
} from '../lib/schemas'
import { useAuth } from '../context/authStore'
import PasswordInput from '../components/PasswordInput'
import QueryState from '../components/QueryState'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function SubmitLabel({ pending, idle, busy }: { pending: boolean; idle: string; busy: string }) {
  return pending ? (
    <>
      <Loader2 className="btn-spinner" size={18} aria-hidden /> {busy}
    </>
  ) : (
    idle
  )
}

export default function ProfilePage() {
  const { updateUser } = useAuth()
  const meQuery = useMeQuery()
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()

  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    // Sincroniza o formulário com os dados do servidor quando chegam ou são atualizados.
    values: meQuery.data ? { name: meQuery.data.name, email: meQuery.data.email } : undefined,
  })

  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  async function onProfileSubmit(values: ProfileValues) {
    setProfileError(null)
    try {
      const updated = await updateProfileMutation.mutateAsync(values)
      updateUser({ name: updated.name, email: updated.email })
      toast.success('Perfil atualizado com sucesso.')
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : 'Não foi possível atualizar o perfil.')
    }
  }

  async function onPasswordSubmit(values: ChangePasswordValues) {
    setPasswordError(null)
    try {
      const result = await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      passwordForm.reset()
      toast.success(result.message)
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : 'Não foi possível alterar a senha.')
    }
  }

  if (!meQuery.data) {
    return (
      <div className="login-card profile-card">
        <QueryState
          isLoading={meQuery.isLoading}
          isError={meQuery.isError}
          onRetry={() => meQuery.refetch()}
          errorMessage="Não foi possível carregar os dados do perfil."
        />
      </div>
    )
  }

  const profileErrors = profileForm.formState.errors
  const passwordErrors = passwordForm.formState.errors

  return (
    <div className="login-card profile-card">
      <h1>Perfil do Professor</h1>
      <p className="login-sub">Gerencie seus dados pessoais e a senha de acesso.</p>

      <p className="profile-meta">
        Membro desde <strong>{formatDate(meQuery.data.created_at)}</strong>
      </p>

      <section className="lesson-plan-section">
        <h2>Dados pessoais</h2>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} noValidate>
          {profileError ? (
            <p className="form-error" role="alert">
              {profileError}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="profile-name">Nome completo</label>
            <input
              id="profile-name"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              aria-invalid={profileErrors.name ? true : undefined}
              {...profileForm.register('name')}
            />
            {profileErrors.name ? <p className="field-error">{profileErrors.name.message}</p> : null}
          </div>

          <div className="form-field">
            <label htmlFor="profile-email">E-mail</label>
            <input
              id="profile-email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              aria-invalid={profileErrors.email ? true : undefined}
              {...profileForm.register('email')}
            />
            {profileErrors.email ? (
              <p className="field-error">{profileErrors.email.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={profileForm.formState.isSubmitting}
          >
            <SubmitLabel
              pending={profileForm.formState.isSubmitting}
              idle="Salvar alterações"
              busy="Salvando…"
            />
          </button>
        </form>
      </section>

      <section className="lesson-plan-section">
        <h2>Alterar senha</h2>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} noValidate>
          {passwordError ? (
            <p className="form-error" role="alert">
              {passwordError}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="profile-current-password">Senha atual</label>
            <PasswordInput
              id="profile-current-password"
              autoComplete="current-password"
              placeholder="Sua senha atual"
              aria-invalid={passwordErrors.currentPassword ? true : undefined}
              {...passwordForm.register('currentPassword')}
            />
            {passwordErrors.currentPassword ? (
              <p className="field-error">{passwordErrors.currentPassword.message}</p>
            ) : null}
          </div>

          <div className="form-field">
            <label htmlFor="profile-new-password">Nova senha</label>
            <PasswordInput
              id="profile-new-password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              aria-invalid={passwordErrors.newPassword ? true : undefined}
              {...passwordForm.register('newPassword')}
            />
            {passwordErrors.newPassword ? (
              <p className="field-error">{passwordErrors.newPassword.message}</p>
            ) : null}
          </div>

          <div className="form-field">
            <label htmlFor="profile-confirm-password">Confirmar nova senha</label>
            <PasswordInput
              id="profile-confirm-password"
              autoComplete="new-password"
              placeholder="Repita a nova senha"
              aria-invalid={passwordErrors.confirmPassword ? true : undefined}
              {...passwordForm.register('confirmPassword')}
            />
            {passwordErrors.confirmPassword ? (
              <p className="field-error">{passwordErrors.confirmPassword.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={passwordForm.formState.isSubmitting}
          >
            <SubmitLabel
              pending={passwordForm.formState.isSubmitting}
              idle="Alterar senha"
              busy="Alterando…"
            />
          </button>
        </form>
      </section>

      <p className="login-footer">
        <Link to="/boas-vindas">Voltar ao painel</Link>
      </p>
    </div>
  )
}
