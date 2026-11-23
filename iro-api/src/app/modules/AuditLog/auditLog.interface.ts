import { Types } from 'mongoose'

export interface TAuditLog {
  actor?: Types.ObjectId
  actorRole?: string
  action: string
  resource: string
  resourceId?: string
  ip?: string
  meta?: Record<string, unknown>
  createdAt: Date
}
