"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRequestValidation = void 0;
const zod_1 = require("zod");
const joinRequest_constant_1 = require("./joinRequest.constant");
const createJoinRequestValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(2).max(100),
        contact: zod_1.z.string().trim().min(3).max(150),
        type: zod_1.z.enum(joinRequest_constant_1.JOIN_TYPES),
        message: zod_1.z.string().trim().max(2000).default(''),
        lang: zod_1.z.enum(['bn', 'en']).default('bn'),
    }),
});
const updateJoinRequestValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(joinRequest_constant_1.JOIN_STATUS).optional(),
        note: zod_1.z.string().max(2000).optional(),
    }),
});
exports.JoinRequestValidation = {
    createJoinRequestValidationSchema,
    updateJoinRequestValidationSchema,
};
