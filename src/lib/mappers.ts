import type { ApiGrade, ApiLessonPlan } from './api'
import type { StudentGrade } from '../types/grade'
import type { LessonPlan } from '../types/lessonPlan'

const TURMA_PREFIX = 'Turma: '
const PARTICIPACAO_PREFIX = 'Participação: '

export function lessonPlanToApi(form: Omit<LessonPlan, 'id' | 'createdAt'>) {
  const duration = Number(form.duration)
  return {
    subject: form.subject.trim(),
    grade_class: form.grade.trim(),
    topic: form.topic.trim(),
    duration_minutes: Number.isFinite(duration) && duration >= 15 ? duration : null,
    objectives: form.objectives.trim(),
    materials: form.resources.trim(),
    books: form.books.trim(),
    activities: form.activities.trim(),
    evaluation: form.assessment.trim(),
    notes: form.notes.trim(),
    scheduled_for: form.date ? `${form.date}T12:00:00` : null,
  }
}

export function lessonPlanFromApi(plan: ApiLessonPlan): LessonPlan {
  return {
    id: String(plan.id),
    subject: plan.subject,
    grade: plan.grade_class ?? '',
    date: plan.scheduled_for?.slice(0, 10) ?? '',
    duration: plan.duration_minutes ? String(plan.duration_minutes) : '50',
    topic: plan.topic,
    objectives: plan.objectives,
    books: plan.books,
    resources: plan.materials,
    activities: plan.activities,
    assessment: plan.evaluation,
    notes: plan.notes ?? '',
    createdAt: plan.created_at,
  }
}

export function gradeToApi(form: Omit<StudentGrade, 'id' | 'createdAt'>) {
  return {
    student_name: form.studentName.trim(),
    subject: form.subject.trim(),
    grade_class: form.gradeClass.trim(),
    score_1: form.exam1,
    score_2: form.exam2,
    score_3: form.exam3,
    score_4: form.assignment,
    participation: form.participation,
    note: form.notes.trim(),
  }
}

/** Fallback para registros antigos que guardavam turma/participação no campo note. */
function legacyFromNote(note: string): { gradeClass: string; participation: number | null; notes: string } {
  let gradeClass = ''
  let participation: number | null = null
  const noteLines: string[] = []

  for (const line of note.split('\n')) {
    if (line.startsWith(TURMA_PREFIX)) {
      gradeClass = line.slice(TURMA_PREFIX.length).trim()
    } else if (line.startsWith(PARTICIPACAO_PREFIX)) {
      const val = Number(line.slice(PARTICIPACAO_PREFIX.length).replace(',', '.'))
      participation = Number.isNaN(val) ? null : val
    } else if (line.trim()) {
      noteLines.push(line)
    }
  }

  return { gradeClass, participation, notes: noteLines.join('\n') }
}

export function gradeFromApi(grade: ApiGrade): StudentGrade {
  if (grade.grade_class?.trim()) {
    return {
      id: String(grade.id),
      studentName: grade.student_name,
      subject: grade.subject,
      gradeClass: grade.grade_class.trim(),
      exam1: grade.score_1,
      exam2: grade.score_2,
      exam3: grade.score_3,
      assignment: grade.score_4,
      participation: grade.participation,
      notes: grade.note,
      createdAt: grade.created_at,
    }
  }

  const legacy = legacyFromNote(grade.note)
  return {
    id: String(grade.id),
    studentName: grade.student_name,
    subject: grade.subject,
    gradeClass: legacy.gradeClass,
    exam1: grade.score_1,
    exam2: grade.score_2,
    exam3: grade.score_3,
    assignment: grade.score_4,
    participation: grade.participation ?? legacy.participation,
    notes: legacy.notes,
    createdAt: grade.created_at,
  }
}
