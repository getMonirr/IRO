import { z } from 'zod'
import { strongPassword } from '../User/user.validation'

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).max(200),
  }),
})

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: strongPassword,
  }),
})

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
}
