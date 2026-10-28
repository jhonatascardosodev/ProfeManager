import { z } from 'zod'

const email = z
  .string()
  .trim()
  .min(1, 'Informe o e-mail.')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Informe um e-mail válido.')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe a senha.'),
  remember: z.boolean(),
})

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, 'Informe seu nome.').max(120, 'Nome muito longo.'),
    email,
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').max(128),
    confirmPassword: z.string().min(1, 'Repita a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  })

export type LoginValues = z.infer<typeof loginSchema>
export type SignUpValues = z.infer<typeof signUpSchema>

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').max(128),
    confirmPassword: z.string().min(1, 'Repita a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  })

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
