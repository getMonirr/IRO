import { Schema, model } from 'mongoose'
import { bi } from '../../shared/bilingual'
import { ITEM_GROUPS } from './listItem.constant'
import { TListItem } from './listItem.interface'

const listItemSchema = new Schema<TListItem>(
  {
    group: { type: String, enum: ITEM_GROUPS, required: true, index: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    icon: { type: String, default: '' },
    value: bi(),
    title: bi(),
    text: bi(),
  },
  { timestamps: true },
)
listItemSchema.index({ group: 1, order: 1 })

export const ListItem = model<TListItem>('ListItem', listItemSchema)
