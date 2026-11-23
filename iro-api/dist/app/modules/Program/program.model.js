"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const mongoose_1 = require("mongoose");
const bilingual_1 = require("../../shared/bilingual");
const program_constant_1 = require("./program.constant");
const programSchema = new mongoose_1.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[a-z0-9-]{2,50}$/,
    },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    status: { type: String, enum: program_constant_1.PROGRAM_STATUS, default: 'ongoing' },
    published: { type: Boolean, default: true, index: true },
    title: (0, bilingual_1.bi)(),
    short: (0, bilingual_1.bi)(),
    body: (0, bilingual_1.bi)(),
    tagline: (0, bilingual_1.bi)(),
    points: { type: [bilingual_1.biSchema], default: [] },
    figures: {
        type: [new mongoose_1.Schema({ value: (0, bilingual_1.bi)(), label: (0, bilingual_1.bi)() }, { _id: false })],
        default: [],
    },
    ayah: { arabic: { type: String, default: '' }, text: (0, bilingual_1.bi)(), source: (0, bilingual_1.bi)() },
}, { timestamps: true });
exports.Program = (0, mongoose_1.model)('Program', programSchema);
