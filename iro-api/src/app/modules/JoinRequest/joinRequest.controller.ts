import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { recordAudit } from '../AuditLog/auditLog.utils'
import { JoinRequestServices } from './joinRequest.service'

// public: the "join us" form on the website
const createJoinRequest = catchAsync(async (req, res) => {
  const result = await JoinRequestServices.createJoinRequestIntoDB({
    ...req.body,
    ip: req.ip,
  })
  req.log.info(
    { joinRequestId: String(result._id), type: result.type },
    'join request received',
  )
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Your request has been received',
    data: { id: result._id },
  })
})

const getAllJoinRequests = catchAsync(async (req, res) => {
  const { data, meta } = await JoinRequestServices.getAllJoinRequestsFromDB(
    req.query,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Join requests retrieved successfully',
    meta,
    data,
  })
})

const updateJoinRequest = catchAsync(async (req, res) => {
  const result = await JoinRequestServices.updateJoinRequestIntoDB(
    req.params.id,
    req.body,
  )
  await recordAudit(req, {
    action: 'update',
    resource: 'join-request',
    resourceId: String(result._id),
    meta: req.body,
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Join request updated successfully',
    data: result,
  })
})

const deleteJoinRequest = catchAsync(async (req, res) => {
  const result = await JoinRequestServices.deleteJoinRequestFromDB(
    req.params.id,
  )
  await recordAudit(req, {
    action: 'delete',
    resource: 'join-request',
    resourceId: String(result._id),
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Join request deleted successfully',
    data: null,
  })
})

export const JoinRequestControllers = {
  createJoinRequest,
  getAllJoinRequests,
  updateJoinRequest,
  deleteJoinRequest,
}
