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
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const user_model_1 = require("../modules/User/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
/** authGuard(...roles): the request must carry a valid access token of one of the roles. */
const authGuard = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const header = req.headers.authorization;
        // checking if the token is missing (accepts "Bearer <token>" and raw "<token>")
        if (!header) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        const token = header.startsWith('Bearer ') ? header.slice(7) : header;
        // checking if the given token is valid
        const decoded = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt_access_secret);
        const { userId, iat } = decoded;
        // checking if the user is exist
        const user = yield user_model_1.User.isUserExistsByCustomId(userId);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'This user is not found !');
        }
        // checking if the user is already deleted
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
        }
        // checking if the user is blocked
        if (user.status === 'blocked') {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked !');
        }
        // token issued before the last password change is no longer valid
        if (user.passwordChangedAt &&
            user_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized !');
        }
        // the role is read from the database (not the token) so role changes apply immediately
        if (requiredRoles.length && !requiredRoles.includes(user.role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to do this');
        }
        req.user = Object.assign(Object.assign({}, decoded), { role: user.role, _id: user._id });
        next();
    }));
};
exports.default = authGuard;
