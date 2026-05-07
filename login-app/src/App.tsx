import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthShell from './components/AuthShell'
import ClassroomMapPage from './pages/ClassroomMapPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import WelcomePage from './pages/WelcomePage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthShell />}>
          <Route path="/" element={<Navigate to="/entrar" replace />} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/criar-conta" element={<SignUpPage />} />
          <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
          <Route path="/boas-vindas" element={<WelcomePage />} />
          <Route path="/mapa-sala" element={<ClassroomMapPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/entrar" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
