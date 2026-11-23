import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuditLogServices } from './auditLog.service'

const getAllAuditLogs = catchAsync(async (req, res) => {
  const { data, meta } = await AuditLogServices.getAllAuditLogsFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Audit logs retrieved successfully',
    meta,
    data,
  })
})

export const AuditLogControllers = { getAllAuditLogs }
