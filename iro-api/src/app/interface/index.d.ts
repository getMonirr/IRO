import { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      // set by authGuard: { userId, role, _id, iat, exp }
      user: JwtPayload
    }
  }
}
