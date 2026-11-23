import mongoose from 'mongoose'
import config, { assertConfig } from '../config'
import logger from '../utils/logger'
import seedSuperAdmin, { seedContent } from './index'

/**
 * yarn seed         -> super admin (if missing) + default content for empty collections
 * yarn seed:reset   -> also wipes and reloads ALL website content from the defaults
 */
async function run() {
  assertConfig()
  await mongoose.connect(config.database_url as string)
  await seedSuperAdmin()
  await seedContent(process.argv.includes('--reset'))
  logger.info('seed finished')
  await mongoose.disconnect()
}

run().catch(err => {
  logger.fatal({ err }, 'seed failed')
  process.exit(1)
})
