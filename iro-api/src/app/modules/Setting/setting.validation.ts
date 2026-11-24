import { z } from 'zod'
import { SETTING_KEYS, THEME_TOKEN_KEYS } from './setting.constant'

const objectOrArray = z
  .any()
  .refine(
    v => v !== null && typeof v === 'object',
    'must be an object or array',
  )

const themeSchema = z.object(
  Object.fromEntries(
    THEME_TOKEN_KEYS.map(key => [key, z.string().regex(/^#[\da-fA-F]{6}$/)]),
  ) as Record<(typeof THEME_TOKEN_KEYS)[number], z.ZodString>,
)

const updateSettingValidationSchema = z
  .object({
    params: z.object({ key: z.enum(SETTING_KEYS) }),
    body: z.union([
      z.object({ bn: objectOrArray, en: objectOrArray }),
      z.object({ value: themeSchema }),
    ]),
  })
  .superRefine(({ params, body }, ctx) => {
    const isThemeUpdate = 'value' in body
    if ((params.key === 'theme') !== isThemeUpdate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid setting value',
      })
    }
  })

export const SettingValidation = { updateSettingValidationSchema }
