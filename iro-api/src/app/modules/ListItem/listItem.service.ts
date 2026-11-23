import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { notifyFrontend } from '../../helpers/revalidate'
import {
  ListItemFilterableFields,
  ListItemSearchableFields,
} from './listItem.constant'
import { TListItem } from './listItem.interface'
import { ListItem } from './listItem.model'

const createListItemIntoDB = async (payload: TListItem) => {
  const result = await ListItem.create(payload)
  notifyFrontend()
  return result
}

const getAllListItemsFromDB = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(ListItem.find(), query)
    .search(ListItemSearchableFields)
    .filter(ListItemFilterableFields)
    .sort()
    .paginate()
  const data = await qb.modelQuery.lean()
  const meta = await qb.countTotal()
  return { data, meta }
}

const getSingleListItemFromDB = async (id: string) => {
  const result = await ListItem.findById(id).lean()
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Item not found')
  return result
}

const updateListItemIntoDB = async (
  id: string,
  payload: Partial<TListItem>,
) => {
  const result = await ListItem.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  )
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Item not found')
  notifyFrontend()
  return result
}

const deleteListItemFromDB = async (id: string) => {
  const result = await ListItem.findByIdAndDelete(id)
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Item not found')
  notifyFrontend()
  return result
}

export const ListItemServices = {
  createListItemIntoDB,
  getAllListItemsFromDB,
  getSingleListItemFromDB,
  updateListItemIntoDB,
  deleteListItemFromDB,
}
