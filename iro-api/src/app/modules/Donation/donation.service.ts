import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { notifyFrontend } from '../../helpers/revalidate'
import {
  DonationFilterableFields,
  DonationSearchableFields,
} from './donation.constant'
import { TDonationMethod } from './donation.interface'
import { DonationMethod } from './donation.model'

const createDonationMethod = async (payload: TDonationMethod) => {
  const result = await DonationMethod.create(payload)
  notifyFrontend()
  return result
}

const getDonationMethods = async (
  query: Record<string, unknown>,
  publicOnly = false,
) => {
  const base = publicOnly
    ? DonationMethod.find({ enabled: true })
    : DonationMethod.find()
  const qb = new QueryBuilder(base, query)
    .search(DonationSearchableFields)
    .filter(DonationFilterableFields)
    .sort()
    .paginate()
  const data = await qb.modelQuery.sort({ order: 1 }).lean()
  const meta = await qb.countTotal()
  return { data, meta }
}

const updateDonationMethod = async (
  id: string,
  payload: Partial<TDonationMethod>,
) => {
  const result = await DonationMethod.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  )
  if (!result)
    throw new AppError(httpStatus.NOT_FOUND, 'Donation method not found')
  notifyFrontend()
  return result
}

const deleteDonationMethod = async (id: string) => {
  const result = await DonationMethod.findByIdAndDelete(id)
  if (!result)
    throw new AppError(httpStatus.NOT_FOUND, 'Donation method not found')
  notifyFrontend()
  return result
}

export const DonationServices = {
  createDonationMethod,
  getDonationMethods,
  updateDonationMethod,
  deleteDonationMethod,
}
