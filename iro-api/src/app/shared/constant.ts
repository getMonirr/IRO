export const USER_ROLE = {
  superAdmin: 'superAdmin',
  admin: 'admin',
  editor: 'editor',
  member: 'member',
} as const

export const UserStatus = ['in-progress', 'blocked']

/** higher number = more power. Nobody can manage a user of equal or higher rank. */
export const ROLE_RANK = {
  superAdmin: 4,
  admin: 3,
  editor: 2,
  member: 1,
} as const

const { superAdmin, admin, editor, member } = USER_ROLE

/** Who can do what. Use with authGuard(...ACCESS.X) */
export const ACCESS = {
  ANY: [superAdmin, admin, editor, member],
  CONTENT_READ: [superAdmin, admin, editor],
  CONTENT_WRITE: [superAdmin, admin, editor],
  CONTENT_DELETE: [superAdmin, admin],
  SETTINGS_WRITE: [superAdmin, admin],
  JOIN_READ: [superAdmin, admin, editor],
  JOIN_WRITE: [superAdmin, admin, editor],
  JOIN_DELETE: [superAdmin, admin],
  USER_MANAGE: [superAdmin, admin],
  AUDIT_READ: [superAdmin, admin],
} as const

export const LANGS = ['bn', 'en'] as const
