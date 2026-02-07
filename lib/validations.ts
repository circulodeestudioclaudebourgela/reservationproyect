import { z } from 'zod'

export const registrationSchema = z.object({
  full_name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  dni: z.string()
    .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos'),
  email: z.string()
    .email('Correo electrónico inválido'),
  phone: z.string()
    .regex(/^\d{9}$/, 'El teléfono debe tener exactamente 9 dígitos'),
  role: z.enum(['student', 'professional'], {
    errorMap: () => ({ message: 'Seleccione un rol válido' })
  }),
  organization: z.string().max(150).optional(),
})

export type RegistrationForm = z.infer<typeof registrationSchema>

export const loginSchema = z.object({
  email: z.string()
    .email('Correo electrónico inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginForm = z.infer<typeof loginSchema>
