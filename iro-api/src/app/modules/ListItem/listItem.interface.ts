import { TBi } from '../../shared/bilingual'
import { ITEM_GROUPS } from './listItem.constant'

export interface TListItem {
  group: (typeof ITEM_GROUPS)[number]
  order: number
  published: boolean
  icon: string
  value: TBi
  title: TBi
  text: TBi
}
