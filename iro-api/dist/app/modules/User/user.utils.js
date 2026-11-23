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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = exports.canManage = void 0;
const constant_1 = require("../../shared/constant");
const user_model_1 = require("./user.model");
/** A user may only manage users whose role ranks strictly below their own. */
const canManage = (actorRole, targetRole) => constant_1.ROLE_RANK[actorRole] > constant_1.ROLE_RANK[targetRole];
exports.canManage = canManage;
/** Sequential id: 0001, 0002 ... (the unique index guards against a rare race) */
const generateUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const last = yield user_model_1.User.findOne({}, { id: 1 }).sort({ createdAt: -1 }).lean();
    const next = last ? Number(last.id) + 1 : 1;
    return String(Number.isFinite(next) ? next : 1).padStart(4, '0');
});
exports.generateUserId = generateUserId;
