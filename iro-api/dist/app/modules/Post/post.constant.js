"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSearchableFields = exports.PostFilterableFields = exports.POST_TYPES = void 0;
exports.POST_TYPES = ['blog', 'news'];
exports.PostFilterableFields = ['type', 'published', 'featured'];
exports.PostSearchableFields = [
    'slug',
    'title.bn',
    'title.en',
    'category.bn',
    'category.en',
];
