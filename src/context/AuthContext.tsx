import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ApiError, fetchMe, getToken, setToken } from '../lib/api'
import { clearSession, setUser, type SessionUser } from '../lib/session'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
  status: AuthStatus
  user: SessionUser | null
  login: (token: string, user: SessionUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUserState] = useState<SessionUser | null>(null)

  const logout = useCallback(() => {
    clearSession()
    setUserState(null)
    setStatus('unauthenticated')
  }, [])

  const login = useCallback((token: string, sessionUser: SessionUser) => {
    setToken(token)
    setUser(sessionUser)
    setUserState(sessionUser)
    setStatus('authenticated')
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const token = getToken()
      if (!token) {
        if (!cancelled) {
          setUserState(null)
          setStatus('unauthenticated')
        }
        return
      }

      try {
        const apiUser = await fetchMe()
        if (cancelled) return
        const sessionUser = { name: apiUser.name, email: apiUser.email }
        setUser(sessionUser)
        setUserState(sessionUser)
        setStatus('authenticated')
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearSession()
        }
        setUserState(null)
        setStatus('unauthenticated')
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({ status, user, login, logout }),
    [status, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
