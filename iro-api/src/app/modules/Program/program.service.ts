import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { notifyFrontend } from '../../helpers/revalidate'
import {
  ProgramFilterableFields,
  ProgramSearchableFields,
} from './program.constant'
import { TProgram } from './program.interface'
import { Program } from './program.model'

const createProgramIntoDB = async (payload: TProgram) => {
  const result = await Program.create(payload)
  notifyFrontend()
  return result
}

const getAllProgramsFromDB = async (query: Record<string, unknown>) => {
  const qb = new QueryBuilder(Program.find(), query)
    .search(ProgramSearchableFields)
    .filter(ProgramFilterableFields)
    .sort()
    .paginate()
  const data = await qb.modelQuery.lean()
  const meta = await qb.countTotal()
  return { data, meta }
}

const getSingleProgramFromDB = async (id: string) => {
  const result = await Program.findById(id).lean()
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Program not found')
  return result
}

const updateProgramIntoDB = async (id: string, payload: Partial<TProgram>) => {
  const result = await Program.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  )
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Program not found')
  notifyFrontend()
  return result
}

const deleteProgramFromDB = async (id: string) => {
  const result = await Program.findByIdAndDelete(id)
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Program not found')
  notifyFrontend()
  return result
}

export const ProgramServices = {
  createProgramIntoDB,
  getAllProgramsFromDB,
  getSingleProgramFromDB,
  updateProgramIntoDB,
  deleteProgramFromDB,
}
