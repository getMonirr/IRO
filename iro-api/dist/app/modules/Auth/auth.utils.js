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
exports.revokeAllTokens = exports.issueTokens = exports.refreshCookieOptions = void 0;
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const auth_model_1 = require("./auth.model");
exports.refreshCookieOptions = {
    httpOnly: true,
    secure: config_1.default.NODE_ENV === 'production' || config_1.default.cookie_samesite === 'none',
    sameSite: config_1.default.cookie_samesite,
    path: '/api/v1/auth',
    maxAge: (0, jwtHelpers_1.toMs)(config_1.default.jwt_refresh_expires_in),
};
/** Issues an access token + a refresh token (its jti is stored so it can be rotated / revoked). */
const issueTokens = (user, meta) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const jti = (0, crypto_1.randomUUID)();
    const refreshToken = (0, jwtHelpers_1.createToken)({ userId: user.id, jti }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    const { exp } = jsonwebtoken_1.default.decode(refreshToken);
    yield auth_model_1.RefreshToken.create({
        user: user._id,
        jti,
        expiresAt: new Date(exp * 1000),
        ip: meta.ip,
        userAgent: (_a = meta.userAgent) === null || _a === void 0 ? void 0 : _a.slice(0, 200),
    });
    const accessToken = (0, jwtHelpers_1.createToken)({ userId: user.id, role: user.role }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken, refreshToken };
});
exports.issueTokens = issueTokens;
const revokeAllTokens = (userObjectId) => auth_model_1.RefreshToken.updateMany({ user: userObjectId, revokedAt: { $exists: false } }, { revokedAt: new Date() });
exports.revokeAllTokens = revokeAllTokens;
