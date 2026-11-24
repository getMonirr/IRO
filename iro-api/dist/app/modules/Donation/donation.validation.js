"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationValidation = void 0;
const zod_1 = require("zod");
const bilingual_1 = require("../../shared/bilingual");
const donation_constant_1 = require("./donation.constant");
const donationMethodBody = zod_1.z.object({
    slug: zod_1.z
        .string()
        .regex(/^[a-z0-9-]{2,60}$/, 'lowercase letters, digits and hyphens only'),
    region: zod_1.z.enum(donation_constant_1.DONATION_REGIONS),
    type: zod_1.z.enum(donation_constant_1.DONATION_TYPES),
    name: (0, bilingual_1.biReqZod)(120),
    provider: zod_1.z.string().trim().max(120).default(''),
    accountName: (0, bilingual_1.biZod)(120),
    accountNumber: zod_1.z.string().trim().max(160).default(''),
    instructions: (0, bilingual_1.biZod)(1000),
    checkoutUrl: zod_1.z.string().url().or(zod_1.z.literal('')).default(''),
    currency: zod_1.z.string().trim().min(3).max(8).default('BDT'),
    enabled: zod_1.z.boolean().default(true),
    order: zod_1.z.number().int().default(0),
});
exports.DonationValidation = {
    create: zod_1.z.object({ body: donationMethodBody }),
    update: zod_1.z.object({ body: donationMethodBody.partial() }),
};
