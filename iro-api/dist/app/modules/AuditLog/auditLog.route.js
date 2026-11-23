"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const constant_1 = require("../../shared/constant");
const auditLog_controller_1 = require("./auditLog.controller");
const router = express_1.default.Router();
router.get('/', (0, authGuard_1.default)(...constant_1.ACCESS.AUDIT_READ), auditLog_controller_1.AuditLogControllers.getAllAuditLogs);
exports.AuditLogRoutes = router;
