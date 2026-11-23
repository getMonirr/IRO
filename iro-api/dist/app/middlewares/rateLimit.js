"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinLimiter = exports.loginLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const base = { standardHeaders: 'draft-7', legacyHeaders: false };
const body = (errorMessage) => ({
    success: false,
    message: 'Too Many Requests',
    errorMessage,
});
exports.globalLimiter = (0, express_rate_limit_1.default)(Object.assign(Object.assign({}, base), { windowMs: 15 * 60 * 1000, limit: 300, message: body('Too many requests, please slow down') }));
exports.loginLimiter = (0, express_rate_limit_1.default)(Object.assign(Object.assign({}, base), { windowMs: 15 * 60 * 1000, limit: 10, skipSuccessfulRequests: true, message: body('Too many login attempts, please try again later') }));
exports.joinLimiter = (0, express_rate_limit_1.default)(Object.assign(Object.assign({}, base), { windowMs: 60 * 60 * 1000, limit: 5, message: body('Too many submissions, please try again later') }));
