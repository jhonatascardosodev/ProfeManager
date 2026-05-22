export type StudentGrade = {
  id: string
  studentName: string
  subject: string
  gradeClass: string
  exam1: number | null
  exam2: number | null
  exam3: number | null
  assignment: number | null
  participation: number | null
  notes: string
  createdAt: string
}

export const EMPTY_STUDENT_GRADE: Omit<StudentGrade, 'id' | 'createdAt'> = {
  studentName: '',
  subject: '',
  gradeClass: '',
  exam1: null,
  exam2: null,
  exam3: null,
  assignment: null,
  participation: null,
  notes: '',
}

export function calculateAverage(entry: StudentGrade): number | null {
  const values = [entry.exam1, entry.exam2, entry.exam3, entry.assignment, entry.participation].filter(
    (v): v is number => v !== null && !Number.isNaN(v),
  )
  if (values.length === 0) return null
  const sum = values.reduce((acc, v) => acc + v, 0)
  return Math.round((sum / values.length) * 10) / 10
}

export function performanceStatus(average: number | null): 'aprovado' | 'recuperacao' | 'reprovado' | 'sem-nota' {
  if (average === null) return 'sem-nota'
  if (average >= 7) return 'aprovado'
  if (average >= 5) return 'recuperacao'
  return 'reprovado'
}

export const STATUS_LABELS: Record<ReturnType<typeof performanceStatus>, string> = {
  aprovado: 'Aprovado',
  recuperacao: 'Recuperação',
  reprovado: 'Reprovado',
  'sem-nota': 'Sem nota',
}
