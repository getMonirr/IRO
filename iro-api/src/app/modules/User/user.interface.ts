import { HydratedDocument, Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TUserRole = keyof typeof USER_ROLE

export interface TUser {
  id: string
  name: string
  email: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt?: Date
  role: TUserRole
  status: 'in-progress' | 'blocked'
  isDeleted: boolean
  failedLogins: number
  lockUntil?: Date
  lastLoginAt?: Date
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(id: string): Promise<HydratedDocument<TUser> | null>
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean
}
