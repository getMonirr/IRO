"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const constant_1 = require("../../shared/constant");
const setting_controller_1 = require("./setting.controller");
const setting_validation_1 = require("./setting.validation");
const router = express_1.default.Router();
router.get('/', (0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_READ), setting_controller_1.SettingControllers.getAllSettings);
router.put('/:key', (0, authGuard_1.default)(...constant_1.ACCESS.SETTINGS_WRITE), (0, validateRequest_1.default)(setting_validation_1.SettingValidation.updateSettingValidationSchema), setting_controller_1.SettingControllers.updateSetting);
exports.SettingRoutes = router;
