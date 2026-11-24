"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const constant_1 = require("../../shared/constant");
const donation_controller_1 = require("./donation.controller");
const donation_validation_1 = require("./donation.validation");
const router = express_1.default.Router();
router
    .route('/methods')
    .get((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_READ), donation_controller_1.DonationControllers.list)
    .post((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_WRITE), (0, validateRequest_1.default)(donation_validation_1.DonationValidation.create), donation_controller_1.DonationControllers.create);
router
    .route('/methods/:id')
    .patch((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_WRITE), (0, validateRequest_1.default)(donation_validation_1.DonationValidation.update), donation_controller_1.DonationControllers.update)
    .delete((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_DELETE), donation_controller_1.DonationControllers.remove);
exports.DonationRoutes = router;
