import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, createGrade, deleteGrade, listGrades, updateGrade } from '../lib/api'
import { gradeFromApi, gradeToApi } from '../lib/mappers'
import {
  calculateAverage,
  EMPTY_STUDENT_GRADE,
  performanceStatus,
  STATUS_LABELS,
  type StudentGrade,
} from '../types/grade'

function parseScore(value: string): number | null {
  if (!value.trim()) return null
  const num = Number(value.replace(',', '.'))
  if (Number.isNaN(num) || num < 0 || num > 10) return null
  return Math.round(num * 10) / 10
}

export default function GradesPage() {
  const [form, setForm] = useState(EMPTY_STUDENT_GRADE)
  const [entries, setEntries] = useState<StudentGrade[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterSubject, setFilterSubject] = useState('')
  const [filterClass, setFilterClass] = useState('')

  async function loadEntries(subject?: string) {
    try {
      const items = await listGrades(subject || undefined)
      setEntries(items.map(gradeFromApi))
    } catch {
      setEntries([])
    }
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      const matchSubject = !filterSubject || entry.subject === filterSubject
      const matchClass = !filterClass || entry.gradeClass === filterClass
      return matchSubject && matchClass
    })
  }, [entries, filterSubject, filterClass])

  const subjects = useMemo(
    () => [...new Set(entries.map((e) => e.subject).filter(Boolean))].sort(),
    [entries],
  )

  const classes = useMemo(
    () => [...new Set(entries.map((e) => e.gradeClass).filter(Boolean))].sort(),
    [entries],
  )

  const stats = useMemo(() => {
    const averages = filtered
      .map((entry) => calculateAverage(entry))
      .filter((avg): avg is number => avg !== null)

    if (averages.length === 0) {
      return { classAverage: null, highest: null, lowest: null, approved: 0, recovery: 0, failed: 0 }
    }

    let approved = 0
    let recovery = 0
    let failed = 0

    filtered.forEach((entry) => {
      const status = performanceStatus(calculateAverage(entry))
      if (status === 'aprovado') approved += 1
      if (status === 'recuperacao') recovery += 1
      if (status === 'reprovado') failed += 1
    })

    return {
      classAverage: Math.round((averages.reduce((a, b) => a + b, 0) / averages.length) * 10) / 10,
      highest: Math.max(...averages),
      lowest: Math.min(...averages),
      approved,
      recovery,
      failed,
    }
  }, [filtered])

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(EMPTY_STUDENT_GRADE)
    setEditingId(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.studentName.trim() || !form.subject.trim()) {
      setMessage(null)
      setError('Preencha o nome do aluno e a disciplina.')
      return
    }

    setLoading(true)
    try {
      const payload = gradeToApi(form)
      if (editingId) {
        const updated = await updateGrade(Number(editingId), payload)
        const mapped = gradeFromApi(updated)
        setEntries((prev) => prev.map((item) => (item.id === editingId ? mapped : item)))
        setMessage('Notas atualizadas.')
      } else {
        const created = await createGrade(payload)
        const mapped = gradeFromApi(created)
        setEntries((prev) => [mapped, ...prev])
        setMessage('Notas lançadas com sucesso.')
      }
      resetForm()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar as notas.')
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(entry: StudentGrade) {
    setForm({
      studentName: entry.studentName,
      subject: entry.subject,
      gradeClass: entry.gradeClass,
      exam1: entry.exam1,
      exam2: entry.exam2,
      exam3: entry.exam3,
      assignment: entry.assignment,
      participation: entry.participation,
      notes: entry.notes,
    })
    setEditingId(entry.id)
    setMessage(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: string) {
    setLoading(true)
    setError(null)
    try {
      await deleteGrade(Number(id))
      setEntries((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) resetForm()
      setMessage('Registro removido.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível remover o registro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-card grades-card">
      <h1>Notas e Desempenho</h1>
      <p className="login-sub">
        Lance notas por aluno e acompanhe a média e o desempenho da turma.
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

      <section className="grades-stats">
        <article className="grades-stat">
          <span>Média da turma</span>
          <strong>{stats.classAverage ?? '—'}</strong>
        </article>
        <article className="grades-stat">
          <span>Maior média</span>
          <strong>{stats.highest ?? '—'}</strong>
        </article>
        <article className="grades-stat">
          <span>Menor média</span>
          <strong>{stats.lowest ?? '—'}</strong>
        </article>
        <article className="grades-stat grades-stat--ok">
          <span>Aprovados</span>
          <strong>{stats.approved}</strong>
        </article>
        <article className="grades-stat grades-stat--warn">
          <span>Recuperação</span>
          <strong>{stats.recovery}</strong>
        </article>
        <article className="grades-stat grades-stat--danger">
          <span>Reprovados</span>
          <strong>{stats.failed}</strong>
        </article>
      </section>

      <form className="grades-form" onSubmit={handleSubmit} noValidate>
        <section className="lesson-plan-section">
          <h2>Lançar notas</h2>
          <div className="planner-controls lesson-plan-grid">
            <div className="form-field">
              <label htmlFor="g-student">Aluno *</label>
              <input
                id="g-student"
                value={form.studentName}
                onChange={(e) => updateField('studentName', e.target.value)}
                placeholder="Ex.: Maria Silva"
              />
            </div>
            <div className="form-field">
              <label htmlFor="g-subject">Disciplina *</label>
              <input
                id="g-subject"
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="Ex.: Matemática"
              />
            </div>
            <div className="form-field">
              <label htmlFor="g-class">Turma</label>
              <input
                id="g-class"
                value={form.gradeClass}
                onChange={(e) => updateField('gradeClass', e.target.value)}
                placeholder="Ex.: 8º ano A"
              />
            </div>
          </div>

          <div className="planner-controls grades-scores-grid">
            {(
              [
                ['exam1', 'Prova 1', form.exam1],
                ['exam2', 'Prova 2', form.exam2],
                ['exam3', 'Prova 3', form.exam3],
                ['assignment', 'Trabalho', form.assignment],
                ['participation', 'Participação', form.participation],
              ] as const
            ).map(([key, label, value]) => (
              <div className="form-field" key={key}>
                <label htmlFor={`g-${key}`}>{label}</label>
                <input
                  id={`g-${key}`}
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={value ?? ''}
                  onChange={(e) => updateField(key, parseScore(e.target.value))}
                  placeholder="0–10"
                />
              </div>
            ))}
          </div>

          <div className="form-field">
            <label htmlFor="g-notes">Observações</label>
            <textarea
              id="g-notes"
              className="textarea-field"
              rows={2}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Faltas, recuperação, adaptações..."
            />
          </div>
        </section>

        <div className="lesson-plan-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando…' : editingId ? 'Atualizar notas' : 'Salvar notas'}
          </button>
          {editingId ? (
            <button type="button" className="btn-secondary" onClick={resetForm} disabled={loading}>
              Cancelar edição
            </button>
          ) : null}
        </div>
      </form>

      <section className="welcome-section grades-list-section">
        <div className="grades-list-header">
          <h2>Desempenho dos alunos ({filtered.length})</h2>
          <div className="grades-filters">
            <select
              className="select-field"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">Todas as disciplinas</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <select
              className="select-field"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">Todas as turmas</option>
              {classes.map((gradeClass) => (
                <option key={gradeClass} value={gradeClass}>
                  {gradeClass}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="lesson-plan-empty">Nenhuma nota lançada ainda.</p>
        ) : (
          <div className="grades-table-wrap">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Disciplina</th>
                  <th>P1</th>
                  <th>P2</th>
                  <th>P3</th>
                  <th>Trab.</th>
                  <th>Part.</th>
                  <th>Média</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => {
                  const average = calculateAverage(entry)
                  const status = performanceStatus(average)
                  return (
                    <tr key={entry.id}>
                      <td>
                        <strong>{entry.studentName}</strong>
                        {entry.gradeClass ? (
                          <span className="grades-table-sub">{entry.gradeClass}</span>
                        ) : null}
                      </td>
                      <td>{entry.subject}</td>
                      <td>{entry.exam1 ?? '—'}</td>
                      <td>{entry.exam2 ?? '—'}</td>
                      <td>{entry.exam3 ?? '—'}</td>
                      <td>{entry.assignment ?? '—'}</td>
                      <td>{entry.participation ?? '—'}</td>
                      <td className="grades-average">{average ?? '—'}</td>
                      <td>
                        <span className={`grades-badge grades-badge--${status}`}>
                          {STATUS_LABELS[status]}
                        </span>
                      </td>
                      <td>
                        <div className="grades-table-actions">
                          <button type="button" className="btn-link" onClick={() => handleEdit(entry)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn-link btn-link--danger"
                            onClick={() => handleDelete(entry.id)}
                            disabled={loading}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="login-footer">
        <Link to="/boas-vindas">Voltar ao painel</Link>
      </p>
    </div>
  )
}
