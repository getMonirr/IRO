import { canManage } from './user.utils'

describe('User role rules', () => {
  it('lets a higher role manage a lower role', () => {
    expect(canManage('superAdmin', 'admin')).toBe(true)
    expect(canManage('admin', 'editor')).toBe(true)
  })

  it('never lets a role manage an equal or higher role', () => {
    expect(canManage('admin', 'admin')).toBe(false)
    expect(canManage('editor', 'admin')).toBe(false)
    expect(canManage('member', 'superAdmin')).toBe(false)
  })
})
