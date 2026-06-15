const API_MESSAGE_PT: Record<string, string> = {
  'E-mail ou senha inválidos.': 'E-mail ou senha inválidos.',
  'Credenciais inválidas': 'Sessão expirada. Entre novamente.',
  'E-mail já cadastrado.': 'E-mail já cadastrado.',
}

export function translateApiMessage(message: string, status?: number): string {
  if (API_MESSAGE_PT[message]) {
    return API_MESSAGE_PT[message]
  }

  if (status === 401) {
    return 'E-mail ou senha inválidos.'
  }

  if (status === 422 || message.includes('valid email')) {
    return 'Informe um e-mail válido.'
  }

  if (message.includes('string_too_short') || message.includes('at least 6')) {
    return 'A senha deve ter pelo menos 6 caracteres.'
  }

  if (message.startsWith('Erro ') || message.startsWith('Failed to fetch')) {
    return 'Não foi possível conectar ao servidor. Tente novamente.'
  }

  return message
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
