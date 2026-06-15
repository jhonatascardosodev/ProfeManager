import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthShell from './components/AuthShell'
import GuestOnlyRoute from './components/GuestOnlyRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import ClassroomMapPage from './pages/ClassroomMapPage'
import GradesPage from './pages/GradesPage'
import LessonPlanPage from './pages/LessonPlanPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import WelcomePage from './pages/WelcomePage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthShell />}>
            <Route path="/" element={<Navigate to="/entrar" replace />} />

            <Route element={<GuestOnlyRoute />}>
              <Route path="/entrar" element={<LoginPage />} />
              <Route path="/criar-conta" element={<SignUpPage />} />
              <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
              <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/boas-vindas" element={<WelcomePage />} />
              <Route path="/mapa-sala" element={<ClassroomMapPage />} />
              <Route path="/planejamento-aula" element={<LessonPlanPage />} />
              <Route path="/notas-desempenho" element={<GradesPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/entrar" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
