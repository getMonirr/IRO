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
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const user_model_1 = require("../User/user.model");
const auth_constant_1 = require("./auth.constant");
const auth_model_1 = require("./auth.model");
const auth_utils_1 = require("./auth.utils");
let dummyHash;
// compared when the email is unknown so response time doesn't reveal which emails exist
const getDummyHash = () => __awaiter(void 0, void 0, void 0, function* () {
    return (dummyHash !== null && dummyHash !== void 0 ? dummyHash : (dummyHash = yield bcrypt_1.default.hash('timing-equalizer', Number(config_1.default.bcrypt_salt_rounds))));
});
const loginUser = (payload, meta) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findOne({
        email: payload.email.toLowerCase(),
        isDeleted: false,
    }).select('+password');
    if ((user === null || user === void 0 ? void 0 : user.lockUntil) && user.lockUntil > new Date()) {
        throw new AppError_1.default(http_status_1.default.LOCKED, 'Account temporarily locked. Please try again later.');
    }
    const matched = yield user_model_1.User.isPasswordMatched(payload.password, (_a = user === null || user === void 0 ? void 0 : user.password) !== null && _a !== void 0 ? _a : (yield getDummyHash()));
    if (!user || user.status === 'blocked' || !matched) {
        if (user) {
            user.failedLogins += 1;
            if (user.failedLogins >= auth_constant_1.MAX_FAILED_LOGINS) {
                user.lockUntil = new Date(Date.now() + auth_constant_1.LOCK_MINUTES * 60 * 1000);
                user.failedLogins = 0;
            }
            yield user.save();
        }
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    user.failedLogins = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();
    yield user.save();
    const tokens = yield (0, auth_utils_1.issueTokens)(user, meta);
    return Object.assign(Object.assign({}, tokens), { user });
});
/** Rotates the refresh token. Reusing an already-rotated token revokes every session of that user. */
const refreshToken = (token, meta) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'No refresh token');
    let decoded;
    try {
        decoded = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    }
    catch (_a) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired refresh token');
    }
    const record = yield auth_model_1.RefreshToken.findOne({ jti: decoded.jti });
    if (!record) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid refresh token');
    }
    if (record.revokedAt) {
        yield (0, auth_utils_1.revokeAllTokens)(record.user);
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Session revoked, please log in again');
    }
    const user = yield user_model_1.User.findById(record.user);
    if (!user || user.isDeleted || user.status === 'blocked') {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
    }
    if (user.passwordChangedAt &&
        user_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, decoded.iat)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
    }
    record.revokedAt = new Date();
    yield record.save();
    return (0, auth_utils_1.issueTokens)(user, meta);
});
const logoutUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        return;
    try {
        const decoded = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
        yield auth_model_1.RefreshToken.updateOne({ jti: decoded.jti, revokedAt: { $exists: false } }, { revokedAt: new Date() });
    }
    catch (_a) {
        // an invalid / expired token is already useless
    }
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ id: userId, isDeleted: false });
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    return user;
});
const changePassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ id: userId, isDeleted: false }).select('+password');
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    if (!(yield user_model_1.User.isPasswordMatched(payload.currentPassword, user.password))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Current password is incorrect');
    }
    user.password = payload.newPassword; // hashed by the pre-save hook
    user.needsPasswordChange = false;
    user.passwordChangedAt = new Date();
    yield user.save();
    yield (0, auth_utils_1.revokeAllTokens)(user._id);
    return user;
});
exports.AuthServices = {
    loginUser,
    refreshToken,
    logoutUser,
    getMe,
    changePassword,
};
