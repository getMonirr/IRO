"use strict";
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
const config_1 = __importDefault(require("./app/config"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFoundAPIHandler_1 = __importDefault(require("./app/middlewares/notFoundAPIHandler"));
const rateLimit_1 = require("./app/middlewares/rateLimit");
const requestLogger_1 = __importDefault(require("./app/middlewares/requestLogger"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
app.disable('x-powered-by');
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
