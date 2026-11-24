import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PostServices } from './post.service'

const createPost = catchAsync(async (req, res) => {
  const result = await PostServices.createPostIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post created successfully',
    data: result,
  })
})

const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostsFromDB(
    req.query as Record<string, unknown>,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getSinglePost = catchAsync(async (req, res) => {
  const result = await PostServices.getSinglePostFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post retrieved successfully',
    data: result,
  })
})

const updatePost = catchAsync(async (req, res) => {
  const result = await PostServices.updatePostIntoDB(req.params.id, req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully',
    data: result,
  })
})

const getPostOptions = catchAsync(async (req, res) => {
  const result = await PostServices.getPostOptionsFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post options retrieved successfully',
    data: result,
  })
})

const deletePost = catchAsync(async (req, res) => {
  const result = await PostServices.deletePostFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post deleted successfully',
    data: result,
  })
})

export const PostControllers = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getPostOptions,
}
