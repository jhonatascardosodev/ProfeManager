import { createContext, useContext } from 'react'
import type { SessionUser } from '../lib/session'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  status: AuthStatus
  user: SessionUser | null
  login: (token: string, user: SessionUser, remember?: boolean) => void
  updateUser: (user: SessionUser) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
