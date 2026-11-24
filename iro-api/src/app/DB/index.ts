import config from '../config'
import { DonationMethod } from '../modules/Donation/donation.model'
import { ListItem } from '../modules/ListItem/listItem.model'
import { Post } from '../modules/Post/post.model'
import { Program } from '../modules/Program/program.model'
import { Setting } from '../modules/Setting/setting.model'
import { User } from '../modules/User/user.model'
import { USER_ROLE } from '../shared/constant'
import logger from '../utils/logger'
import seedData from './seed-data.json'

/** Creates the first super admin when none exists (credentials from .env). */
const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin })
  if (isSuperAdminExits) return

  if (!config.super_admin_email || !config.super_admin_password) {
    logger.warn(
      'No super admin yet: set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env',
    )
    return
  }
  await User.create({
    id: '0001',
    name: config.super_admin_name,
    email: config.super_admin_email,
    password: config.super_admin_password,
    needsPasswordChange: true,
    role: USER_ROLE.superAdmin,
    status: 'in-progress',
    isDeleted: false,
  })
  logger.info(
    { email: config.super_admin_email },
    'super admin created, please change the password after the first login',
  )
}

/**
 * Loads the default Bangla + English website content.
 * Without `reset` it only fills collections that are empty, so it never overwrites or
 * re-adds anything an admin changed or deleted. `reset` replaces all content (users are untouched).
 */
export const seedContent = async (reset = false) => {
  if (reset) {
    await Promise.all([
      Program.deleteMany({}),
      ListItem.deleteMany({}),
      Setting.deleteMany({}),
      Post.deleteMany({}),
      DonationMethod.deleteMany({}),
    ])
    logger.warn('content collections cleared')
  }
  if (!(await Program.exists({}))) await Program.insertMany(seedData.programs)
  if (!(await ListItem.exists({}))) await ListItem.insertMany(seedData.items)
  if (!(await Setting.exists({}))) await Setting.insertMany(seedData.settings)
  if (!(await Post.exists({}))) await Post.insertMany(seedData.posts)
  if (!(await DonationMethod.exists({})) && seedData.donationMethods)
    await DonationMethod.insertMany(seedData.donationMethods)
}

export default seedSuperAdmin
