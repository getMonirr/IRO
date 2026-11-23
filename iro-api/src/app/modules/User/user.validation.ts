import { z } from 'zod'
import { USER_ROLE, UserStatus } from './user.constant'

export const strongPassword = z
  .string({ invalid_type_error: 'Password must be string' })
  .min(10, { message: 'Password must be at least 10 characters' })
  .max(72, { message: 'Password can not be more than 72 characters' })
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/\d/, 'Password must contain a digit')

const roles = Object.keys(USER_ROLE) as [string, ...string[]]

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    password: strongPassword,
    role: z.enum(roles).default('member'),
  }),
})

const updateUserValidationSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100),
      role: z.enum(roles),
      status: z.enum([...UserStatus] as [string, ...string[]]),
      password: strongPassword,
    })
    .partial(),
})

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
})

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  changeStatusValidationSchema,
}
