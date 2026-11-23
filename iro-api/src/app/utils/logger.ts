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
  // production: JSON to stdout (Docker / log collectors) · development: pretty
  transport:
    config.NODE_ENV === 'production'
      ? undefined
      : {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:HH:MM:ss' },
        },
})

export default logger
