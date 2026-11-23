import { JwtPayload } from 'jsonwebtoken'
import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { revokeAllTokens } from '../Auth/auth.utils'
import { UserFilterableFields, UserSearchableFields } from './user.constant'
import { TUser, TUserRole } from './user.interface'
import { User } from './user.model'
import { canManage, generateUserId } from './user.utils'

const createUserIntoDB = async (payload: Partial<TUser>, actor: JwtPayload) => {
  if (!canManage(actor.role, payload.role as TUserRole)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only create users with a lower role than your own',
    )
  }
  const id = await generateUserId()
  return User.create({ ...payload, id, needsPasswordChange: true })
}

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(User.find({ isDeleted: false }), query)
    .search(UserSearchableFields)
    .filter(UserFilterableFields)
    .sort('-createdAt')
    .paginate()
  const data = await qb.modelQuery
  const meta = await qb.countTotal()
  return { data, meta }
}

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findOne({ _id: id, isDeleted: false })
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  return user
}

const updateUserIntoDB = async (
  id: string,
  payload: Partial<TUser>,
  actor: JwtPayload,
) => {
  const target = await getSingleUserFromDB(id)
  const self = target.id === actor.userId

  if (!self && !canManage(actor.role, target.role)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You cannot manage a user with an equal or higher role',
    )
  }
  if (self && (payload.role !== undefined || payload.status !== undefined)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You cannot change your own role or status',
    )
  }
  if (payload.role && !canManage(actor.role, payload.role)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only assign roles lower than your own',
    )
  }

  const { password, ...rest } = payload
  Object.assign(target, rest)
  if (password) {
    target.password = password // hashed by the pre-save hook
    target.passwordChangedAt = new Date()
    target.needsPasswordChange = true
  }
  await target.save()

  // role change, block or password reset ends all existing sessions
  if (password || payload.role || payload.status === 'blocked') {
    await revokeAllTokens(target._id)
  }
  return target
}

const deleteUserFromDB = async (id: string, actor: JwtPayload) => {
  const target = await getSingleUserFromDB(id)
  if (target.id === actor.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You cannot delete yourself')
  }
  if (!canManage(actor.role, target.role)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You cannot delete a user with an equal or higher role',
    )
  }
  target.isDeleted = true // soft delete
  await target.save()
  await revokeAllTokens(target._id)
  return target
}

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
}
