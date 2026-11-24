"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const mongoose_1 = require("mongoose");
const setting_constant_1 = require("./setting.constant");
const settingSchema = new mongoose_1.Schema({
    key: { type: String, enum: setting_constant_1.SETTING_KEYS, required: true, unique: true },
    value: { type: mongoose_1.Schema.Types.Mixed, default: {} },
}, { timestamps: true, minimize: false });
exports.Setting = (0, mongoose_1.model)('Setting', settingSchema);
