/** Vazio = usa proxy do Vite (/api → backend). Em produção, defina VITE_API_URL. */
const API_BASE = import.meta.env.VITE_API_URL ?? ''
const TOKEN_KEY = 'profemanager:token'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  let data: unknown = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { detail: text }
    }
  }

  if (!response.ok) {
    let detail = `Erro ${response.status}`
    if (typeof data === 'object' && data !== null && 'detail' in data) {
      const raw = (data as { detail: unknown }).detail
      if (typeof raw === 'string') {
        detail = raw
      } else if (Array.isArray(raw)) {
        detail = raw
          .map((item) =>
            typeof item === 'object' && item !== null && 'msg' in item
              ? String((item as { msg: string }).msg)
              : String(item),
          )
          .join(', ')
      }
    }
    throw new ApiError(detail, response.status)
  }

  return data as T
}

// --- Auth ---

export type ApiUser = {
  id: number
  name: string
  email: string
  is_active: boolean
  created_at: string
}

export type TokenResponse = {
  access_token: string
  token_type: string
  user: ApiUser
}

export function login(email: string, password: string) {
  return apiRequest<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
}

export function signup(name: string, email: string, password: string) {
  return apiRequest<TokenResponse>('/api/auth/signup', {
    method: 'POST',
    body: { name, email, password },
    auth: false,
  })
}

export function fetchMe() {
  return apiRequest<ApiUser>('/api/auth/me')
}

export function forgotPassword(email: string) {
  return apiRequest<{ message: string; reset_link?: string | null }>('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
    auth: false,
  })
}

export function resetPassword(token: string, password: string) {
  return apiRequest<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: { token, password },
    auth: false,
  })
}

// --- Classrooms ---

export type ApiSeat = {
  seat: number
  name: string
  tag: string
}

export type ApiClassroom = {
  id: number
  subject: string
  student_count: number
  rows: number
  mode: string
  seats: ApiSeat[]
  created_at: string
  updated_at: string
}

export function listClassrooms() {
  return apiRequest<ApiClassroom[]>('/api/classrooms')
}

export function createClassroom(payload: {
  subject: string
  student_count: number
  rows: number
  mode: 'separado' | 'juntos' | 'aleatorio'
  seats: ApiSeat[]
}) {
  return apiRequest<ApiClassroom>('/api/classrooms', { method: 'POST', body: payload })
}

export function updateClassroom(
  id: number,
  payload: Partial<{
    subject: string
    student_count: number
    rows: number
    mode: 'separado' | 'juntos' | 'aleatorio'
    seats: ApiSeat[]
  }>,
) {
  return apiRequest<ApiClassroom>(`/api/classrooms/${id}`, { method: 'PATCH', body: payload })
}

export function deleteClassroom(id: number) {
  return apiRequest<void>(`/api/classrooms/${id}`, { method: 'DELETE' })
}

// --- Lesson plans ---

export type ApiLessonPlan = {
  id: number
  subject: string
  grade_class: string
  topic: string
  duration_minutes: number | null
  objectives: string
  materials: string
  books: string
  activities: string
  evaluation: string
  notes: string
  scheduled_for: string | null
  created_at: string
  updated_at: string
}

export function listLessonPlans() {
  return apiRequest<ApiLessonPlan[]>('/api/lesson-plans')
}

export function createLessonPlan(payload: {
  subject: string
  grade_class?: string
  topic: string
  duration_minutes?: number | null
  objectives?: string
  materials?: string
  books?: string
  activities?: string
  evaluation?: string
  notes?: string
  scheduled_for?: string | null
}) {
  return apiRequest<ApiLessonPlan>('/api/lesson-plans', { method: 'POST', body: payload })
}

export function updateLessonPlan(
  id: number,
  payload: Partial<{
    subject: string
    grade_class: string
    topic: string
    duration_minutes: number | null
    objectives: string
    materials: string
    books: string
    activities: string
    evaluation: string
    notes: string
    scheduled_for: string | null
  }>,
) {
  return apiRequest<ApiLessonPlan>(`/api/lesson-plans/${id}`, { method: 'PATCH', body: payload })
}

export function deleteLessonPlan(id: number) {
  return apiRequest<void>(`/api/lesson-plans/${id}`, { method: 'DELETE' })
}

// --- Grades ---

export type ApiGrade = {
  id: number
  student_name: string
  subject: string
  grade_class: string
  score_1: number | null
  score_2: number | null
  score_3: number | null
  score_4: number | null
  participation: number | null
  note: string
  average: number | null
  status: 'aprovado' | 'recuperacao' | 'reprovado' | 'sem-nota'
  created_at: string
  updated_at: string
}

export type ApiGradeStats = {
  total: number
  approved: number
  recuperation: number
  failed: number
  no_grade: number
  average: number
}

export function listGrades(subject?: string) {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return apiRequest<ApiGrade[]>(`/api/grades${query}`)
}

export function fetchGradeStats(subject?: string) {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return apiRequest<ApiGradeStats>(`/api/grades/stats${query}`)
}

export function createGrade(payload: {
  student_name: string
  subject: string
  grade_class?: string
  score_1?: number | null
  score_2?: number | null
  score_3?: number | null
  score_4?: number | null
  participation?: number | null
  note?: string
}) {
  return apiRequest<ApiGrade>('/api/grades', { method: 'POST', body: payload })
}

export function updateGrade(
  id: number,
  payload: Partial<{
    student_name: string
    subject: string
    grade_class: string
    score_1: number | null
    score_2: number | null
    score_3: number | null
    score_4: number | null
    participation: number | null
    note: string
  }>,
) {
  return apiRequest<ApiGrade>(`/api/grades/${id}`, { method: 'PATCH', body: payload })
}

export function deleteGrade(id: number) {
  return apiRequest<void>(`/api/grades/${id}`, { method: 'DELETE' })
}
