import { Router } from 'express'
import { AuditLogRoutes } from '../modules/AuditLog/auditLog.route'
import { AuthRoutes } from '../modules/Auth/auth.route'
import { JoinRequestRoutes } from '../modules/JoinRequest/joinRequest.route'
import { ListItemRoutes } from '../modules/ListItem/listItem.route'
import { ProgramRoutes } from '../modules/Program/program.route'
import { PublicRoutes } from '../modules/Public/public.route'
import { SettingRoutes } from '../modules/Setting/setting.route'
import { UserRoutes } from '../modules/User/user.route'

const router = Router()

const moduleRoutes = [
  { path: '/public', route: PublicRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/programs', route: ProgramRoutes },
  { path: '/items', route: ListItemRoutes },
  { path: '/settings', route: SettingRoutes },
  { path: '/join-requests', route: JoinRequestRoutes },
  { path: '/audit-logs', route: AuditLogRoutes },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router
