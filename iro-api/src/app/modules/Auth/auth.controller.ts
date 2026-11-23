import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { recordAudit } from '../AuditLog/auditLog.utils'
import { REFRESH_COOKIE } from './auth.constant'
import { AuthServices } from './auth.service'
import { refreshCookieOptions } from './auth.utils'

const clientMeta = (req: {
  ip?: string
  get: (h: string) => string | undefined
}) => ({
  ip: req.ip,
  userAgent: req.get('user-agent'),
})

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, user } = await AuthServices.loginUser(
    req.body,
    clientMeta(req),
  )
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions)
  await recordAudit(req, {
    action: 'login',
    resource: 'auth',
    resourceId: user.id,
    actor: { id: user._id, role: user.role },
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: { accessToken, user, needsPasswordChange: user.needsPasswordChange },
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const tokens = await AuthServices.refreshToken(
    req.cookies?.[REFRESH_COOKIE],
    clientMeta(req),
  )
  res.cookie(REFRESH_COOKIE, tokens.refreshToken, refreshCookieOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: { accessToken: tokens.accessToken },
  })
})

const logoutUser = catchAsync(async (req, res) => {
  await AuthServices.logoutUser(req.cookies?.[REFRESH_COOKIE])
  res.clearCookie(REFRESH_COOKIE, {
    ...refreshCookieOptions,
    maxAge: undefined,
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully',
    data: null,
  })
})

const getMe = catchAsync(async (req, res) => {
  const user = await AuthServices.getMe(req.user.userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: user,
  })
})

const changePassword = catchAsync(async (req, res) => {
  const user = await AuthServices.changePassword(req.user.userId, req.body)
  await recordAudit(req, {
    action: 'change-password',
    resource: 'auth',
    resourceId: user.id,
  })
  res.clearCookie(REFRESH_COOKIE, {
    ...refreshCookieOptions,
    maxAge: undefined,
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated successfully! Please log in again.',
    data: null,
  })
})

export const AuthControllers = {
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
  changePassword,
}
