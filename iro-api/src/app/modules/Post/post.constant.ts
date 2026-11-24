export const POST_TYPES = ['blog', 'news'] as const
export const PostFilterableFields = ['type', 'published', 'featured']
export const PostSearchableFields = [
  'slug',
  'title.bn',
  'title.en',
  'category.bn',
  'category.en',
]
