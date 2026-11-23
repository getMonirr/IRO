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
exports.ListItemControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auditLog_utils_1 = require("../AuditLog/auditLog.utils");
const listItem_service_1 = require("./listItem.service");
const createListItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listItem_service_1.ListItemServices.createListItemIntoDB(req.body);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'create',
        resource: 'item',
        resourceId: String(result._id),
        meta: { group: result.group },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Item created successfully',
        data: result,
    });
}));
const getAllListItems = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield listItem_service_1.ListItemServices.getAllListItemsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Items retrieved successfully',
        meta,
        data,
    });
}));
const getSingleListItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listItem_service_1.ListItemServices.getSingleListItemFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Item retrieved successfully',
        data: result,
    });
}));
const updateListItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listItem_service_1.ListItemServices.updateListItemIntoDB(req.params.id, req.body);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'update',
        resource: 'item',
        resourceId: String(result._id),
        meta: { group: result.group, fields: Object.keys(req.body) },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Item updated successfully',
        data: result,
    });
}));
const deleteListItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listItem_service_1.ListItemServices.deleteListItemFromDB(req.params.id);
    yield (0, auditLog_utils_1.recordAudit)(req, {
        action: 'delete',
        resource: 'item',
        resourceId: String(result._id),
        meta: { group: result.group },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Item deleted successfully',
        data: null,
    });
}));
exports.ListItemControllers = {
    createListItem,
    getAllListItems,
    getSingleListItem,
    updateListItem,
    deleteListItem,
};
