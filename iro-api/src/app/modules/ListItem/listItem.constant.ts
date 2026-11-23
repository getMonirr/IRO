/**
 * stat -> value + title(label) + text(note)
 * principle / joinWay -> icon + title + text
 * roadmap -> title + text
 * goal / department -> title
 */
export const ITEM_GROUPS = [
  'stat',
  'principle',
  'goal',
  'department',
  'roadmap',
  'joinWay',
] as const

export const ListItemSearchableFields = ['title.bn', 'title.en']
export const ListItemFilterableFields = ['group', 'published']
