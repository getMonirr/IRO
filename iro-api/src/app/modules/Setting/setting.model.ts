import { Schema, model } from 'mongoose'
import { SETTING_KEYS } from './setting.constant'
import { TSetting } from './setting.interface'

const settingSchema = new Schema<TSetting>(
  {
    key: { type: String, enum: SETTING_KEYS, required: true, unique: true },
    value: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
)

export const Setting = model<TSetting>('Setting', settingSchema)
