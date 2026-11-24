import { Schema, model } from 'mongoose'
import { bi } from '../../shared/bilingual'
import { DONATION_REGIONS, DONATION_TYPES } from './donation.constant'
import { TDonationMethod } from './donation.interface'

const donationMethodSchema = new Schema<TDonationMethod>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    region: {
      type: String,
      enum: DONATION_REGIONS,
      required: true,
      index: true,
    },
    type: { type: String, enum: DONATION_TYPES, required: true },
    name: bi(),
    provider: { type: String, default: '', trim: true },
    accountName: bi(),
    accountNumber: { type: String, default: '', trim: true },
    instructions: bi(),
    checkoutUrl: { type: String, default: '', trim: true },
    currency: { type: String, default: 'BDT', trim: true, uppercase: true },
    enabled: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
)

export const DonationMethod = model<TDonationMethod>(
  'DonationMethod',
  donationMethodSchema,
)
