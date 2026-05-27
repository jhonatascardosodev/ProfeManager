import type { ApiGrade, ApiLessonPlan } from './api'
import type { StudentGrade } from '../types/grade'
import type { LessonPlan } from '../types/lessonPlan'

const TURMA_PREFIX = 'Turma: '
const DURACAO_PREFIX = 'Duração: '

export function lessonPlanToApi(form: Omit<LessonPlan, 'id' | 'createdAt'>) {
  const objectiveLines: string[] = []
  if (form.grade.trim()) objectiveLines.push(`${TURMA_PREFIX}${form.grade.trim()}`)
  if (form.duration.trim()) objectiveLines.push(`${DURACAO_PREFIX}${form.duration.trim()} min`)
  if (form.objectives.trim()) objectiveLines.push(form.objectives.trim())
  if (form.notes.trim()) objectiveLines.push(`Observações: ${form.notes.trim()}`)

  return {
    subject: form.subject.trim(),
    topic: form.topic.trim(),
    objectives: objectiveLines.join('\n'),
    materials: form.resources.trim(),
    books: form.books.trim(),
    activities: form.activities.trim(),
    evaluation: form.assessment.trim(),
    scheduled_for: form.date ? `${form.date}T12:00:00` : null,
  }
}

export function lessonPlanFromApi(plan: ApiLessonPlan): LessonPlan {
  let grade = ''
  let duration = '50'
  let notes = ''
  const objectiveParts: string[] = []

  for (const line of plan.objectives.split('\n')) {
    if (line.startsWith(TURMA_PREFIX)) {
      grade = line.slice(TURMA_PREFIX.length).trim()
    } else if (line.startsWith(DURACAO_PREFIX)) {
      duration = line.slice(DURACAO_PREFIX.length).replace(/\s*min$/, '').trim() || '50'
    } else if (line.startsWith('Observações: ')) {
      notes = line.slice('Observações: '.length)
    } else if (line.trim()) {
      objectiveParts.push(line)
    }
  }

  return {
    id: String(plan.id),
    subject: plan.subject,
    grade,
    date: plan.scheduled_for?.slice(0, 10) ?? '',
    duration,
    topic: plan.topic,
    objectives: objectiveParts.join('\n'),
    books: plan.books,
    resources: plan.materials,
    activities: plan.activities,
    assessment: plan.evaluation,
    notes,
    createdAt: plan.created_at,
  }
}

export function gradeToApi(form: Omit<StudentGrade, 'id' | 'createdAt'>) {
  const noteParts: string[] = []
  if (form.gradeClass.trim()) noteParts.push(`${TURMA_PREFIX}${form.gradeClass.trim()}`)
  if (form.notes.trim()) noteParts.push(form.notes.trim())
  if (form.participation !== null) {
    noteParts.push(`Participação: ${form.participation}`)
  }

  return {
    student_name: form.studentName.trim(),
    subject: form.subject.trim(),
    score_1: form.exam1,
    score_2: form.exam2,
    score_3: form.exam3,
    score_4: form.assignment,
    note: noteParts.join('\n'),
  }
}

export function gradeFromApi(grade: ApiGrade): StudentGrade {
  let gradeClass = ''
  const noteLines: string[] = []
  let participation: number | null = null

  for (const line of grade.note.split('\n')) {
    if (line.startsWith(TURMA_PREFIX)) {
      gradeClass = line.slice(TURMA_PREFIX.length).trim()
    } else if (line.startsWith('Participação: ')) {
      const val = Number(line.slice('Participação: '.length).replace(',', '.'))
      participation = Number.isNaN(val) ? null : val
    } else if (line.trim()) {
      noteLines.push(line)
    }
  }

  return {
    id: String(grade.id),
    studentName: grade.student_name,
    subject: grade.subject,
    gradeClass,
    exam1: grade.score_1,
    exam2: grade.score_2,
    exam3: grade.score_3,
    assignment: grade.score_4,
    participation,
    notes: noteLines.join('\n'),
    createdAt: grade.created_at,
  }
}
