import { Schema, model } from 'mongoose'
import { bi, biSchema } from '../../shared/bilingual'
import { PROGRAM_STATUS } from './program.constant'
import { TProgram } from './program.interface'

const programSchema = new Schema<TProgram>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]{2,50}$/,
    },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    status: { type: String, enum: PROGRAM_STATUS, default: 'ongoing' },
    published: { type: Boolean, default: true, index: true },
    title: bi(),
    short: bi(),
    body: bi(),
    tagline: bi(),
    points: { type: [biSchema], default: [] },
    figures: {
      type: [new Schema({ value: bi(), label: bi() }, { _id: false })],
      default: [],
    },
    ayah: { arabic: { type: String, default: '' }, text: bi(), source: bi() },
  },
  { timestamps: true },
)

export const Program = model<TProgram>('Program', programSchema)
