"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationFilterableFields = exports.DonationSearchableFields = exports.DONATION_TYPES = exports.DONATION_REGIONS = void 0;
exports.DONATION_REGIONS = ['bangladesh', 'abroad'];
exports.DONATION_TYPES = [
    'mobile-banking',
    'bank-transfer',
    'card',
    'paypal',
    'crypto',
    'other',
];
exports.DonationSearchableFields = ['name.bn', 'name.en', 'provider'];
exports.DonationFilterableFields = ['region', 'type', 'enabled'];
