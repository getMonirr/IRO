"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRequest = void 0;
const mongoose_1 = require("mongoose");
const joinRequest_constant_1 = require("./joinRequest.constant");
const joinRequestSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    type: { type: String, enum: joinRequest_constant_1.JOIN_TYPES, required: true },
    message: { type: String, default: '', trim: true },
    lang: { type: String, enum: ['bn', 'en'], default: 'bn' },
    status: { type: String, enum: joinRequest_constant_1.JOIN_STATUS, default: 'new', index: true },
    note: { type: String, default: '' },
    ip: { type: String },
}, { timestamps: true });
exports.JoinRequest = (0, mongoose_1.model)('JoinRequest', joinRequestSchema);
