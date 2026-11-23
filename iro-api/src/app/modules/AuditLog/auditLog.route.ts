import express from 'express'
import authGuard from '../../middlewares/authGuard'
import { ACCESS } from '../../shared/constant'
import { AuditLogControllers } from './auditLog.controller'

const router = express.Router()

router.get(
  '/',
  authGuard(...ACCESS.AUDIT_READ),
  AuditLogControllers.getAllAuditLogs,
)

export const AuditLogRoutes = router
