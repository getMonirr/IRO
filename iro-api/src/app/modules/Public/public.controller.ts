import httpStatus from 'http-status'
import { TLang } from '../../shared/bilingual'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { PostServices } from '../Post/post.service'
import { PublicServices } from './public.service'

const getPublicContent = catchAsync(async (req, res) => {
  const data = await PublicServices.getPublicContentFromDB(
    req.query.lang as TLang,
  )
  res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120')
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Content retrieved successfully',
    data,
  })
})

const incrementPostView = catchAsync(async (req, res) => {
  const result = await PostServices.incrementPostViewBySlug(req.params.slug)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post view recorded',
    data: { viewCount: result.viewCount },
  })
})

export const PublicControllers = { getPublicContent, incrementPostView }
