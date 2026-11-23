import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { recordAudit } from '../AuditLog/auditLog.utils'
import { ListItemServices } from './listItem.service'

const createListItem = catchAsync(async (req, res) => {
  const result = await ListItemServices.createListItemIntoDB(req.body)
  await recordAudit(req, {
    action: 'create',
    resource: 'item',
    resourceId: String(result._id),
    meta: { group: result.group },
  })
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Item created successfully',
    data: result,
  })
})

const getAllListItems = catchAsync(async (req, res) => {
  const { data, meta } = await ListItemServices.getAllListItemsFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Items retrieved successfully',
    meta,
    data,
  })
})

const getSingleListItem = catchAsync(async (req, res) => {
  const result = await ListItemServices.getSingleListItemFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item retrieved successfully',
    data: result,
  })
})

const updateListItem = catchAsync(async (req, res) => {
  const result = await ListItemServices.updateListItemIntoDB(
    req.params.id,
    req.body,
  )
  await recordAudit(req, {
    action: 'update',
    resource: 'item',
    resourceId: String(result._id),
    meta: { group: result.group, fields: Object.keys(req.body) },
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item updated successfully',
    data: result,
  })
})

const deleteListItem = catchAsync(async (req, res) => {
  const result = await ListItemServices.deleteListItemFromDB(req.params.id)
  await recordAudit(req, {
    action: 'delete',
    resource: 'item',
    resourceId: String(result._id),
    meta: { group: result.group },
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item deleted successfully',
    data: null,
  })
})

export const ListItemControllers = {
  createListItem,
  getAllListItems,
  getSingleListItem,
  updateListItem,
  deleteListItem,
}
