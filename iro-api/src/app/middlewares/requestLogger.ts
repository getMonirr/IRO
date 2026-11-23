import { randomUUID } from 'crypto'
import pinoHttp from 'pino-http'
import logger from '../utils/logger'

/** One structured log line per request, with an x-request-id for tracing. */
const requestLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const id = (req.headers['x-request-id'] as string) || randomUUID()
    res.setHeader('x-request-id', id)
    return id
  },
  customLogLevel: (_req, res, err) =>
    err || res.statusCode >= 500
      ? 'error'
      : res.statusCode >= 400
        ? 'warn'
        : 'info',
  autoLogging: { ignore: req => req.url?.startsWith('/health') ?? false },
})

export default requestLogger
