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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importStar(require("./app/config"));
const DB_1 = __importStar(require("./app/DB"));
const logger_1 = __importDefault(require("./app/utils/logger"));
let server;
let connectionPromise;
let seedPromise;
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, config_1.assertConfig)();
    if (mongoose_1.default.connection.readyState === 1)
        return;
    if (!connectionPromise) {
        connectionPromise = mongoose_1.default
            .connect(config_1.default.database_url, { serverSelectionTimeoutMS: 5000 })
            .then(() => {
            logger_1.default.info('MongoDB connected');
        })
            .catch(err => {
            connectionPromise = undefined;
            throw err;
        });
    }
    yield connectionPromise;
    if (!seedPromise) {
        seedPromise = (() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, DB_1.default)();
            yield (0, DB_1.seedContent)();
        }))().catch(err => {
            seedPromise = undefined;
            throw err;
        });
    }
    yield seedPromise;
});
if (process.env.VERCEL !== '1') {
    const main = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield initializeDatabase();
            server = app_1.default.listen(config_1.default.port, () => {
                logger_1.default.info(`app is listening on port ${config_1.default.port}`);
            });
        }
        catch (err) {
            logger_1.default.fatal({ err }, 'failed to start');
            process.exit(1);
        }
    });
    main();
    const shutdown = (signal) => {
        logger_1.default.info({ signal }, 'shutting down');
        if (!server)
            return process.exit(0);
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.disconnect();
            process.exit(0);
        }));
        setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', err => {
        logger_1.default.error({ err }, 'unhandledRejection is detected, shutting down ...');
        if (server)
            server.close(() => process.exit(1));
        else
            process.exit(1);
    });
    process.on('uncaughtException', err => {
        logger_1.default.error({ err }, 'uncaughtException is detected, shutting down ...');
        process.exit(1);
    });
}
exports.default = app_1.default;
