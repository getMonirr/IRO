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
exports.JoinRequestServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const joinRequest_constant_1 = require("./joinRequest.constant");
const joinRequest_model_1 = require("./joinRequest.model");
const createJoinRequestIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () { return joinRequest_model_1.JoinRequest.create(payload); });
const getAllJoinRequestsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const qb = new QueryBuilder_1.default(joinRequest_model_1.JoinRequest.find(), query)
        .search(joinRequest_constant_1.JoinRequestSearchableFields)
        .filter(joinRequest_constant_1.JoinRequestFilterableFields)
        .sort('-createdAt')
        .paginate();
    const data = yield qb.modelQuery.lean();
    const meta = yield qb.countTotal();
    return { data, meta };
});
const updateJoinRequestIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joinRequest_model_1.JoinRequest.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Request not found');
    return result;
});
const deleteJoinRequestFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joinRequest_model_1.JoinRequest.findByIdAndDelete(id);
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Request not found');
    return result;
});
exports.JoinRequestServices = {
    createJoinRequestIntoDB,
    getAllJoinRequestsFromDB,
    updateJoinRequestIntoDB,
    deleteJoinRequestFromDB,
};
