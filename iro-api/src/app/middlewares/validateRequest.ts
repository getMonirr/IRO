import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'
import catchAsync from '../utils/catchAsync'

/**
 * Validates { body, cookies, query, params } against the schema.
 * The parsed (and stripped / defaulted) body and query replace the originals, so unknown
 * fields such as a client-sent "role" can never reach the database layer.
 */
const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
      query: req.query,
      params: req.params,
    })

    if (parsed.body !== undefined) req.body = parsed.body
    if (parsed.query !== undefined) req.query = parsed.query

    next()
  })
}

export default validateRequest
