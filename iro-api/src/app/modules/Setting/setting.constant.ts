/** Content keys store bilingual objects; theme stores validated CSS color tokens. */
export const SETTING_KEYS = ['site', 'nav', 'ui', 'theme'] as const

export const THEME_TOKEN_KEYS = [
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'accent',
  'accentForeground',
  'background',
  'foreground',
  'muted',
  'mutedForeground',
  'card',
  'cardForeground',
  'destructive',
  'destructiveForeground',
  'border',
  'ring',
] as const
