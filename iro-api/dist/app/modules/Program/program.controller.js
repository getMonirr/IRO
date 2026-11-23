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
exports.ProgramControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auditLog_utils_1 = require("../AuditLog/auditLog.utils");
const program_service_1 = require("./program.service");
const createProgram = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield program_service_1.ProgramServices.createProgramIntoDB(req.body);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'create',
        resource: 'program',
        resourceId: String(result._id),
        meta: { slug: result.slug },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Program created successfully',
        data: result,
    });
}));
const getAllPrograms = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield program_service_1.ProgramServices.getAllProgramsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Programs retrieved successfully',
        meta,
        data,
    });
}));
const getSingleProgram = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield program_service_1.ProgramServices.getSingleProgramFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Program retrieved successfully',
        data: result,
    });
}));
const updateProgram = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield program_service_1.ProgramServices.updateProgramIntoDB(req.params.id, req.body);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'update',
        resource: 'program',
        resourceId: String(result._id),
        meta: { fields: Object.keys(req.body) },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Program updated successfully',
        data: result,
    });
}));
const deleteProgram = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield program_service_1.ProgramServices.deleteProgramFromDB(req.params.id);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'delete',
        resource: 'program',
        resourceId: String(result._id),
        meta: { slug: result.slug },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Program deleted successfully',
        data: null,
    });
}));
exports.ProgramControllers = {
    createProgram,
    getAllPrograms,
    getSingleProgram,
    updateProgram,
    deleteProgram,
};
