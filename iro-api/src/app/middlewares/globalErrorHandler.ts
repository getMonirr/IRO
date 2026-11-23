/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ErrorRequestHandler } from 'express'
import httpStatus from 'http-status'
import config from '../config'
import AppError from '../errors/AppError'
import handleCastError from '../errors/handleCastError'
import handleDuplicateError from '../errors/handleDuplicateError'
import handleValidationError from '../errors/handleValidationError'
import handleZodError from '../errors/handleZodError'
import logger from '../utils/logger'

// define simplified error function
const simplifiedError = (err: any) => {
  // set default error properties
  const statusCode = 500
  const message = 'Something went wrong'
  const errorMessage = 'Internal server error'
  const errorDetails = null

  // handle zod validation error
  if (err?.name === 'ZodError') {
    return handleZodError(err)
  }

  // handle duplicate error
  if (err?.code === 11000) {
    return handleDuplicateError(err)
  }

  // handle cast error
  if (err?.name === 'CastError') {
    return handleCastError(err)
  }

  // handle mongoose validation error
  if (err?.name === 'ValidationError') {
    return handleValidationError(err)
  }

  // handle AppError (keeps its own message, e.g. "Invalid email or password")
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      message,
      errorMessage: err.message,
      errorDetails: null,
    }
  }

  // handle json web token error
  if (
    err?.name === 'JsonWebTokenError' ||
    err?.name === 'TokenExpiredError' ||
    err?.statusCode === 401
  ) {
    return {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized Access',
      errorMessage: 'Invalid or expired token. Please log in again.',
      errorDetails: null,
    }
  }

  // malformed JSON / oversized body
  if (err?.type === 'entity.parse.failed') {
    return {
      statusCode: 400,
      message: 'Bad Request',
      errorMessage: 'Malformed JSON body',
      errorDetails: null,
    }
  }
  if (err?.type === 'entity.too.large') {
    return {
      statusCode: 413,
      message: 'Bad Request',
      errorMessage: 'Payload too large',
      errorDetails: null,
    }
  }

  // anything else is a server error: hide details from the client, log them
  return { statusCode, message, errorMessage, errorDetails }
}

// define a global error handler middleware
const globalErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  const { statusCode, message, errorMessage, errorDetails } =
    simplifiedError(err)

  if (statusCode >= 500) {
    ;(req.log ?? logger).error({ err }, 'unhandled error')
  } else {
    ;(req.log ?? logger).warn({ statusCode, errorMessage }, 'request failed')
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails: config.NODE_ENV === 'production' ? null : errorDetails,
    stack: config.NODE_ENV === 'production' ? null : err?.stack,
  })
}

export default globalErrorHandler
