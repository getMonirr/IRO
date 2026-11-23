import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { recordAudit } from '../AuditLog/auditLog.utils'
import { UserServices } from './user.service'

const createUser = catchAsync(async (req, res) => {
  const user = await UserServices.createUserIntoDB(req.body, req.user)
  await recordAudit(req, {
    action: 'create',
    resource: 'user',
    resourceId: user.id,
    meta: { email: user.email, role: user.role },
  })

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: user,
  })
})

const getAllUsers = catchAsync(async (req, res) => {
  const { data, meta } = await UserServices.getAllUsersFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta,
    data,
  })
})

const getSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.getSingleUserFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  })
})

const updateUser = catchAsync(async (req, res) => {
  const user = await UserServices.updateUserIntoDB(
    req.params.id,
    req.body,
    req.user,
  )
  await recordAudit(req, {
    action: 'update',
    resource: 'user',
    resourceId: user.id,
    meta: {
      fields: Object.keys(req.body).map(k =>
        k === 'password' ? 'password(reset)' : k,
      ),
    },
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: user,
  })
})

const deleteUser = catchAsync(async (req, res) => {
  const user = await UserServices.deleteUserFromDB(req.params.id, req.user)
  await recordAudit(req, {
    action: 'delete',
    resource: 'user',
    resourceId: user.id,
    meta: { email: user.email },
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  })
})

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
}
