"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importStar(require("./app/config"));
const DB_1 = __importStar(require("./app/DB"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFoundAPIHandler_1 = __importDefault(require("./app/middlewares/notFoundAPIHandler"));
const rateLimit_1 = require("./app/middlewares/rateLimit");
const requestLogger_1 = __importDefault(require("./app/middlewares/requestLogger"));
const routes_1 = __importDefault(require("./app/routes"));
const logger_1 = __importDefault(require("./app/utils/logger"));
const app = (0, express_1.default)();
app.disable('x-powered-by');
let serverlessConnectionPromise;
let serverlessSeedPromise;
if (process.env.VERCEL === '1') {
    app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, config_1.assertConfig)();
            if (mongoose_1.default.connection.readyState !== 1) {
                if (!serverlessConnectionPromise) {
                    serverlessConnectionPromise = mongoose_1.default
                        .connect(config_1.default.database_url, {
                        serverSelectionTimeoutMS: 5000,
                    })
                        .then(() => {
                        logger_1.default.info('MongoDB connected');
                    })
                        .catch(err => {
                        serverlessConnectionPromise = undefined;
                        throw err;
                    });
                }
                yield serverlessConnectionPromise;
            }
            if (!serverlessSeedPromise) {
                serverlessSeedPromise = (() => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, DB_1.default)();
                    yield (0, DB_1.seedContent)();
                }))().catch(err => {
                    serverlessSeedPromise = undefined;
                    throw err;
                });
            }
            yield serverlessSeedPromise;
            next();
        }
        catch (err) {
            logger_1.default.fatal({ err }, 'failed to initialize serverless database');
            res.status(500).json({ message: 'Database initialization failed' });
        }
    }));
}
// correct client IP behind a reverse proxy (needed for rate limits and audit logs)
if (config_1.default.NODE_ENV === 'production')
    app.set('trust proxy', 1);
app.use(requestLogger_1.default);
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
//parsers
app.use(express_1.default.json({ limit: '100kb' }));
app.use((0, cookie_parser_1.default)());
/** credentials: true is required for the refresh-token cookie */
app.use((0, cors_1.default)({ origin: config_1.default.cors_origins, credentials: true }));
// welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the IRO API Server');
});
// health checks (liveness / readiness) for load balancers and Docker
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
app.get('/health/ready', (req, res) => {
    const ready = mongoose_1.default.connection.readyState === 1;
    res
        .status(ready ? 200 : 503)
        .json({ status: ready ? 'ready' : 'unavailable' });
});
app.use(rateLimit_1.globalLimiter);
// application routes
app.use('/api/v1', routes_1.default);
// global error handler
app.use(globalErrorHandler_1.default);
//Not Found API Route Handler
app.use(notFoundAPIHandler_1.default);
exports.default = app;
