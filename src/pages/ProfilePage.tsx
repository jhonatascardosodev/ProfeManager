import { type FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, changePassword, fetchMe, updateProfile } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [memberSince, setMemberSince] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      try {
        const apiUser = await fetchMe()
        if (cancelled) return
        setName(apiUser.name)
        setEmail(apiUser.email)
        setMemberSince(apiUser.created_at)
      } catch {
        if (!cancelled) {
          setProfileError('Não foi possível carregar os dados do perfil.')
        }
      } finally {
        if (!cancelled) setPageLoading(false)
      }
    }

    loadProfile()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    setProfileError(null)
    setProfileMessage(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName || !trimmedEmail) {
      setProfileError('Preencha nome e e-mail.')
      return
    }

    setProfileLoading(true)
    try {
      const updated = await updateProfile({ name: trimmedName, email: trimmedEmail })
      updateUser({ name: updated.name, email: updated.email })
      setName(updated.name)
      setEmail(updated.email)
      setProfileMessage('Perfil atualizado com sucesso.')
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : 'Não foi possível atualizar o perfil.')
    } finally {
      setProfileLoading(false)
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordMessage(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Preencha todos os campos de senha.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.')
      return
    }

    setPasswordLoading(true)
    try {
      const result = await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage(result.message)
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : 'Não foi possível alterar a senha.')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="login-card profile-card">
        <p className="login-sub" role="status">
          Carregando perfil…
        </p>
      </div>
    )
  }

  return (
    <div className="login-card profile-card">
      <h1>Perfil do Professor</h1>
      <p className="login-sub">Gerencie seus dados pessoais e a senha de acesso.</p>

      {memberSince ? (
        <p className="profile-meta">
          Membro desde <strong>{formatDate(memberSince)}</strong>
        </p>
      ) : null}

      <section className="lesson-plan-section">
        <h2>Dados pessoais</h2>

        <form onSubmit={handleProfileSubmit} noValidate>
          {profileError ? (
            <p className="form-error" role="alert">
              {profileError}
            </p>
          ) : null}
          {profileMessage ? (
            <p className="form-success" role="status">
              {profileMessage}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="profile-name">Nome completo</label>
            <input
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="profile-email">E-mail</label>
            <input
              id="profile-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={profileLoading}>
            {profileLoading ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </form>
      </section>

      <section className="lesson-plan-section">
        <h2>Alterar senha</h2>

        <form onSubmit={handlePasswordSubmit} noValidate>
          {passwordError ? (
            <p className="form-error" role="alert">
              {passwordError}
            </p>
          ) : null}
          {passwordMessage ? (
            <p className="form-success" role="status">
              {passwordMessage}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="profile-current-password">Senha atual</label>
            <input
              id="profile-current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha atual"
              value={currentPassword}
              onChange={(ev) => setCurrentPassword(ev.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="profile-new-password">Nova senha</label>
            <input
              id="profile-new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(ev) => setNewPassword(ev.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="profile-confirm-password">Confirmar nova senha</label>
            <input
              id="profile-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={passwordLoading}>
            {passwordLoading ? 'Alterando…' : 'Alterar senha'}
          </button>
        </form>
      </section>

      <p className="login-footer">
        <Link to="/boas-vindas">Voltar ao painel</Link>
      </p>
    </div>
  )
}
