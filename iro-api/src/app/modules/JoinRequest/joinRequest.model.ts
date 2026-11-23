import { Schema, model } from 'mongoose'
import { JOIN_STATUS, JOIN_TYPES } from './joinRequest.constant'
import { TJoinRequest } from './joinRequest.interface'

const joinRequestSchema = new Schema<TJoinRequest>(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    type: { type: String, enum: JOIN_TYPES, required: true },
    message: { type: String, default: '', trim: true },
    lang: { type: String, enum: ['bn', 'en'], default: 'bn' },
    status: { type: String, enum: JOIN_STATUS, default: 'new', index: true },
    note: { type: String, default: '' },
    ip: { type: String },
  },
  { timestamps: true },
)

export const JoinRequest = model<TJoinRequest>('JoinRequest', joinRequestSchema)
