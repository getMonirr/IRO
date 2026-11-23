"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const config_1 = __importDefault(require("../config"));
const logger = (0, pino_1.default)({
    level: config_1.default.log_level,
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers["set-cookie"]',
            '*.password',
            '*.currentPassword',
            '*.newPassword',
        ],
        censor: '[redacted]',
    },
    // JSON stdout is compatible with Vercel, Docker, and local log collectors.
});
exports.default = logger;
