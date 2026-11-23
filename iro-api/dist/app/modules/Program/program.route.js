"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const constant_1 = require("../../shared/constant");
const program_controller_1 = require("./program.controller");
const program_validation_1 = require("./program.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_READ), program_controller_1.ProgramControllers.getAllPrograms)
    .post((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_WRITE), (0, validateRequest_1.default)(program_validation_1.ProgramValidation.createProgramValidationSchema), program_controller_1.ProgramControllers.createProgram);
router
    .route('/:id')
    .get((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_READ), program_controller_1.ProgramControllers.getSingleProgram)
    .patch((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_WRITE), (0, validateRequest_1.default)(program_validation_1.ProgramValidation.updateProgramValidationSchema), program_controller_1.ProgramControllers.updateProgram)
    .delete((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_DELETE), program_controller_1.ProgramControllers.deleteProgram);
exports.ProgramRoutes = router;
