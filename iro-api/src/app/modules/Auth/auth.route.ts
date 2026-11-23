import express from 'express'
import authGuard from '../../middlewares/authGuard'
import { loginLimiter } from '../../middlewares/rateLimit'
import validateRequest from '../../middlewares/validateRequest'
import { ACCESS } from '../../shared/constant'
import { AuthControllers } from './auth.controller'
import { AuthValidation } from './auth.validation'

const router = express.Router()

router.post(
  '/login',
  loginLimiter,
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
)
router.post('/refresh-token', AuthControllers.refreshToken)
router.post('/logout', AuthControllers.logoutUser)
router.get('/me', authGuard(...ACCESS.ANY), AuthControllers.getMe)
router.post(
  '/change-password',
  authGuard(...ACCESS.ANY),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
)

export const AuthRoutes = router
