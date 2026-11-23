import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { recordAudit } from '../AuditLog/auditLog.utils'
import { ProgramServices } from './program.service'

const createProgram = catchAsync(async (req, res) => {
  const result = await ProgramServices.createProgramIntoDB(req.body)
  await recordAudit(req, {
    action: 'create',
    resource: 'program',
    resourceId: String(result._id),
    meta: { slug: result.slug },
  })
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Program created successfully',
    data: result,
  })
})

const getAllPrograms = catchAsync(async (req, res) => {
  const { data, meta } = await ProgramServices.getAllProgramsFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Programs retrieved successfully',
    meta,
    data,
  })
})

const getSingleProgram = catchAsync(async (req, res) => {
  const result = await ProgramServices.getSingleProgramFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Program retrieved successfully',
    data: result,
  })
})

const updateProgram = catchAsync(async (req, res) => {
  const result = await ProgramServices.updateProgramIntoDB(
    req.params.id,
    req.body,
  )
  await recordAudit(req, {
    action: 'update',
    resource: 'program',
    resourceId: String(result._id),
    meta: { fields: Object.keys(req.body) },
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Program updated successfully',
    data: result,
  })
})

const deleteProgram = catchAsync(async (req, res) => {
  const result = await ProgramServices.deleteProgramFromDB(req.params.id)
  await recordAudit(req, {
    action: 'delete',
    resource: 'program',
    resourceId: String(result._id),
    meta: { slug: result.slug },
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Program deleted successfully',
    data: null,
  })
})

export const ProgramControllers = {
  createProgram,
  getAllPrograms,
  getSingleProgram,
  updateProgram,
  deleteProgram,
}
