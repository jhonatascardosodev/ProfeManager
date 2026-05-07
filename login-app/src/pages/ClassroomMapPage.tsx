import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function ClassroomMapPage() {
  const [subject, setSubject] = useState('Matemática')
  const [studentCount, setStudentCount] = useState(24)
  const [rows, setRows] = useState(4)
  const [mode, setMode] = useState<'separado' | 'juntos' | 'aleatorio'>('separado')

  const seats = useMemo(() => {
    const total = Math.max(1, Math.min(50, studentCount))
    const students = Array.from({ length: total }, (_, index) => `Aluno ${index + 1}`)

    if (mode === 'aleatorio') {
      const shuffled = [...students]
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled.map((name, index) => ({
        seat: index + 1,
        name,
        tag: 'Aleatório',
      }))
    }

    if (mode === 'juntos') {
      return students.map((name, index) => ({
        seat: index + 1,
        name,
        tag: `Dupla ${Math.floor(index / 2) + 1}`,
      }))
    }

    return students.map((name, index) => ({
      seat: index + 1,
      name,
      tag: 'Separado',
    }))
  }, [studentCount, mode])

  const seatsPerRow = Math.max(1, Math.ceil(seats.length / Math.max(1, rows)))

  return (
    <div className="login-card planner-card">
      <h1>Mapa da Sala</h1>
      <p className="login-sub">
        Organize os assentos da turma, escolha a matéria e defina como os alunos serão posicionados.
      </p>

      <section className="planner-controls">
        <div className="form-field">
          <label htmlFor="subject">Matéria</label>
          <input
            id="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Ex.: Matemática"
          />
        </div>

        <div className="form-field">
          <label htmlFor="student-count">Quantidade de alunos</label>
          <input
            id="student-count"
            type="number"
            min={1}
            max={50}
            value={studentCount}
            onChange={(event) => setStudentCount(Number(event.target.value))}
          />
        </div>

        <div className="form-field">
          <label htmlFor="mode">Regra de assento</label>
          <select
            id="mode"
            className="select-field"
            value={mode}
            onChange={(event) => setMode(event.target.value as 'separado' | 'juntos' | 'aleatorio')}
          >
            <option value="separado">Separado</option>
            <option value="juntos">Juntos (em duplas)</option>
            <option value="aleatorio">Aleatório</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="rows">Quantidade de fileiras</label>
          <input
            id="rows"
            type="number"
            min={1}
            max={12}
            value={rows}
            onChange={(event) => setRows(Math.max(1, Number(event.target.value) || 1))}
          />
        </div>
      </section>

      <section className="welcome-section">
        <h2>
          {subject || 'Matéria não definida'} - {seats.length} alunos - {rows} fileiras
        </h2>
        <div className="seat-grid" style={{ gridTemplateColumns: `repeat(${seatsPerRow}, minmax(120px, 1fr))` }}>
          {seats.map((seat) => (
            <article className="seat-card" key={`${seat.seat}-${seat.name}`}>
              <p className="seat-number">Carteira {seat.seat}</p>
              <strong>{seat.name}</strong>
              <span className="seat-tag">{seat.tag}</span>
            </article>
          ))}
        </div>
      </section>

      <p className="login-footer">
        <Link to="/boas-vindas">Voltar ao painel</Link>
      </p>
    </div>
  )
}
