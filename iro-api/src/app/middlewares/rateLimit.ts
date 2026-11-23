import rateLimit from 'express-rate-limit'

const base = { standardHeaders: 'draft-7' as const, legacyHeaders: false }
const body = (errorMessage: string) => ({
  success: false,
  message: 'Too Many Requests',
  errorMessage,
})

export const globalLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: body('Too many requests, please slow down'),
})

export const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: body('Too many login attempts, please try again later'),
})

export const joinLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: body('Too many submissions, please try again later'),
})
