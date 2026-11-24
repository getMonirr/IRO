import express from 'express'
import multer from 'multer'
import authGuard from '../../middlewares/authGuard'
import { ACCESS } from '../../shared/constant'
import { UploadControllers } from './upload.controller'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})

const router = express.Router()

router.post(
  '/image',
  authGuard(...ACCESS.CONTENT_WRITE),
  upload.single('file'),
  UploadControllers.uploadImage,
)

export const UploadRoutes = router
