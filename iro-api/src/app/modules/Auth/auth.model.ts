import { Schema, model } from 'mongoose'
import { TRefreshToken } from './auth.interface'

const refreshTokenSchema = new Schema<TRefreshToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jti: { type: String, required: true, unique: true },
    // MongoDB deletes the record itself once expired
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    revokedAt: { type: Date },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true },
)

export const RefreshToken = model<TRefreshToken>(
  'RefreshToken',
  refreshTokenSchema,
)
