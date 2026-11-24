import express from 'express'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { ACCESS } from '../../shared/constant'
import { DonationControllers } from './donation.controller'
import { DonationValidation } from './donation.validation'

const router = express.Router()

router
  .route('/methods')
  .get(authGuard(...ACCESS.CONTENT_READ), DonationControllers.list)
  .post(
    authGuard(...ACCESS.CONTENT_WRITE),
    validateRequest(DonationValidation.create),
    DonationControllers.create,
  )

router
  .route('/methods/:id')
  .patch(
    authGuard(...ACCESS.CONTENT_WRITE),
    validateRequest(DonationValidation.update),
    DonationControllers.update,
  )
  .delete(authGuard(...ACCESS.CONTENT_DELETE), DonationControllers.remove)

export const DonationRoutes = router
