import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { recordAudit } from '../AuditLog/auditLog.utils'
import { DonationServices } from './donation.service'

const create = catchAsync(async (req, res) => {
  const result = await DonationServices.createDonationMethod(req.body)
  await recordAudit(req, {
    action: 'create',
    resource: 'donation-method',
    resourceId: String(result._id),
    meta: { slug: result.slug },
  })
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Donation method created successfully',
    data: result,
  })
})

const list = catchAsync(async (req, res) => {
  const { data, meta } = await DonationServices.getDonationMethods(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation methods retrieved successfully',
    meta,
    data,
  })
})

const update = catchAsync(async (req, res) => {
  const result = await DonationServices.updateDonationMethod(
    req.params.id,
    req.body,
  )
  await recordAudit(req, {
    action: 'update',
    resource: 'donation-method',
    resourceId: String(result._id),
    meta: { fields: Object.keys(req.body) },
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation method updated successfully',
    data: result,
  })
})

const remove = catchAsync(async (req, res) => {
  const result = await DonationServices.deleteDonationMethod(req.params.id)
  await recordAudit(req, {
    action: 'delete',
    resource: 'donation-method',
    resourceId: String(result._id),
    meta: { slug: result.slug },
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation method deleted successfully',
    data: null,
  })
})

export const DonationControllers = { create, list, update, remove }
