"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.biReqZod = exports.biZod = exports.pickLang = exports.bi = exports.biSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
// ---- mongoose
exports.biSchema = new mongoose_1.Schema({
    bn: { type: String, default: '', trim: true },
    en: { type: String, default: '', trim: true },
}, { _id: false });
const bi = () => ({ type: exports.biSchema, default: () => ({}) });
exports.bi = bi;
/** value in the chosen language, falling back to the other language when empty */
const pickLang = (b, lang) => (b === null || b === void 0 ? void 0 : b[lang]) || (b === null || b === void 0 ? void 0 : b.bn) || (b === null || b === void 0 ? void 0 : b.en) || '';
exports.pickLang = pickLang;
// ---- zod
const text = (max) => zod_1.z.string().trim().max(max);
const biZod = (max = 5000) => zod_1.z.object({ bn: text(max).default(''), en: text(max).default('') }).default({
    bn: '',
    en: '',
});
exports.biZod = biZod;
/** Bangla required, English optional (Bangla is shown when English is empty) */
const biReqZod = (max = 500) => zod_1.z.object({
    bn: text(max).min(1, 'Bangla text is required'),
    en: text(max).default(''),
});
exports.biReqZod = biReqZod;
