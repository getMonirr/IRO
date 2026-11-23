"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMs = exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, secret, expiresIn) => jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
exports.createToken = createToken;
const verifyToken = (token, secret) => jsonwebtoken_1.default.verify(token, secret);
exports.verifyToken = verifyToken;
/** '15m' | '7d' | '12h' | '30s' -> milliseconds */
const toMs = (value) => {
    const m = /^(\d+)\s*([smhd])$/.exec(value.trim());
    if (!m)
        return 7 * 24 * 60 * 60 * 1000;
    const n = Number(m[1]);
    return (n * { s: 1e3, m: 6e4, h: 36e5, d: 864e5 }[m[2]]);
};
exports.toMs = toMs;
