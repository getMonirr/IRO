export const DONATION_REGIONS = ['bangladesh', 'abroad'] as const
export const DONATION_TYPES = [
  'mobile-banking',
  'bank-transfer',
  'card',
  'paypal',
  'crypto',
  'other',
] as const

export const DonationSearchableFields = ['name.bn', 'name.en', 'provider']
export const DonationFilterableFields = ['region', 'type', 'enabled']
