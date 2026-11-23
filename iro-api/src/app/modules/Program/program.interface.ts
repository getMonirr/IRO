import { TBi } from '../../shared/bilingual'

export interface TProgram {
  slug: string
  icon: string
  order: number
  status: 'ongoing' | 'planned'
  published: boolean
  title: TBi
  short: TBi
  body: TBi
  tagline: TBi
  points: TBi[]
  figures: { value: TBi; label: TBi }[]
  ayah: { arabic: string; text: TBi; source: TBi }
}
