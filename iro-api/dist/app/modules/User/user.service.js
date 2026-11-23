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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_utils_1 = require("../Auth/auth.utils");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const createUserIntoDB = (payload, actor) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, user_utils_1.canManage)(actor.role, payload.role)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You can only create users with a lower role than your own');
    }
    const id = yield (0, user_utils_1.generateUserId)();
    return user_model_1.User.create(Object.assign(Object.assign({}, payload), { id, needsPasswordChange: true }));
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const qb = new QueryBuilder_1.default(user_model_1.User.find({ isDeleted: false }), query)
        .search(user_constant_1.UserSearchableFields)
        .filter(user_constant_1.UserFilterableFields)
        .sort('-createdAt')
        .paginate();
    const data = yield qb.modelQuery;
    const meta = yield qb.countTotal();
    return { data, meta };
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ _id: id, isDeleted: false });
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    return user;
});
const updateUserIntoDB = (id, payload, actor) => __awaiter(void 0, void 0, void 0, function* () {
    const target = yield getSingleUserFromDB(id);
    const self = target.id === actor.userId;
    if (!self && !(0, user_utils_1.canManage)(actor.role, target.role)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You cannot manage a user with an equal or higher role');
    }
    if (self && (payload.role !== undefined || payload.status !== undefined)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You cannot change your own role or status');
    }
    if (payload.role && !(0, user_utils_1.canManage)(actor.role, payload.role)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You can only assign roles lower than your own');
    }
    const { password } = payload, rest = __rest(payload, ["password"]);
    Object.assign(target, rest);
    if (password) {
        target.password = password; // hashed by the pre-save hook
        target.passwordChangedAt = new Date();
        target.needsPasswordChange = true;
    }
    yield target.save();
    // role change, block or password reset ends all existing sessions
    if (password || payload.role || payload.status === 'blocked') {
        yield (0, auth_utils_1.revokeAllTokens)(target._id);
    }
    return target;
});
const deleteUserFromDB = (id, actor) => __awaiter(void 0, void 0, void 0, function* () {
    const target = yield getSingleUserFromDB(id);
    if (target.id === actor.userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You cannot delete yourself');
    }
    if (!(0, user_utils_1.canManage)(actor.role, target.role)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You cannot delete a user with an equal or higher role');
    }
    target.isDeleted = true; // soft delete
    yield target.save();
    yield (0, auth_utils_1.revokeAllTokens)(target._id);
    return target;
});
exports.UserServices = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
};
