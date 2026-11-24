"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const bilingual_1 = require("../../shared/bilingual");
const post_constant_1 = require("./post.constant");
const postSchema = new mongoose_1.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[a-z0-9-]{2,80}$/,
    },
    type: { type: String, enum: post_constant_1.POST_TYPES, required: true, index: true },
    icon: { type: String, default: '' },
    coverImage: { type: String, required: true, trim: true },
    category: (0, bilingual_1.bi)(),
    title: (0, bilingual_1.bi)(),
    excerpt: (0, bilingual_1.bi)(),
    body: (0, bilingual_1.bi)(),
    author: (0, bilingual_1.bi)(),
    published: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    viewCount: { type: Number, default: 0, min: 0, index: true },
}, { timestamps: true });
exports.Post = (0, mongoose_1.model)('Post', postSchema);
