import express from 'express'
import authGuard from '../../middlewares/authGuard'
import { joinLimiter } from '../../middlewares/rateLimit'
import validateRequest from '../../middlewares/validateRequest'
import { ACCESS } from '../../shared/constant'
import { JoinRequestControllers } from './joinRequest.controller'
import { JoinRequestValidation } from './joinRequest.validation'

const router = express.Router()

router
  .route('/')
  // public
  .post(
    joinLimiter,
    validateRequest(JoinRequestValidation.createJoinRequestValidationSchema),
    JoinRequestControllers.createJoinRequest,
  )
  // dashboard
  .get(
    authGuard(...ACCESS.JOIN_READ),
    JoinRequestControllers.getAllJoinRequests,
  )

router
  .route('/:id')
  .patch(
    authGuard(...ACCESS.JOIN_WRITE),
    validateRequest(JoinRequestValidation.updateJoinRequestValidationSchema),
    JoinRequestControllers.updateJoinRequest,
  )
  .delete(
    authGuard(...ACCESS.JOIN_DELETE),
    JoinRequestControllers.deleteJoinRequest,
  )

export const JoinRequestRoutes = router
