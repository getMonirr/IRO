import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import config from '../config'
import AppError from '../errors/AppError'
import { verifyToken } from '../helpers/jwtHelpers'
import { User } from '../modules/User/user.model'
import { TUserRole } from '../modules/User/user.interface'
import catchAsync from '../utils/catchAsync'

/** authGuard(...roles): the request must carry a valid access token of one of the roles. */
const authGuard = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization

    // checking if the token is missing (accepts "Bearer <token>" and raw "<token>")
    if (!header) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }
    const token = header.startsWith('Bearer ') ? header.slice(7) : header

    // checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_access_secret as string)
    const { userId, iat } = decoded

    // checking if the user is exist
    const user = await User.isUserExistsByCustomId(userId)
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'This user is not found !')
    }

    // checking if the user is already deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !')
    }

    // checking if the user is blocked
    if (user.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !')
    }

    // token issued before the last password change is no longer valid
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !')
    }

    // the role is read from the database (not the token) so role changes apply immediately
    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You do not have permission to do this',
      )
    }

    req.user = { ...decoded, role: user.role, _id: user._id }
    next()
  })
}

export default authGuard
