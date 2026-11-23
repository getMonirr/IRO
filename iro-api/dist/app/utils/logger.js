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
    // production: JSON to stdout (Docker / log collectors) · development: pretty
    transport: config_1.default.NODE_ENV === 'production'
        ? undefined
        : {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:HH:MM:ss' },
        },
});
exports.default = logger;
