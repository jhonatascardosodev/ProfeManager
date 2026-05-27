import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ApiError,
  type ApiClassroom,
  createClassroom,
  deleteClassroom,
  listClassrooms,
  updateClassroom,
} from '../lib/api'

type Seat = { seat: number; name: string; tag: string }

export default function ClassroomMapPage() {
  const [subject, setSubject] = useState('Matemática')
  const [studentCount, setStudentCount] = useState(24)
  const [rows, setRows] = useState(4)
  const [mode, setMode] = useState<'separado' | 'juntos' | 'aleatorio'>('separado')
  const [saved, setSaved] = useState<ApiClassroom[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const seats = useMemo((): Seat[] => {
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

  useEffect(() => {
    listClassrooms()
      .then(setSaved)
      .catch(() => setSaved([]))
  }, [])

  function loadClassroom(classroom: ApiClassroom) {
    setSubject(classroom.subject)
    setStudentCount(classroom.student_count)
    setRows(classroom.rows)
    setMode(classroom.mode as 'separado' | 'juntos' | 'aleatorio')
    setActiveId(classroom.id)
    setMessage(`Turma "${classroom.subject}" carregada.`)
    setError(null)
  }

  async function handleSave() {
    setLoading(true)
    setError(null)
    setMessage(null)
    const payload = {
      subject: subject.trim() || 'Sem matéria',
      student_count: seats.length,
      rows,
      mode,
      seats,
    }

    try {
      if (activeId !== null) {
        const updated = await updateClassroom(activeId, payload)
        setSaved((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        setMessage('Mapa atualizado com sucesso.')
      } else {
        const created = await createClassroom(payload)
        setSaved((prev) => [created, ...prev])
        setActiveId(created.id)
        setMessage('Mapa salvo com sucesso.')
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o mapa.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (activeId === null) return
    setLoading(true)
    setError(null)
    try {
      await deleteClassroom(activeId)
      setSaved((prev) => prev.filter((c) => c.id !== activeId))
      setActiveId(null)
      setMessage('Mapa removido.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível remover o mapa.')
    } finally {
      setLoading(false)
    }
  }

  function handleNew() {
    setActiveId(null)
    setSubject('Matemática')
    setStudentCount(24)
    setRows(4)
    setMode('separado')
    setMessage('Novo mapa iniciado.')
    setError(null)
  }

  return (
    <div className="login-card planner-card">
      <h1>Mapa da Sala</h1>
      <p className="login-sub">
        Organize os assentos da turma, escolha a matéria e defina como os alunos serão posicionados.
      </p>

      {message ? (
        <p className="form-success" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {saved.length > 0 ? (
        <section className="welcome-section">
          <h2>Mapas salvos</h2>
          <div className="lesson-plan-actions">
            <select
              className="select-field"
              value={activeId ?? ''}
              onChange={(e) => {
                const id = Number(e.target.value)
                const classroom = saved.find((c) => c.id === id)
                if (classroom) loadClassroom(classroom)
              }}
            >
              <option value="" disabled>
                Selecione um mapa salvo…
              </option>
              {saved.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.subject} — {c.student_count} alunos
                </option>
              ))}
            </select>
          </div>
        </section>
      ) : null}

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

      <div className="lesson-plan-actions">
        <button type="button" className="btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando…' : activeId ? 'Atualizar mapa' : 'Salvar mapa'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleNew} disabled={loading}>
          Novo mapa
        </button>
        {activeId ? (
          <button type="button" className="btn-secondary" onClick={handleDelete} disabled={loading}>
            Excluir
          </button>
        ) : null}
      </div>

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
