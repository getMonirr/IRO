"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemFilterableFields = exports.ListItemSearchableFields = exports.ITEM_GROUPS = void 0;
/**
 * stat -> value + title(label) + text(note)
 * principle / joinWay -> icon + title + text
 * roadmap -> title + text
 * goal / department -> title
 */
exports.ITEM_GROUPS = [
    'stat',
    'principle',
    'goal',
    'department',
    'roadmap',
    'joinWay',
];
exports.ListItemSearchableFields = ['title.bn', 'title.en'];
exports.ListItemFilterableFields = ['group', 'published'];
