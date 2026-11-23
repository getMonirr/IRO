import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import config from '../../config'
import { createToken, toMs } from '../../helpers/jwtHelpers'
import { TClientMeta } from './auth.interface'
import { RefreshToken } from './auth.model'

export const refreshCookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production' || config.cookie_samesite === 'none',
  sameSite: config.cookie_samesite,
  path: '/api/v1/auth',
  maxAge: toMs(config.jwt_refresh_expires_in),
} as const

/** Issues an access token + a refresh token (its jti is stored so it can be rotated / revoked). */
export const issueTokens = async (
  user: { _id: Types.ObjectId; id: string; role: string },
  meta: TClientMeta,
) => {
  const jti = randomUUID()
  const refreshToken = createToken(
    { userId: user.id, jti },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in,
  )
  const { exp } = jwt.decode(refreshToken) as { exp: number }
  await RefreshToken.create({
    user: user._id,
    jti,
    expiresAt: new Date(exp * 1000),
    ip: meta.ip,
    userAgent: meta.userAgent?.slice(0, 200),
  })

  const accessToken = createToken(
    { userId: user.id, role: user.role },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in,
  )
  return { accessToken, refreshToken }
}

export const revokeAllTokens = (userObjectId: Types.ObjectId | string) =>
  RefreshToken.updateMany(
    { user: userObjectId, revokedAt: { $exists: false } },
    { revokedAt: new Date() },
  )
