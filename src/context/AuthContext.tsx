import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ApiError, fetchMe, getToken, setToken } from '../lib/api'
import { clearSession, setUser, type SessionUser } from '../lib/session'
import { AuthContext, type AuthStatus } from './authStore'


export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUserState] = useState<SessionUser | null>(null)

  const logout = useCallback(() => {
    clearSession()
    setUserState(null)
    setStatus('unauthenticated')
  }, [])

  const login = useCallback((token: string, sessionUser: SessionUser, remember = true) => {
    setToken(token, remember)
    setUser(sessionUser, remember)
    setUserState(sessionUser)
    setStatus('authenticated')
  }, [])

  const updateUser = useCallback((sessionUser: SessionUser) => {
    setUser(sessionUser)
    setUserState(sessionUser)
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
    () => ({ status, user, login, updateUser, logout }),
    [status, user, login, updateUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
