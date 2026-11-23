"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = exports.strongPassword = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
exports.strongPassword = zod_1.z
    .string({ invalid_type_error: 'Password must be string' })
    .min(10, { message: 'Password must be at least 10 characters' })
    .max(72, { message: 'Password can not be more than 72 characters' })
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/\d/, 'Password must contain a digit');
const roles = Object.keys(user_constant_1.USER_ROLE);
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(2).max(100),
        email: zod_1.z.string().trim().email(),
        password: exports.strongPassword,
        role: zod_1.z.enum(roles).default('member'),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().trim().min(2).max(100),
        role: zod_1.z.enum(roles),
        status: zod_1.z.enum([...user_constant_1.UserStatus]),
        password: exports.strongPassword,
    })
        .partial(),
});
const changeStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([...user_constant_1.UserStatus]),
    }),
});
exports.UserValidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
    changeStatusValidationSchema,
};
