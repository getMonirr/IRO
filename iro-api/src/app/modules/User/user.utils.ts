import { ROLE_RANK } from '../../shared/constant'
import { TUserRole } from './user.interface'
import { User } from './user.model'

/** A user may only manage users whose role ranks strictly below their own. */
export const canManage = (actorRole: TUserRole, targetRole: TUserRole) =>
  ROLE_RANK[actorRole] > ROLE_RANK[targetRole]

/** Sequential id: 0001, 0002 ... (the unique index guards against a rare race) */
export const generateUserId = async () => {
  const last = await User.findOne({}, { id: 1 }).sort({ createdAt: -1 }).lean()
  const next = last ? Number(last.id) + 1 : 1
  return String(Number.isFinite(next) ? next : 1).padStart(4, '0')
}
