import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || '12',
  default_password: process.env.DEFAULT_PASS,
  log_level: process.env.LOG_LEVEL || 'info',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  cookie_samesite: (process.env.COOKIE_SAMESITE || 'lax') as
    'lax' | 'strict' | 'none',
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  cors_origins: (process.env.FRONTEND_URLS || 'http://localhost:3000')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
  revalidate_url: process.env.REVALIDATE_URL,
  revalidate_secret: process.env.REVALIDATE_SECRET,
  super_admin_name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
}

/** Called once at startup: fail fast when required settings are missing or weak. */
export const assertConfig = () => {
  const missing = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ].filter(k => !process.env[k])
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    )
  }
  if (
    (process.env.JWT_ACCESS_SECRET as string).length < 32 ||
    (process.env.JWT_REFRESH_SECRET as string).length < 32
  ) {
    throw new Error('JWT secrets must be at least 32 characters long')
  }
  if (process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
    throw new Error(
      'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different',
    )
  }
}
