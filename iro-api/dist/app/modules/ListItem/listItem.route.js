"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const constant_1 = require("../../shared/constant");
const listItem_controller_1 = require("./listItem.controller");
const listItem_validation_1 = require("./listItem.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_READ), listItem_controller_1.ListItemControllers.getAllListItems)
    .post((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_WRITE), (0, validateRequest_1.default)(listItem_validation_1.ListItemValidation.createListItemValidationSchema), listItem_controller_1.ListItemControllers.createListItem);
router
    .route('/:id')
    .get((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_READ), listItem_controller_1.ListItemControllers.getSingleListItem)
    .patch((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_WRITE), (0, validateRequest_1.default)(listItem_validation_1.ListItemValidation.updateListItemValidationSchema), listItem_controller_1.ListItemControllers.updateListItem)
    .delete((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_DELETE), listItem_controller_1.ListItemControllers.deleteListItem);
exports.ListItemRoutes = router;
