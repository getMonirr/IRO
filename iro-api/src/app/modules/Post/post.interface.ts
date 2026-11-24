import { TBi } from '../../shared/bilingual'

export type TPostType = 'blog' | 'news'

export interface TPost {
  _id?: unknown
  slug: string
  type: TPostType
  icon: string
  coverImage: string
  category: TBi
  title: TBi
  excerpt: TBi
  body: TBi
  author: TBi
  published: boolean
  featured: boolean
  publishedAt: Date
  viewCount: number
}
