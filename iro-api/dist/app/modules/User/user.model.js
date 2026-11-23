"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
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
        enum: Object.keys(user_constant_1.USER_ROLE),
        default: user_constant_1.USER_ROLE.member,
    },
    status: { type: String, enum: user_constant_1.UserStatus, default: 'in-progress' },
    isDeleted: { type: Boolean, default: false },
    failedLogins: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            delete ret.password;
            delete ret.failedLogins;
            delete ret.lockUntil;
            delete ret.__v;
            return ret;
        },
    },
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // hash only when the password is new or changed (never re-hash an existing hash)
        if (!this.isModified('password'))
            return next();
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
userSchema.statics.isUserExistsByCustomId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ id }).select('+password');
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = Math.floor(new Date(passwordChangedTimestamp).getTime() / 1000);
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
