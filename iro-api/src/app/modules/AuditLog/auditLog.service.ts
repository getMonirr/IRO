import QueryBuilder from '../../builder/QueryBuilder'
import { AuditFilterableFields } from './auditLog.constant'
import { AuditLog } from './auditLog.model'

const getAllAuditLogsFromDB = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(
    AuditLog.find().populate('actor', 'name email'),
    query,
  )
    .filter(AuditFilterableFields)
    .sort('-createdAt')
    .paginate()
  const data = await qb.modelQuery.lean()
  const meta = await qb.countTotal()
  return { data, meta }
}

export const AuditLogServices = { getAllAuditLogsFromDB }
