"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const rateLimit_1 = require("../../middlewares/rateLimit");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const constant_1 = require("../../shared/constant");
const joinRequest_controller_1 = require("./joinRequest.controller");
const joinRequest_validation_1 = require("./joinRequest.validation");
const router = express_1.default.Router();
router
    .route('/')
    // public
    .post(rateLimit_1.joinLimiter, (0, validateRequest_1.default)(joinRequest_validation_1.JoinRequestValidation.createJoinRequestValidationSchema), joinRequest_controller_1.JoinRequestControllers.createJoinRequest)
    // dashboard
    .get((0, authGuard_1.default)(...constant_1.ACCESS.JOIN_READ), joinRequest_controller_1.JoinRequestControllers.getAllJoinRequests);
router
    .route('/:id')
    .patch((0, authGuard_1.default)(...constant_1.ACCESS.JOIN_WRITE), (0, validateRequest_1.default)(joinRequest_validation_1.JoinRequestValidation.updateJoinRequestValidationSchema), joinRequest_controller_1.JoinRequestControllers.updateJoinRequest)
    .delete((0, authGuard_1.default)(...constant_1.ACCESS.JOIN_DELETE), joinRequest_controller_1.JoinRequestControllers.deleteJoinRequest);
exports.JoinRequestRoutes = router;
