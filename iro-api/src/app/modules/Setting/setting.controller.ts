import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { recordAudit } from '../AuditLog/auditLog.utils'
import { SettingServices } from './setting.service'

const getAllSettings = catchAsync(async (req, res) => {
  const result = await SettingServices.getAllSettingsFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Settings retrieved successfully',
    data: result,
  })
})

const updateSetting = catchAsync(async (req, res) => {
  const result = await SettingServices.upsertSettingIntoDB(
    req.params.key,
    req.body,
  )
  await recordAudit(req, {
    action: 'update',
    resource: 'setting',
    resourceId: req.params.key,
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Setting updated successfully',
    data: result,
  })
})

export const SettingControllers = { getAllSettings, updateSetting }
