import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import config, { assertConfig } from './app/config'
import seedSuperAdmin, { seedContent } from './app/DB'
import logger from './app/utils/logger'

let server: Server

async function main() {
  try {
    assertConfig()
    await mongoose.connect(config.database_url as string, {
      serverSelectionTimeoutMS: 5000,
    })
    logger.info('MongoDB connected')

    await seedSuperAdmin()
    await seedContent()

    server = app.listen(config.port, () => {
      logger.info(`app is listening on port ${config.port}`)
    })
  } catch (err) {
    logger.fatal({ err }, 'failed to start')
    process.exit(1)
  }
}

main()

const shutdown = (signal: string) => {
  logger.info({ signal }, 'shutting down')
  if (!server) return process.exit(0)
  server.close(async () => {
    await mongoose.disconnect()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10000).unref()
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

process.on('unhandledRejection', err => {
  logger.error({ err }, 'unhandledRejection is detected, shutting down ...')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', err => {
  logger.error({ err }, 'uncaughtException is detected, shutting down ...')
  process.exit(1)
})
