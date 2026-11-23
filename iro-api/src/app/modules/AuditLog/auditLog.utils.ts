import { Request } from 'express'
import { Types } from 'mongoose'
import logger from '../../utils/logger'
import { AuditLog } from './auditLog.model'

type TAuditInput = {
  action: string
  resource: string
  resourceId?: string
  meta?: Record<string, unknown>
  /** for requests without req.user, e.g. login */
  actor?: { id: Types.ObjectId; role: string }
}

/** Admin action trail: stored in the database and written to the log. Never breaks the request. */
export const recordAudit = async (req: Request, input: TAuditInput) => {
  const log = req.log ?? logger
  log.info(
    {
      audit: {
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId,
      },
    },
    'audit',
  )
  try {
    await AuditLog.create({
      actor: input.actor?.id ?? req.user?._id,
      actorRole: input.actor?.role ?? req.user?.role,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId,
      ip: req.ip,
      meta: input.meta,
    })
  } catch (err) {
    log.error({ err }, 'audit log write failed')
  }
}
