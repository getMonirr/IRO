import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { PublicControllers } from './public.controller'
import { PublicValidation } from './public.validation'

const router = express.Router()

// the website reads all of its content from this one endpoint
router.post('/posts/:slug/view', PublicControllers.incrementPostView)

router.get(
  '/content',
  validateRequest(PublicValidation.getContentValidationSchema),
  PublicControllers.getPublicContent,
)

export const PublicRoutes = router
