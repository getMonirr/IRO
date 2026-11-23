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
exports.ProgramServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const revalidate_1 = require("../../helpers/revalidate");
const program_constant_1 = require("./program.constant");
const program_model_1 = require("./program.model");
const createProgramIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield program_model_1.Program.create(payload);
    (0, revalidate_1.notifyFrontend)();
    return result;
});
const getAllProgramsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const qb = new QueryBuilder_1.default(program_model_1.Program.find(), query)
        .search(program_constant_1.ProgramSearchableFields)
        .filter(program_constant_1.ProgramFilterableFields)
        .sort()
        .paginate();
    const data = yield qb.modelQuery.lean();
    const meta = yield qb.countTotal();
    return { data, meta };
});
const getSingleProgramFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield program_model_1.Program.findById(id).lean();
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Program not found');
    return result;
});
const updateProgramIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield program_model_1.Program.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Program not found');
    (0, revalidate_1.notifyFrontend)();
    return result;
});
const deleteProgramFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield program_model_1.Program.findByIdAndDelete(id);
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Program not found');
    (0, revalidate_1.notifyFrontend)();
    return result;
});
exports.ProgramServices = {
    createProgramIntoDB,
    getAllProgramsFromDB,
    getSingleProgramFromDB,
    updateProgramIntoDB,
    deleteProgramFromDB,
};
