import express from 'express'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { ACCESS } from '../../shared/constant'
import { ListItemControllers } from './listItem.controller'
import { ListItemValidation } from './listItem.validation'

const router = express.Router()

router
  .route('/')
  .get(authGuard(...ACCESS.CONTENT_READ), ListItemControllers.getAllListItems)
  .post(
    authGuard(...ACCESS.CONTENT_WRITE),
    validateRequest(ListItemValidation.createListItemValidationSchema),
    ListItemControllers.createListItem,
  )

router
  .route('/:id')
  .get(authGuard(...ACCESS.CONTENT_READ), ListItemControllers.getSingleListItem)
  .patch(
    authGuard(...ACCESS.CONTENT_WRITE),
    validateRequest(ListItemValidation.updateListItemValidationSchema),
    ListItemControllers.updateListItem,
  )
  .delete(
    authGuard(...ACCESS.CONTENT_DELETE),
    ListItemControllers.deleteListItem,
  )

export const ListItemRoutes = router
