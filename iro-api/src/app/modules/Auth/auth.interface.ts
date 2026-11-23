import { Types } from 'mongoose'

export type TLoginUser = { email: string; password: string }
export type TClientMeta = { ip?: string; userAgent?: string }

export interface TRefreshToken {
  user: Types.ObjectId
  jti: string
  expiresAt: Date
  revokedAt?: Date
  ip?: string
  userAgent?: string
}
