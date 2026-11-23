import { z } from 'zod'
import { JOIN_STATUS, JOIN_TYPES } from './joinRequest.constant'

const createJoinRequestValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    contact: z.string().trim().min(3).max(150),
    type: z.enum(JOIN_TYPES),
    message: z.string().trim().max(2000).default(''),
    lang: z.enum(['bn', 'en']).default('bn'),
  }),
})

const updateJoinRequestValidationSchema = z.object({
  body: z.object({
    status: z.enum(JOIN_STATUS).optional(),
    note: z.string().max(2000).optional(),
  }),
})

export const JoinRequestValidation = {
  createJoinRequestValidationSchema,
  updateJoinRequestValidationSchema,
}
