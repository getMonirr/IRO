"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationMethod = void 0;
const mongoose_1 = require("mongoose");
const bilingual_1 = require("../../shared/bilingual");
const donation_constant_1 = require("./donation.constant");
const donationMethodSchema = new mongoose_1.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    region: {
        type: String,
        enum: donation_constant_1.DONATION_REGIONS,
        required: true,
        index: true,
    },
    type: { type: String, enum: donation_constant_1.DONATION_TYPES, required: true },
    name: (0, bilingual_1.bi)(),
    provider: { type: String, default: '', trim: true },
    accountName: (0, bilingual_1.bi)(),
    accountNumber: { type: String, default: '', trim: true },
    instructions: (0, bilingual_1.bi)(),
    checkoutUrl: { type: String, default: '', trim: true },
    currency: { type: String, default: 'BDT', trim: true, uppercase: true },
    enabled: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
}, { timestamps: true });
exports.DonationMethod = (0, mongoose_1.model)('DonationMethod', donationMethodSchema);
