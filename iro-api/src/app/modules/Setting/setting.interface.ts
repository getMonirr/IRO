import { SETTING_KEYS } from './setting.constant'

export interface TSetting {
  key: (typeof SETTING_KEYS)[number]
  value: { bn: unknown; en: unknown }
}
