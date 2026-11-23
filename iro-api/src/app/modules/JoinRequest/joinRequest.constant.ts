export const JOIN_TYPES = ['volunteer', 'member', 'donor', 'partner'] as const
export const JOIN_STATUS = ['new', 'contacted', 'closed'] as const

export const JoinRequestSearchableFields = ['name', 'contact']
export const JoinRequestFilterableFields = ['status', 'type', 'lang']
