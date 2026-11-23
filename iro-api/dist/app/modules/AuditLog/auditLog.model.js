"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = require("mongoose");
const auditLogSchema = new mongoose_1.Schema({
    actor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    actorRole: { type: String },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String },
    ip: { type: String },
    meta: { type: mongoose_1.Schema.Types.Mixed },
    // automatically deleted after one year
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expireAfterSeconds: 60 * 60 * 24 * 365 },
    },
}, { versionKey: false });
exports.AuditLog = (0, mongoose_1.model)('AuditLog', auditLogSchema);
