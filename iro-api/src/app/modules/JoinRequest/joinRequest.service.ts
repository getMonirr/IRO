import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import {
  JoinRequestFilterableFields,
  JoinRequestSearchableFields,
} from './joinRequest.constant'
import { TJoinRequest } from './joinRequest.interface'
import { JoinRequest } from './joinRequest.model'

const createJoinRequestIntoDB = async (payload: TJoinRequest) =>
  JoinRequest.create(payload)

const getAllJoinRequestsFromDB = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(JoinRequest.find(), query)
    .search(JoinRequestSearchableFields)
    .filter(JoinRequestFilterableFields)
    .sort('-createdAt')
    .paginate()
  const data = await qb.modelQuery.lean()
  const meta = await qb.countTotal()
  return { data, meta }
}

const updateJoinRequestIntoDB = async (
  id: string,
  payload: Partial<TJoinRequest>,
) => {
  const result = await JoinRequest.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  )
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Request not found')
  return result
}

const deleteJoinRequestFromDB = async (id: string) => {
  const result = await JoinRequest.findByIdAndDelete(id)
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Request not found')
  return result
}

export const JoinRequestServices = {
  createJoinRequestIntoDB,
  getAllJoinRequestsFromDB,
  updateJoinRequestIntoDB,
  deleteJoinRequestFromDB,
}
