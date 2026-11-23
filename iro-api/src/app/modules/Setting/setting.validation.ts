import { z } from 'zod'
import { SETTING_KEYS } from './setting.constant'

const objectOrArray = z
  .any()
  .refine(
    v => v !== null && typeof v === 'object',
    'must be an object or array',
  )

const updateSettingValidationSchema = z.object({
  params: z.object({ key: z.enum(SETTING_KEYS) }),
  body: z.object({ bn: objectOrArray, en: objectOrArray }),
})

export const SettingValidation = { updateSettingValidationSchema }
