"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const constant_1 = require("../../shared/constant");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.use((0, authGuard_1.default)(...constant_1.ACCESS.USER_MANAGE));
router
    .route('/')
    .get(user_controller_1.UserControllers.getAllUsers)
    .post((0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidationSchema), user_controller_1.UserControllers.createUser);
router
    .route('/:id')
    .get(user_controller_1.UserControllers.getSingleUser)
    .patch((0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserValidationSchema), user_controller_1.UserControllers.updateUser)
    .delete(user_controller_1.UserControllers.deleteUser);
// export user routes
exports.UserRoutes = router;
