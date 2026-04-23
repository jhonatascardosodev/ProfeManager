import { Link } from 'react-router-dom'

export default function WelcomePage() {
  return (
    <div className="login-card service-hub-card">
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

        <article className="service-card service-card--soon">
          <span className="service-icon" aria-hidden>
            📊
          </span>
          <strong>Notas e Desempenho</strong>
          <p>Lançamento de notas e acompanhamento da evolução da turma.</p>
        </article>

        <article className="service-card service-card--soon">
          <span className="service-icon" aria-hidden>
            📅
          </span>
          <strong>Planejamento</strong>
          <p>Agenda de aulas, atividades e cronograma semanal.</p>
        </article>

        <article className="service-card service-card--soon">
          <span className="service-icon" aria-hidden>
            📝
          </span>
          <strong>Relatórios</strong>
          <p>Resumo de frequência, notas e observações por aluno.</p>
        </article>
      </section>

      <p className="login-footer">
        <Link to="/entrar">Sair</Link>
      </p>
    </div>
  )
}
