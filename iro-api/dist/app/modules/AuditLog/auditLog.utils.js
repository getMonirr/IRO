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
exports.recordAudit = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const auditLog_model_1 = require("./auditLog.model");
/** Admin action trail: stored in the database and written to the log. Never breaks the request. */
const recordAudit = (req, input) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const log = (_a = req.log) !== null && _a !== void 0 ? _a : logger_1.default;
    log.info({
        audit: {
            action: input.action,
            resource: input.resource,
            resourceId: input.resourceId,
        },
    }, 'audit');
    try {
        yield auditLog_model_1.AuditLog.create({
            actor: (_c = (_b = input.actor) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
            actorRole: (_f = (_e = input.actor) === null || _e === void 0 ? void 0 : _e.role) !== null && _f !== void 0 ? _f : (_g = req.user) === null || _g === void 0 ? void 0 : _g.role,
            action: input.action,
            resource: input.resource,
            resourceId: input.resourceId,
            ip: req.ip,
            meta: input.meta,
        });
    }
    catch (err) {
        log.error({ err }, 'audit log write failed');
    }
});
exports.recordAudit = recordAudit;
