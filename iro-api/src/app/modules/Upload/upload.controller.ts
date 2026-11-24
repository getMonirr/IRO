import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { uploadImageToCloudinary } from './upload.service'

const uploadImage = catchAsync(async (req, res) => {
  if (!req.file)
    throw new AppError(httpStatus.BAD_REQUEST, 'Image file is required')
  const folder =
    typeof req.body.folder === 'string' ? req.body.folder : 'iro/uploads'
  const result = await uploadImageToCloudinary(req.file.buffer, folder)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Image uploaded successfully',
    data: result,
  })
})

export const UploadControllers = { uploadImage }
