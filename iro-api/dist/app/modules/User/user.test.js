"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_utils_1 = require("./user.utils");
describe('User role rules', () => {
    it('lets a higher role manage a lower role', () => {
        expect((0, user_utils_1.canManage)('superAdmin', 'admin')).toBe(true);
        expect((0, user_utils_1.canManage)('admin', 'editor')).toBe(true);
    });
    it('never lets a role manage an equal or higher role', () => {
        expect((0, user_utils_1.canManage)('admin', 'admin')).toBe(false);
        expect((0, user_utils_1.canManage)('editor', 'admin')).toBe(false);
        expect((0, user_utils_1.canManage)('member', 'superAdmin')).toBe(false);
    });
});
