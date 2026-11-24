import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import config from '../../config'

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
})

export const uploadImageToCloudinary = (
  buffer: Buffer,
  folder = 'iro/uploads',
) =>
  new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          {
            width: 1600,
            height: 1600,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      },
    )
    Readable.from(buffer).pipe(stream)
  })
