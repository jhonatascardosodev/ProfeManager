import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthShell from './components/AuthShell'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
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
        </Route>
        <Route path="*" element={<Navigate to="/entrar" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
