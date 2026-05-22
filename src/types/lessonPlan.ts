export type LessonPlan = {
  id: string
  subject: string
  grade: string
  date: string
  duration: string
  topic: string
  objectives: string
  books: string
  resources: string
  activities: string
  assessment: string
  notes: string
  createdAt: string
}

export const EMPTY_LESSON_PLAN: Omit<LessonPlan, 'id' | 'createdAt'> = {
  subject: '',
  grade: '',
  date: '',
  duration: '50',
  topic: '',
  objectives: '',
  books: '',
  resources: '',
  activities: '',
  assessment: '',
  notes: '',
}
