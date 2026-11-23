import express from 'express'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { ACCESS } from '../../shared/constant'
import { ProgramControllers } from './program.controller'
import { ProgramValidation } from './program.validation'

const router = express.Router()

router
  .route('/')
  .get(authGuard(...ACCESS.CONTENT_READ), ProgramControllers.getAllPrograms)
  .post(
    authGuard(...ACCESS.CONTENT_WRITE),
    validateRequest(ProgramValidation.createProgramValidationSchema),
    ProgramControllers.createProgram,
  )

router
  .route('/:id')
  .get(authGuard(...ACCESS.CONTENT_READ), ProgramControllers.getSingleProgram)
  .patch(
    authGuard(...ACCESS.CONTENT_WRITE),
    validateRequest(ProgramValidation.updateProgramValidationSchema),
    ProgramControllers.updateProgram,
  )
  .delete(authGuard(...ACCESS.CONTENT_DELETE), ProgramControllers.deleteProgram)

export const ProgramRoutes = router
