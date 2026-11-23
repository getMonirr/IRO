"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramValidation = void 0;
const zod_1 = require("zod");
const bilingual_1 = require("../../shared/bilingual");
const program_constant_1 = require("./program.constant");
const programBody = zod_1.z.object({
    slug: zod_1.z
        .string()
        .regex(/^[a-z0-9-]{2,50}$/, 'lowercase letters, digits and hyphens only'),
    icon: zod_1.z.string().max(10).default(''),
    order: zod_1.z.number().int().default(0),
    status: zod_1.z.enum(program_constant_1.PROGRAM_STATUS).default('ongoing'),
    published: zod_1.z.boolean().default(true),
    title: (0, bilingual_1.biReqZod)(200),
    short: (0, bilingual_1.biReqZod)(500),
    body: (0, bilingual_1.biZod)(),
    tagline: (0, bilingual_1.biZod)(300),
    points: zod_1.z.array((0, bilingual_1.biZod)(500)).max(20).default([]),
    figures: zod_1.z
        .array(zod_1.z.object({ value: (0, bilingual_1.biZod)(30), label: (0, bilingual_1.biZod)(100) }))
        .max(8)
        .default([]),
    ayah: zod_1.z
        .object({
        arabic: zod_1.z.string().max(2000).default(''),
        text: (0, bilingual_1.biZod)(1000),
        source: (0, bilingual_1.biZod)(200),
    })
        .default({}),
});
const createProgramValidationSchema = zod_1.z.object({ body: programBody });
const updateProgramValidationSchema = zod_1.z.object({ body: programBody.partial() });
exports.ProgramValidation = {
    createProgramValidationSchema,
    updateProgramValidationSchema,
};
