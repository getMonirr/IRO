import { Schema } from 'mongoose'
import { z } from 'zod'

export type TLang = 'bn' | 'en'
export type TBi = { bn: string; en: string }

// ---- mongoose
export const biSchema = new Schema<TBi>(
  {
    bn: { type: String, default: '', trim: true },
    en: { type: String, default: '', trim: true },
  },
  { _id: false },
)
export const bi = () => ({ type: biSchema, default: () => ({}) })

/** value in the chosen language, falling back to the other language when empty */
export const pickLang = (b: Partial<TBi> | null | undefined, lang: TLang) =>
  b?.[lang] || b?.bn || b?.en || ''

// ---- zod
const text = (max: number) => z.string().trim().max(max)
export const biZod = (max = 5000) =>
  z.object({ bn: text(max).default(''), en: text(max).default('') }).default({
    bn: '',
    en: '',
  })
/** Bangla required, English optional (Bangla is shown when English is empty) */
export const biReqZod = (max = 500) =>
  z.object({
    bn: text(max).min(1, 'Bangla text is required'),
    en: text(max).default(''),
  })
