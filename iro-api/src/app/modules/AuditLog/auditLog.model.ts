import { Schema, model } from 'mongoose'
import { TAuditLog } from './auditLog.interface'

const auditLogSchema = new Schema<TAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    actorRole: { type: String },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String },
    ip: { type: String },
    meta: { type: Schema.Types.Mixed },
    // automatically deleted after one year
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expireAfterSeconds: 60 * 60 * 24 * 365 },
    },
  },
  { versionKey: false },
)

export const AuditLog = model<TAuditLog>('AuditLog', auditLogSchema)
