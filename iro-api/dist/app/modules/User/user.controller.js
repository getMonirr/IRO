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
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auditLog_utils_1 = require("../AuditLog/auditLog.utils");
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUserIntoDB(req.body, req.user);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'create',
        resource: 'user',
        resourceId: user.id,
        meta: { email: user.email, role: user.role },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'User created successfully',
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield user_service_1.UserServices.getAllUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        meta,
        data,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.getSingleUserFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: user,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.updateUserIntoDB(req.params.id, req.body, req.user);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'update',
        resource: 'user',
        resourceId: user.id,
        meta: {
            fields: Object.keys(req.body).map(k => k === 'password' ? 'password(reset)' : k),
        },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User updated successfully',
        data: user,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.deleteUserFromDB(req.params.id, req.user);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'delete',
        resource: 'user',
        resourceId: user.id,
        meta: { email: user.email },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: null,
    });
}));
exports.UserControllers = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
