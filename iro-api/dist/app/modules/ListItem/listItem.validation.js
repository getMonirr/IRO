"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemValidation = void 0;
const zod_1 = require("zod");
const bilingual_1 = require("../../shared/bilingual");
const listItem_constant_1 = require("./listItem.constant");
const listItemBody = zod_1.z.object({
    group: zod_1.z.enum(listItem_constant_1.ITEM_GROUPS),
    order: zod_1.z.number().int().default(0),
    published: zod_1.z.boolean().default(true),
    icon: zod_1.z.string().max(10).default(''),
    value: (0, bilingual_1.biZod)(30),
    title: (0, bilingual_1.biReqZod)(300),
    text: (0, bilingual_1.biZod)(1000),
});
const createListItemValidationSchema = zod_1.z.object({ body: listItemBody });
const updateListItemValidationSchema = zod_1.z.object({
    body: listItemBody.partial(),
});
exports.ListItemValidation = {
    createListItemValidationSchema,
    updateListItemValidationSchema,
};
