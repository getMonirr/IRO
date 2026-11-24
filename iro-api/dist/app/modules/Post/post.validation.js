"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const zod_1 = require("zod");
const bilingual_1 = require("../../shared/bilingual");
const post_constant_1 = require("./post.constant");
const postBody = zod_1.z.object({
    slug: zod_1.z
        .string()
        .regex(/^[a-z0-9-]{2,80}$/, 'lowercase letters, digits and hyphens only'),
    type: zod_1.z.enum(post_constant_1.POST_TYPES),
    icon: zod_1.z.string().max(20).default(''),
    coverImage: zod_1.z
        .string()
        .url('coverImage must be a valid URL')
        .min(1, 'coverImage is required'),
    category: (0, bilingual_1.biZod)(100),
    title: (0, bilingual_1.biReqZod)(200),
    excerpt: (0, bilingual_1.biZod)(500),
    body: (0, bilingual_1.biReqZod)(50000).transform(value => ({
        bn: (0, sanitize_html_1.default)(value.bn, {
            allowedTags: [
                'p',
                'br',
                'strong',
                'b',
                'em',
                'i',
                'u',
                's',
                'h2',
                'h3',
                'h4',
                'ul',
                'ol',
                'li',
                'blockquote',
                'a',
                'span',
                'img',
            ],
            allowedAttributes: {
                a: ['href', 'target', 'rel'],
                span: ['style'],
                img: ['src', 'alt', 'width', 'height', 'style'],
            },
            allowedStyles: {
                span: { 'text-align': [/^left|center|right|justify$/] },
            },
        }),
        en: (0, sanitize_html_1.default)(value.en, {
            allowedTags: [
                'p',
                'br',
                'strong',
                'b',
                'em',
                'i',
                'u',
                's',
                'h2',
                'h3',
                'h4',
                'ul',
                'ol',
                'li',
                'blockquote',
                'a',
                'span',
                'img',
            ],
            allowedAttributes: {
                a: ['href', 'target', 'rel'],
                span: ['style'],
                img: ['src', 'alt', 'width', 'height', 'style'],
            },
            allowedStyles: {
                span: { 'text-align': [/^left|center|right|justify$/] },
            },
        }),
    })),
    author: (0, bilingual_1.biZod)(100),
    published: zod_1.z.boolean().default(true),
    featured: zod_1.z.boolean().default(false),
    publishedAt: zod_1.z.coerce.date().default(() => new Date()),
});
exports.PostValidation = {
    createPostValidationSchema: zod_1.z.object({ body: postBody }),
    updatePostValidationSchema: zod_1.z.object({ body: postBody.partial() }),
};
