import { type FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EMPTY_LESSON_PLAN, type LessonPlan } from '../types/lessonPlan'

const STORAGE_KEY = 'profemanager:lesson-plans'

function loadPlans(): LessonPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LessonPlan[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function savePlans(plans: LessonPlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export default function LessonPlanPage() {
  const [form, setForm] = useState(EMPTY_LESSON_PLAN)
  const [plans, setPlans] = useState<LessonPlan[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setPlans(loadPlans())
  }, [])

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(EMPTY_LESSON_PLAN)
    setEditingId(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!form.subject.trim() || !form.topic.trim()) {
      setMessage('Preencha pelo menos a disciplina e o assunto da aula.')
      return
    }

    const payload: LessonPlan = {
      ...form,
      id: editingId ?? crypto.randomUUID(),
      createdAt: editingId
        ? (plans.find((p) => p.id === editingId)?.createdAt ?? new Date().toISOString())
        : new Date().toISOString(),
    }

    const next = editingId
      ? plans.map((p) => (p.id === editingId ? payload : p))
      : [payload, ...plans]

    setPlans(next)
    savePlans(next)
    setMessage(editingId ? 'Planejamento atualizado.' : 'Planejamento salvo com sucesso.')
    resetForm()
  }

  function handleEdit(plan: LessonPlan) {
    setForm({
      subject: plan.subject,
      grade: plan.grade,
      date: plan.date,
      duration: plan.duration,
      topic: plan.topic,
      objectives: plan.objectives,
      books: plan.books,
      resources: plan.resources,
      activities: plan.activities,
      assessment: plan.assessment,
      notes: plan.notes,
    })
    setEditingId(plan.id)
    setMessage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(id: string) {
    const next = plans.filter((p) => p.id !== id)
    setPlans(next)
    savePlans(next)
    if (editingId === id) resetForm()
    setMessage('Planejamento removido.')
  }

  return (
    <div className="login-card lesson-plan-card">
      <h1>Planejamento de Aula</h1>
      <p className="login-sub">
        Organize disciplina, assunto, livros, materiais e atividades para suas aulas.
      </p>

      {message ? (
        <p className="form-success" role="status">
          {message}
        </p>
      ) : null}

      <form className="lesson-plan-form" onSubmit={handleSubmit} noValidate>
        <section className="lesson-plan-section">
          <h2>Informações gerais</h2>
          <div className="planner-controls lesson-plan-grid">
            <div className="form-field">
              <label htmlFor="lp-subject">Disciplina *</label>
              <input
                id="lp-subject"
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="Ex.: Matemática"
              />
            </div>

            <div className="form-field">
              <label htmlFor="lp-grade">Turma / série</label>
              <input
                id="lp-grade"
                value={form.grade}
                onChange={(e) => updateField('grade', e.target.value)}
                placeholder="Ex.: 8º ano A"
              />
            </div>

            <div className="form-field">
              <label htmlFor="lp-date">Data da aula</label>
              <input
                id="lp-date"
                type="date"
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="lp-duration">Duração (min)</label>
              <input
                id="lp-duration"
                type="number"
                min={15}
                max={300}
                value={form.duration}
                onChange={(e) => updateField('duration', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="lesson-plan-section">
          <h2>Conteúdo</h2>
          <div className="form-field">
            <label htmlFor="lp-topic">Assunto da aula *</label>
            <input
              id="lp-topic"
              value={form.topic}
              onChange={(e) => updateField('topic', e.target.value)}
              placeholder="Ex.: Equações do 1º grau"
            />
          </div>

          <div className="form-field">
            <label htmlFor="lp-objectives">Objetivos de aprendizagem</label>
            <textarea
              id="lp-objectives"
              className="textarea-field"
              rows={3}
              value={form.objectives}
              onChange={(e) => updateField('objectives', e.target.value)}
              placeholder="O que o aluno deve aprender ao final da aula?"
            />
          </div>
        </section>

        <section className="lesson-plan-section">
          <h2>Materiais e recursos</h2>
          <div className="form-field">
            <label htmlFor="lp-books">Livros didáticos</label>
            <textarea
              id="lp-books"
              className="textarea-field"
              rows={2}
              value={form.books}
              onChange={(e) => updateField('books', e.target.value)}
              placeholder="Ex.: Matemática — Volume 2, cap. 4, págs. 78–85"
            />
          </div>

          <div className="form-field">
            <label htmlFor="lp-resources">Materiais e recursos complementares</label>
            <textarea
              id="lp-resources"
              className="textarea-field"
              rows={2}
              value={form.resources}
              onChange={(e) => updateField('resources', e.target.value)}
              placeholder="Slides, vídeos, fichas impressas, laboratório, etc."
            />
          </div>
        </section>

        <section className="lesson-plan-section">
          <h2>Metodologia e avaliação</h2>
          <div className="form-field">
            <label htmlFor="lp-activities">Atividades e metodologia</label>
            <textarea
              id="lp-activities"
              className="textarea-field"
              rows={4}
              value={form.activities}
              onChange={(e) => updateField('activities', e.target.value)}
              placeholder="Introdução, exposição, exercícios em grupo, discussão..."
            />
          </div>

          <div className="form-field">
            <label htmlFor="lp-assessment">Avaliação</label>
            <textarea
              id="lp-assessment"
              className="textarea-field"
              rows={2}
              value={form.assessment}
              onChange={(e) => updateField('assessment', e.target.value)}
              placeholder="Participação, lista, trabalho, prova..."
            />
          </div>

          <div className="form-field">
            <label htmlFor="lp-notes">Observações</label>
            <textarea
              id="lp-notes"
              className="textarea-field"
              rows={2}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Adaptações, alunos com necessidades específicas, lembretes..."
            />
          </div>
        </section>

        <div className="lesson-plan-actions">
          <button type="submit" className="btn-primary">
            {editingId ? 'Atualizar planejamento' : 'Salvar planejamento'}
          </button>
          {editingId ? (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancelar edição
            </button>
          ) : null}
        </div>
      </form>

      <section className="welcome-section lesson-plan-list">
        <h2>Planejamentos salvos ({plans.length})</h2>
        {plans.length === 0 ? (
          <p className="lesson-plan-empty">Nenhum planejamento salvo ainda.</p>
        ) : (
          <ul className="lesson-plan-items">
            {plans.map((plan) => (
              <li className="lesson-plan-item" key={plan.id}>
                <div className="lesson-plan-item-head">
                  <strong>{plan.topic}</strong>
                  <span>
                    {plan.subject}
                    {plan.grade ? ` · ${plan.grade}` : ''}
                  </span>
                </div>
                <p className="lesson-plan-item-meta">
                  {plan.date ? `Data: ${plan.date}` : 'Data não definida'}
                  {plan.duration ? ` · ${plan.duration} min` : ''}
                </p>
                {plan.books ? <p className="lesson-plan-item-books">Livros: {plan.books}</p> : null}
                <div className="lesson-plan-item-actions">
                  <button type="button" className="btn-link" onClick={() => handleEdit(plan)}>
                    Editar
                  </button>
                  <button type="button" className="btn-link btn-link--danger" onClick={() => handleDelete(plan.id)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="login-footer">
        <Link to="/boas-vindas">Voltar ao painel</Link>
      </p>
    </div>
  )
}
