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
exports.PostServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const revalidate_1 = require("../../helpers/revalidate");
const post_constant_1 = require("./post.constant");
const post_model_1 = require("./post.model");
const createPostIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.create(payload);
    (0, revalidate_1.notifyFrontend)();
    return result;
});
const getAllPostsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const qb = new QueryBuilder_1.default(post_model_1.Post.find(), query)
        .search(post_constant_1.PostSearchableFields)
        .filter(post_constant_1.PostFilterableFields)
        .sort()
        .paginate();
    const data = yield qb.modelQuery.lean();
    const meta = yield qb.countTotal();
    return { data, meta };
});
const getPostOptionsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_model_1.Post.find({}, { category: 1, author: 1 }).lean();
    const unique = (field) => ({
        bn: Array.from(new Set(posts.map(post => { var _a; return (_a = post[field]) === null || _a === void 0 ? void 0 : _a.bn; }).filter(Boolean))).sort(),
        en: Array.from(new Set(posts.map(post => { var _a; return (_a = post[field]) === null || _a === void 0 ? void 0 : _a.en; }).filter(Boolean))).sort(),
    });
    return { categories: unique('category'), authors: unique('author') };
});
const getSinglePostFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findById(id).lean();
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    return result;
});
const updatePostIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndUpdate(id, { $set: payload }, {
        new: true,
        runValidators: true,
    });
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    (0, revalidate_1.notifyFrontend)();
    return result;
});
const incrementPostViewBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findOneAndUpdate({ slug, published: true }, { $inc: { viewCount: 1 } }, { new: true }).lean();
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    return result;
});
const deletePostFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndDelete(id);
    if (!result)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    (0, revalidate_1.notifyFrontend)();
    return result;
});
exports.PostServices = {
    createPostIntoDB,
    getAllPostsFromDB,
    getSinglePostFromDB,
    updatePostIntoDB,
    deletePostFromDB,
    getPostOptionsFromDB,
    incrementPostViewBySlug,
};
