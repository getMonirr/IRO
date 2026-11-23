import { z } from 'zod'
import { LANGS } from '../../shared/constant'

const getContentValidationSchema = z.object({
  query: z.object({ lang: z.enum(LANGS).default('bn') }),
})

export const PublicValidation = { getContentValidationSchema }
