import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import QueryState from '../components/QueryState'
import { ApiError, type ApiClassroom } from '../lib/api'
import {
  useClassroomsQuery,
  useCreateClassroom,
  useDeleteClassroom,
  useUpdateClassroom,
} from '../lib/queries'

type Seat = { seat: number; name: string; tag: string }

/** PRNG determinístico (mulberry32): mesma semente, mesma ordem — mantém o render puro. */
function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function ClassroomMapPage() {
  const [subject, setSubject] = useState('Matemática')
  const [studentCount, setStudentCount] = useState(24)
  const [rows, setRows] = useState(4)
  const [mode, setMode] = useState<'separado' | 'juntos' | 'aleatorio'>('separado')
  const [shuffleSeed, setShuffleSeed] = useState(1)
  const [activeId, setActiveId] = useState<number | null>(null)
  const classroomsQuery = useClassroomsQuery()
  const createMutation = useCreateClassroom()
  const updateMutation = useUpdateClassroom()
  const deleteMutation = useDeleteClassroom()
  const saved = classroomsQuery.data ?? []
  const loading =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const seats = useMemo((): Seat[] => {
    const total = Math.max(1, Math.min(50, studentCount))
    const students = Array.from({ length: total }, (_, index) => `Aluno ${index + 1}`)

    if (mode === 'aleatorio') {
      const random = seededRandom(shuffleSeed)
      const shuffled = [...students]
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1))
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
  }, [studentCount, mode, shuffleSeed])

  const seatsPerRow = Math.max(1, Math.ceil(seats.length / Math.max(1, rows)))

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
        await updateMutation.mutateAsync({ id: activeId, payload })
        setMessage('Mapa atualizado com sucesso.')
      } else {
        const created = await createMutation.mutateAsync(payload)
        setActiveId(created.id)
        setMessage('Mapa salvo com sucesso.')
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o mapa.')
    }
  }

  async function handleDelete() {
    if (activeId === null) return
    setError(null)
    try {
      await deleteMutation.mutateAsync(activeId)
      setActiveId(null)
      setMessage('Mapa removido.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível remover o mapa.')
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

      <QueryState
        isLoading={classroomsQuery.isLoading}
        isError={classroomsQuery.isError}
        onRetry={() => classroomsQuery.refetch()}
        errorMessage="Não foi possível carregar os mapas salvos."
      />

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
            onChange={(event) => {
              setStudentCount(Number(event.target.value))
              setShuffleSeed(Math.floor(Math.random() * 2 ** 32))
            }}
          />
        </div>

        <div className="form-field">
          <label htmlFor="mode">Regra de assento</label>
          <select
            id="mode"
            className="select-field"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as 'separado' | 'juntos' | 'aleatorio')
              setShuffleSeed(Math.floor(Math.random() * 2 ** 32))
            }}
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
