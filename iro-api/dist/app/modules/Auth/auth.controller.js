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
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auditLog_utils_1 = require("../AuditLog/auditLog.utils");
const auth_constant_1 = require("./auth.constant");
const auth_service_1 = require("./auth.service");
const auth_utils_1 = require("./auth.utils");
const clientMeta = (req) => ({
    ip: req.ip,
    userAgent: req.get('user-agent'),
});
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken, user } = yield auth_service_1.AuthServices.loginUser(req.body, clientMeta(req));
    res.cookie(auth_constant_1.REFRESH_COOKIE, refreshToken, auth_utils_1.refreshCookieOptions);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'login',
        resource: 'auth',
        resourceId: user.id,
        actor: { id: user._id, role: user.role },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is logged in successfully!',
        data: { accessToken, user, needsPasswordChange: user.needsPasswordChange },
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tokens = yield auth_service_1.AuthServices.refreshToken((_a = req.cookies) === null || _a === void 0 ? void 0 : _a[auth_constant_1.REFRESH_COOKIE], clientMeta(req));
    res.cookie(auth_constant_1.REFRESH_COOKIE, tokens.refreshToken, auth_utils_1.refreshCookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token is retrieved successfully!',
        data: { accessToken: tokens.accessToken },
    });
}));
const logoutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield auth_service_1.AuthServices.logoutUser((_a = req.cookies) === null || _a === void 0 ? void 0 : _a[auth_constant_1.REFRESH_COOKIE]);
    res.clearCookie(auth_constant_1.REFRESH_COOKIE, Object.assign(Object.assign({}, auth_utils_1.refreshCookieOptions), { maxAge: undefined }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logged out successfully',
        data: null,
    });
}));
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.AuthServices.getMe(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is retrieved successfully',
        data: user,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.AuthServices.changePassword(req.user.userId, req.body);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'change-password',
        resource: 'auth',
        resourceId: user.id,
    });
    res.clearCookie(auth_constant_1.REFRESH_COOKIE, Object.assign(Object.assign({}, auth_utils_1.refreshCookieOptions), { maxAge: undefined }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password is updated successfully! Please log in again.',
        data: null,
    });
}));
exports.AuthControllers = {
    loginUser,
    refreshToken,
    logoutUser,
    getMe,
    changePassword,
};
