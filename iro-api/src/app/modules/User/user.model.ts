/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import config from '../../config'
import { USER_ROLE, UserStatus } from './user.constant'
import { TUser, UserModel } from './user.interface'

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      default: USER_ROLE.member,
    },
    status: { type: String, enum: UserStatus, default: 'in-progress' },
    isDeleted: { type: Boolean, default: false },
    failedLogins: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.password
        delete ret.failedLogins
        delete ret.lockUntil
        delete ret.__v
        return ret
      },
    },
  },
)

userSchema.pre('save', async function (next) {
  // hash only when the password is new or changed (never re-hash an existing hash)
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime = Math.floor(
    new Date(passwordChangedTimestamp).getTime() / 1000,
  )
  return passwordChangedTime > jwtIssuedTimestamp
}

export const User = model<TUser, UserModel>('User', userSchema)
