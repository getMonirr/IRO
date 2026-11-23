"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const user_validation_1 = require("../User/user.validation");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }).email(),
        password: zod_1.z.string({ required_error: 'Password is required' }).max(200),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: 'Current password is required',
        }),
        newPassword: user_validation_1.strongPassword,
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
};
