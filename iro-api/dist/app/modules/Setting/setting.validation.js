"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingValidation = void 0;
const zod_1 = require("zod");
const setting_constant_1 = require("./setting.constant");
const objectOrArray = zod_1.z
    .any()
    .refine(v => v !== null && typeof v === 'object', 'must be an object or array');
const themeSchema = zod_1.z.object(Object.fromEntries(setting_constant_1.THEME_TOKEN_KEYS.map(key => [key, zod_1.z.string().regex(/^#[\da-fA-F]{6}$/)])));
const updateSettingValidationSchema = zod_1.z
    .object({
    params: zod_1.z.object({ key: zod_1.z.enum(setting_constant_1.SETTING_KEYS) }),
    body: zod_1.z.union([
        zod_1.z.object({ bn: objectOrArray, en: objectOrArray }),
        zod_1.z.object({ value: themeSchema }),
    ]),
})
    .superRefine(({ params, body }, ctx) => {
    const isThemeUpdate = 'value' in body;
    if ((params.key === 'theme') !== isThemeUpdate) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: 'Invalid setting value' });
    }
});
exports.SettingValidation = { updateSettingValidationSchema };
