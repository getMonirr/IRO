"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicValidation = void 0;
const zod_1 = require("zod");
const constant_1 = require("../../shared/constant");
const getContentValidationSchema = zod_1.z.object({
    query: zod_1.z.object({ lang: zod_1.z.enum(constant_1.LANGS).default('bn') }),
});
exports.PublicValidation = { getContentValidationSchema };
