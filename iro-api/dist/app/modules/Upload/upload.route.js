"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const authGuard_1 = __importDefault(require("../../middlewares/authGuard"));
const constant_1 = require("../../shared/constant");
const upload_controller_1 = require("./upload.controller");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/'))
            cb(null, true);
        else
            cb(new Error('Only image files are allowed'));
    },
});
const router = express_1.default.Router();
router.post('/image', (0, authGuard_1.default)(...constant_1.ACCESS.CONTENT_WRITE), upload.single('file'), upload_controller_1.UploadControllers.uploadImage);
exports.UploadRoutes = router;
