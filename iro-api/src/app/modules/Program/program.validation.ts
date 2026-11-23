import { z } from 'zod'
import { biReqZod, biZod } from '../../shared/bilingual'
import { PROGRAM_STATUS } from './program.constant'

const programBody = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]{2,50}$/, 'lowercase letters, digits and hyphens only'),
  icon: z.string().max(10).default(''),
  order: z.number().int().default(0),
  status: z.enum(PROGRAM_STATUS).default('ongoing'),
  published: z.boolean().default(true),
  title: biReqZod(200),
  short: biReqZod(500),
  body: biZod(),
  tagline: biZod(300),
  points: z.array(biZod(500)).max(20).default([]),
  figures: z
    .array(z.object({ value: biZod(30), label: biZod(100) }))
    .max(8)
    .default([]),
  ayah: z
    .object({
      arabic: z.string().max(2000).default(''),
      text: biZod(1000),
      source: biZod(200),
    })
    .default({}),
})

const createProgramValidationSchema = z.object({ body: programBody })
const updateProgramValidationSchema = z.object({ body: programBody.partial() })

export const ProgramValidation = {
  createProgramValidationSchema,
  updateProgramValidationSchema,
}
