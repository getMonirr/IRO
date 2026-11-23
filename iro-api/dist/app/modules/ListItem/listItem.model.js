"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItem = void 0;
const mongoose_1 = require("mongoose");
const bilingual_1 = require("../../shared/bilingual");
const listItem_constant_1 = require("./listItem.constant");
const listItemSchema = new mongoose_1.Schema({
    group: { type: String, enum: listItem_constant_1.ITEM_GROUPS, required: true, index: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    icon: { type: String, default: '' },
    value: (0, bilingual_1.bi)(),
    title: (0, bilingual_1.bi)(),
    text: (0, bilingual_1.bi)(),
}, { timestamps: true });
listItemSchema.index({ group: 1, order: 1 });
exports.ListItem = (0, mongoose_1.model)('ListItem', listItemSchema);
