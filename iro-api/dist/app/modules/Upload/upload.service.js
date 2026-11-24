"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const config_1 = __importDefault(require("../../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
const uploadImageToCloudinary = (buffer, folder = 'iro/uploads') => new Promise((resolve, reject) => {
    const stream = cloudinary_1.v2.uploader.upload_stream({
        folder,
        resource_type: 'image',
        transformation: [
            {
                width: 1600,
                height: 1600,
                crop: 'limit',
                quality: 'auto',
                fetch_format: 'auto',
            },
        ],
    }, (error, result) => {
        if (error || !result)
            return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
    });
    stream_1.Readable.from(buffer).pipe(stream);
});
exports.uploadImageToCloudinary = uploadImageToCloudinary;
