"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANGS = exports.ACCESS = exports.ROLE_RANK = exports.UserStatus = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    superAdmin: 'superAdmin',
    admin: 'admin',
    editor: 'editor',
    member: 'member',
};
exports.UserStatus = ['in-progress', 'blocked'];
/** higher number = more power. Nobody can manage a user of equal or higher rank. */
exports.ROLE_RANK = {
    superAdmin: 4,
    admin: 3,
    editor: 2,
    member: 1,
};
const { superAdmin, admin, editor, member } = exports.USER_ROLE;
/** Who can do what. Use with authGuard(...ACCESS.X) */
exports.ACCESS = {
    ANY: [superAdmin, admin, editor, member],
    CONTENT_READ: [superAdmin, admin, editor],
    CONTENT_WRITE: [superAdmin, admin, editor],
    CONTENT_DELETE: [superAdmin, admin],
    SETTINGS_WRITE: [superAdmin, admin],
    JOIN_READ: [superAdmin, admin, editor],
    JOIN_WRITE: [superAdmin, admin, editor],
    JOIN_DELETE: [superAdmin, admin],
    USER_MANAGE: [superAdmin, admin],
    AUDIT_READ: [superAdmin, admin],
};
exports.LANGS = ['bn', 'en'];
