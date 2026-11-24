"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const revalidate_1 = require("../../helpers/revalidate");
const donation_constant_1 = require("./donation.constant");
const donation_model_1 = require("./donation.model");
const createDonationMethod = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donation_model_1.DonationMethod.create(payload);
    (0, revalidate_1.notifyFrontend)();
    return result;
});
const getDonationMethods = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, publicOnly = false) {
    const base = publicOnly
        ? donation_model_1.DonationMethod.find({ enabled: true })
        : donation_model_1.DonationMethod.find();
    const qb = new QueryBuilder_1.default(base, query)
        .search(donation_constant_1.DonationSearchableFields)
        .filter(donation_constant_1.DonationFilterableFields)
        .sort()
        .paginate();
    const data = yield qb.modelQuery.sort({ order: 1 }).lean();
    const meta = yield qb.countTotal();
    return { data, meta };
});
const updateDonationMethod = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donation_model_1.DonationMethod.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Donation method not found');
    (0, revalidate_1.notifyFrontend)();
    return result;
});
const deleteDonationMethod = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donation_model_1.DonationMethod.findByIdAndDelete(id);
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Donation method not found');
    (0, revalidate_1.notifyFrontend)();
    return result;
});
exports.DonationServices = {
    createDonationMethod,
    getDonationMethods,
    updateDonationMethod,
    deleteDonationMethod,
};
