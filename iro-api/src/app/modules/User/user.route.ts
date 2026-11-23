import express from 'express'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { ACCESS } from '../../shared/constant'
import { UserControllers } from './user.controller'
import { UserValidation } from './user.validation'

const router = express.Router()

router.use(authGuard(...ACCESS.USER_MANAGE))

router
  .route('/')
  .get(UserControllers.getAllUsers)
  .post(
    validateRequest(UserValidation.createUserValidationSchema),
    UserControllers.createUser,
  )

router
  .route('/:id')
  .get(UserControllers.getSingleUser)
  .patch(
    validateRequest(UserValidation.updateUserValidationSchema),
    UserControllers.updateUser,
  )
  .delete(UserControllers.deleteUser)

// export user routes
export const UserRoutes = router
