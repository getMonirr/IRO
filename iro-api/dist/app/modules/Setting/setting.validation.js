"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingValidation = void 0;
const zod_1 = require("zod");
const setting_constant_1 = require("./setting.constant");
const objectOrArray = zod_1.z
    .any()
    .refine(v => v !== null && typeof v === 'object', 'must be an object or array');
const updateSettingValidationSchema = zod_1.z.object({
    params: zod_1.z.object({ key: zod_1.z.enum(setting_constant_1.SETTING_KEYS) }),
    body: zod_1.z.object({ bn: objectOrArray, en: objectOrArray }),
});
exports.SettingValidation = { updateSettingValidationSchema };
