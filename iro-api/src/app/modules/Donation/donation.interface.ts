import { TBi } from '../../shared/bilingual'

export interface TDonationMethod {
  slug: string
  region: 'bangladesh' | 'abroad'
  type:
    'mobile-banking' | 'bank-transfer' | 'card' | 'paypal' | 'crypto' | 'other'
  name: TBi
  provider: string
  accountName: TBi
  accountNumber: string
  instructions: TBi
  checkoutUrl: string
  currency: string
  enabled: boolean
  order: number
}
