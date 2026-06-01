import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function GuestOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="auth-loading" role="status" aria-live="polite">
        Carregando…
      </div>
    )
  }

  if (status === 'authenticated') {
    return <Navigate to="/boas-vindas" replace />
  }

  return <Outlet />
}
