"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const constant_1 = require("../../shared/constant");
const post_controller_1 = require("./post.controller");
const post_validation_1 = require("./post.validation");
const router = express_1.default.Router();
router.get('/options', (0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_READ), post_controller_1.PostControllers.getPostOptions);
router
    .route('/')
    .get((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_READ), post_controller_1.PostControllers.getAllPosts)
    .post((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_WRITE), (0, validateRequest_1.default)(post_validation_1.PostValidation.createPostValidationSchema), post_controller_1.PostControllers.createPost);
router
    .route('/:id')
    .get((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_READ), post_controller_1.PostControllers.getSinglePost)
    .patch((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_WRITE), (0, validateRequest_1.default)(post_validation_1.PostValidation.updatePostValidationSchema), post_controller_1.PostControllers.updatePost)
    .delete((0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_DELETE), post_controller_1.PostControllers.deletePost);
exports.PostRoutes = router;
