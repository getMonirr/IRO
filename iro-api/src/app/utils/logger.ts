import pino from 'pino'
import config from '../config'

const logger = pino({
  level: config.log_level,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      '*.password',
      '*.currentPassword',
      '*.newPassword',
    ],
    censor: '[redacted]',
  },
  // Vercel and other serverless platforms log JSON from stdout.
  // Pretty-printing requires pino-pretty and is not reliable in packaged deployments.
})

export default logger
