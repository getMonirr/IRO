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
exports.AuditLogServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const auditLog_constant_1 = require("./auditLog.constant");
const auditLog_model_1 = require("./auditLog.model");
const getAllAuditLogsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const qb = new QueryBuilder_1.default(auditLog_model_1.AuditLog.find().populate('actor', 'name email'), query)
        .filter(auditLog_constant_1.AuditFilterableFields)
        .sort('-createdAt')
        .paginate();
    const data = yield qb.modelQuery.lean();
    const meta = yield qb.countTotal();
    return { data, meta };
});
exports.AuditLogServices = { getAllAuditLogsFromDB };
