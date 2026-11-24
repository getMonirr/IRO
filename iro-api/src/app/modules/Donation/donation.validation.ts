import { z } from 'zod'
import { biReqZod, biZod } from '../../shared/bilingual'
import { DONATION_REGIONS, DONATION_TYPES } from './donation.constant'

const donationMethodBody = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]{2,60}$/, 'lowercase letters, digits and hyphens only'),
  region: z.enum(DONATION_REGIONS),
  type: z.enum(DONATION_TYPES),
  name: biReqZod(120),
  provider: z.string().trim().max(120).default(''),
  accountName: biZod(120),
  accountNumber: z.string().trim().max(160).default(''),
  instructions: biZod(1000),
  checkoutUrl: z.string().url().or(z.literal('')).default(''),
  currency: z.string().trim().min(3).max(8).default('BDT'),
  enabled: z.boolean().default(true),
  order: z.number().int().default(0),
})

export const DonationValidation = {
  create: z.object({ body: donationMethodBody }),
  update: z.object({ body: donationMethodBody.partial() }),
}
