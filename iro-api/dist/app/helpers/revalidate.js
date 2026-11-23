"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyFrontend = void 0;
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../utils/logger"));
/** Tell the public website to refresh its cache after content changes (fire-and-forget). */
const notifyFrontend = () => {
    if (!config_1.default.revalidate_url || !config_1.default.revalidate_secret)
        return;
    fetch(config_1.default.revalidate_url, {
        method: 'POST',
        headers: { 'x-revalidate-secret': config_1.default.revalidate_secret },
        signal: AbortSignal.timeout(3000),
    }).catch(err => logger_1.default.warn({ err: String(err) }, 'frontend revalidate failed'));
};
exports.notifyFrontend = notifyFrontend;
