import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import config from '../../config'
import AppError from '../../errors/AppError'
import { verifyToken } from '../../helpers/jwtHelpers'
import { User } from '../User/user.model'
import { LOCK_MINUTES, MAX_FAILED_LOGINS } from './auth.constant'
import { TClientMeta, TLoginUser } from './auth.interface'
import { RefreshToken } from './auth.model'
import { issueTokens, revokeAllTokens } from './auth.utils'

let dummyHash: string | undefined
// compared when the email is unknown so response time doesn't reveal which emails exist
const getDummyHash = async () =>
  (dummyHash ??= await bcrypt.hash(
    'timing-equalizer',
    Number(config.bcrypt_salt_rounds),
  ))

const loginUser = async (payload: TLoginUser, meta: TClientMeta) => {
  const user = await User.findOne({
    email: payload.email.toLowerCase(),
    isDeleted: false,
  }).select('+password')

  if (user?.lockUntil && user.lockUntil > new Date()) {
    throw new AppError(
      httpStatus.LOCKED,
      'Account temporarily locked. Please try again later.',
    )
  }

  const matched = await User.isPasswordMatched(
    payload.password,
    user?.password ?? (await getDummyHash()),
  )

  if (!user || user.status === 'blocked' || !matched) {
    if (user) {
      user.failedLogins += 1
      if (user.failedLogins >= MAX_FAILED_LOGINS) {
        user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
        user.failedLogins = 0
      }
      await user.save()
    }
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password')
  }

  user.failedLogins = 0
  user.lockUntil = undefined
  user.lastLoginAt = new Date()
  await user.save()

  const tokens = await issueTokens(user, meta)
  return { ...tokens, user }
}

/** Rotates the refresh token. Reusing an already-rotated token revokes every session of that user. */
const refreshToken = async (token: string | undefined, meta: TClientMeta) => {
  if (!token) throw new AppError(httpStatus.UNAUTHORIZED, 'No refresh token')

  let decoded: JwtPayload
  try {
    decoded = verifyToken(token, config.jwt_refresh_secret as string)
  } catch {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Invalid or expired refresh token',
    )
  }

  const record = await RefreshToken.findOne({ jti: decoded.jti })
  if (!record) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token')
  }
  if (record.revokedAt) {
    await revokeAllTokens(record.user)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Session revoked, please log in again',
    )
  }

  const user = await User.findById(record.user)
  if (!user || user.isDeleted || user.status === 'blocked') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
  }
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      decoded.iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
  }

  record.revokedAt = new Date()
  await record.save()
  return issueTokens(user, meta)
}

const logoutUser = async (token: string | undefined) => {
  if (!token) return
  try {
    const decoded = verifyToken(token, config.jwt_refresh_secret as string)
    await RefreshToken.updateOne(
      { jti: decoded.jti, revokedAt: { $exists: false } },
      { revokedAt: new Date() },
    )
  } catch {
    // an invalid / expired token is already useless
  }
}

const getMe = async (userId: string) => {
  const user = await User.findOne({ id: userId, isDeleted: false })
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  return user
}

const changePassword = async (
  userId: string,
  payload: { currentPassword: string; newPassword: string },
) => {
  const user = await User.findOne({ id: userId, isDeleted: false }).select(
    '+password',
  )
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')

  if (!(await User.isPasswordMatched(payload.currentPassword, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Current password is incorrect')
  }

  user.password = payload.newPassword // hashed by the pre-save hook
  user.needsPasswordChange = false
  user.passwordChangedAt = new Date()
  await user.save()
  await revokeAllTokens(user._id)
  return user
}

export const AuthServices = {
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
  changePassword,
}
