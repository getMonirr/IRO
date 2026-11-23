import express from 'express'
import authGuard from '../../middlewares/authGuard'
import validateRequest from '../../middlewares/validateRequest'
import { ACCESS } from '../../shared/constant'
import { SettingControllers } from './setting.controller'
import { SettingValidation } from './setting.validation'

const router = express.Router()

router.get(
  '/',
  authGuard(...ACCESS.CONTENT_READ),
  SettingControllers.getAllSettings,
)
router.put(
  '/:key',
  authGuard(...ACCESS.SETTINGS_WRITE),
  validateRequest(SettingValidation.updateSettingValidationSchema),
  SettingControllers.updateSetting,
)

export const SettingRoutes = router
