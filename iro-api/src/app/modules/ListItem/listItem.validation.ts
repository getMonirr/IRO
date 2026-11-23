import { z } from 'zod'
import { biReqZod, biZod } from '../../shared/bilingual'
import { ITEM_GROUPS } from './listItem.constant'

const listItemBody = z.object({
  group: z.enum(ITEM_GROUPS),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
  icon: z.string().max(10).default(''),
  value: biZod(30),
  title: biReqZod(300),
  text: biZod(1000),
})

const createListItemValidationSchema = z.object({ body: listItemBody })
const updateListItemValidationSchema = z.object({
  body: listItemBody.partial(),
})

export const ListItemValidation = {
  createListItemValidationSchema,
  updateListItemValidationSchema,
}
