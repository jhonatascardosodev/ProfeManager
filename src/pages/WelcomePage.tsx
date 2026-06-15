import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function WelcomePage() {
  const { user } = useAuth()
  const teacherName = user?.name ?? 'Professor'

  return (
    <div className="login-card service-hub-card">
      <p className="welcome-banner">
        Seja bem-vindo, professor <strong>{teacherName}</strong>!
      </p>

      <h1>Painel de Serviços</h1>
      <p className="login-sub">
        Escolha um módulo do ProfeManager para continuar.
      </p>

      <section className="service-grid">
        <Link className="service-card service-card--active" to="/mapa-sala">
          <span className="service-icon" aria-hidden>
            🪑
          </span>
          <strong>Mapa de Sala</strong>
          <p>Defina matéria, quantidade de alunos e regras de assento.</p>
        </Link>

        <Link className="service-card service-card--active" to="/notas-desempenho">
          <span className="service-icon" aria-hidden>
            📊
          </span>
          <strong>Notas e Desempenho</strong>
          <p>Lançamento de notas e acompanhamento da evolução da turma.</p>
        </Link>

        <Link className="service-card service-card--active" to="/planejamento-aula">
          <span className="service-icon" aria-hidden>
            📅
          </span>
          <strong>Planejamento de Aula</strong>
          <p>Assunto, livros, materiais, atividades e avaliação.</p>
        </Link>

        <article className="service-card service-card--soon">
          <span className="service-icon" aria-hidden>
            📝
          </span>
          <strong>Relatórios</strong>
          <p>Resumo de frequência, notas e observações por aluno.</p>
        </article>
      </section>
    </div>
  )
}
