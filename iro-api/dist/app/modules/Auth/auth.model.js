"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const mongoose_1 = require("mongoose");
const refreshTokenSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    jti: { type: String, required: true, unique: true },
    // MongoDB deletes the record itself once expired
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 },
    },
    revokedAt: { type: Date },
    ip: { type: String },
    userAgent: { type: String },
}, { timestamps: true });
exports.RefreshToken = (0, mongoose_1.model)('RefreshToken', refreshTokenSchema);
