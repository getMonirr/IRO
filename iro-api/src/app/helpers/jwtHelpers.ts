import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

export const createToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string,
) => jwt.sign(payload, secret, { expiresIn } as SignOptions)

export const verifyToken = (token: string, secret: string) =>
  jwt.verify(token, secret) as JwtPayload

/** '15m' | '7d' | '12h' | '30s' -> milliseconds */
export const toMs = (value: string) => {
  const m = /^(\d+)\s*([smhd])$/.exec(value.trim())
  if (!m) return 7 * 24 * 60 * 60 * 1000
  const n = Number(m[1])
  return (
    n * { s: 1e3, m: 6e4, h: 36e5, d: 864e5 }[m[2] as 's' | 'm' | 'h' | 'd']
  )
}
