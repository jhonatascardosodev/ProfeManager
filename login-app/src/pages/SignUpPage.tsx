import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const n = name.trim()
    if (!n || !email.trim() || !password) {
      setError('Preencha nome, e-mail e senha.')
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
    window.setTimeout(() => {
      setLoading(false)
      console.info('Cadastro (demo)', { name: n, email: email.trim() })
    }, 650)
  }

  return (
    <div className="login-card login-card--signup">
      <h1>Criar conta</h1>
      <p className="login-sub">Preencha os dados para começar a usar o ProfeManager.</p>

      <form onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="form-field">
          <label htmlFor="signup-name">Nome completo</label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="signup-email">E-mail</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="signup-password">Senha</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="signup-confirm">Confirmar senha</label>
          <input
            id="signup-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>

      <p className="login-footer">
        Já tem uma conta? <Link to="/entrar">Entrar</Link>
      </p>
    </div>
  )
}
