export type SessionUser = {
  name: string
  email: string
}

const USER_KEY = 'profemanager:user'

export function setUser(user: SessionUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionUser
    if (!parsed?.name) return null
    return parsed
  } catch {
    return null
  }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY)
}

export function clearSession() {
  clearUser()
  localStorage.removeItem('profemanager:token')
}

export function nameFromEmail(email: string): string {
  const local = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim() ?? ''
  if (!local) return 'Professor'

  return local
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}
