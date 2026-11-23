import { notifyFrontend } from '../../helpers/revalidate'
import { TSetting } from './setting.interface'
import { Setting } from './setting.model'

const getAllSettingsFromDB = async () => Setting.find().lean()

const upsertSettingIntoDB = async (key: string, value: TSetting['value']) => {
  const result = await Setting.findOneAndUpdate(
    { key },
    { $set: { value } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
  notifyFrontend()
  return result
}

export const SettingServices = { getAllSettingsFromDB, upsertSettingIntoDB }
