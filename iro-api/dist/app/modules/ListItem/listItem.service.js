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
exports.ListItemServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const revalidate_1 = require("../../helpers/revalidate");
const listItem_constant_1 = require("./listItem.constant");
const listItem_model_1 = require("./listItem.model");
const createListItemIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listItem_model_1.ListItem.create(payload);
    (0, revalidate_1.notifyFrontend)();
    return result;
});
const getAllListItemsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const qb = new QueryBuilder_1.default(listItem_model_1.ListItem.find(), query)
        .search(listItem_constant_1.ListItemSearchableFields)
        .filter(listItem_constant_1.ListItemFilterableFields)
        .sort()
        .paginate();
    const data = yield qb.modelQuery.lean();
    const meta = yield qb.countTotal();
    return { data, meta };
});
const getSingleListItemFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listItem_model_1.ListItem.findById(id).lean();
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Item not found');
    return result;
});
const updateListItemIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listItem_model_1.ListItem.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Item not found');
    (0, revalidate_1.notifyFrontend)();
    return result;
});
const deleteListItemFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listItem_model_1.ListItem.findByIdAndDelete(id);
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Item not found');
    (0, revalidate_1.notifyFrontend)();
    return result;
});
exports.ListItemServices = {
    createListItemIntoDB,
    getAllListItemsFromDB,
    getSingleListItemFromDB,
    updateListItemIntoDB,
    deleteListItemFromDB,
};
