"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const pino_http_1 = __importDefault(require("pino-http"));
const logger_1 = __importDefault(require("../utils/logger"));
/** One structured log line per request, with an x-request-id for tracing. */
const requestLogger = (0, pino_http_1.default)({
    logger: logger_1.default,
    genReqId: (req, res) => {
        const id = req.headers['x-request-id'] || (0, crypto_1.randomUUID)();
        res.setHeader('x-request-id', id);
        return id;
    },
    customLogLevel: (_req, res, err) => err || res.statusCode >= 500
        ? 'error'
        : res.statusCode >= 400
            ? 'warn'
            : 'info',
    autoLogging: { ignore: req => { var _a, _b; return (_b = (_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/health')) !== null && _b !== void 0 ? _b : false; } },
});
exports.default = requestLogger;
