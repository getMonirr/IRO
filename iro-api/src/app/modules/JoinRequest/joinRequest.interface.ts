import { JOIN_STATUS, JOIN_TYPES } from './joinRequest.constant'

export interface TJoinRequest {
  name: string
  contact: string
  type: (typeof JOIN_TYPES)[number]
  message: string
  lang: 'bn' | 'en'
  status: (typeof JOIN_STATUS)[number]
  note: string
  ip?: string
}
