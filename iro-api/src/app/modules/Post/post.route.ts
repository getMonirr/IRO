import express from 'express'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { ACCESS } from '../../shared/constant'
import { PostControllers } from './post.controller'
import { PostValidation } from './post.validation'

const router = express.Router()

router.get(
  '/options',
  authGuard(...ACCESS.CONTENT_READ),
  PostControllers.getPostOptions,
)

router
  .route('/')
  .get(authGuard(...ACCESS.CONTENT_READ), PostControllers.getAllPosts)
  .post(
    authGuard(...ACCESS.CONTENT_WRITE),
    validateRequest(PostValidation.createPostValidationSchema),
    PostControllers.createPost,
  )

router
  .route('/:id')
  .get(authGuard(...ACCESS.CONTENT_READ), PostControllers.getSinglePost)
  .patch(
    authGuard(...ACCESS.CONTENT_WRITE),
    validateRequest(PostValidation.updatePostValidationSchema),
    PostControllers.updatePost,
  )
  .delete(authGuard(...ACCESS.CONTENT_DELETE), PostControllers.deletePost)

export const PostRoutes = router
