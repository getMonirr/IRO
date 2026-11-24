import { THEME_TOKEN_KEYS } from './setting.constant'
import { SettingValidation } from './setting.validation'

const update = SettingValidation.updateSettingValidationSchema
const theme = Object.fromEntries(THEME_TOKEN_KEYS.map(key => [key, '#112233']))

describe('Setting validation', () => {
  it('accepts existing bilingual content settings', () => {
    const result = update.parse({
      params: { key: 'site' },
      body: { bn: { name: 'IRO' }, en: { name: 'IRO' } },
    })
    expect(result.body).toEqual({
      bn: { name: 'IRO' },
      en: { name: 'IRO' },
    })
  })

  it('accepts a complete theme with hex colors', () => {
    const result = update.parse({
      params: { key: 'theme' },
      body: { value: theme },
    })
    expect(result.body).toEqual({ value: theme })
  })

  it('rejects invalid colors and incomplete themes', () => {
    expect(() =>
      update.parse({
        params: { key: 'theme' },
        body: { value: { ...theme, primary: 'url(javascript:alert(1))' } },
      }),
    ).toThrow()
    expect(() =>
      update.parse({
        params: { key: 'theme' },
        body: { value: { primary: '#112233' } },
      }),
    ).toThrow()
  })

  it('rejects a valid body paired with the wrong setting key', () => {
    expect(() =>
      update.parse({ params: { key: 'theme' }, body: { bn: {}, en: {} } }),
    ).toThrow()
    expect(() =>
      update.parse({ params: { key: 'site' }, body: { value: theme } }),
    ).toThrow()
  })
})
