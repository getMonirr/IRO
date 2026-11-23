"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFilterableFields = exports.UserSearchableFields = exports.UserStatus = exports.USER_ROLE = void 0;
var constant_1 = require("../../shared/constant");
Object.defineProperty(exports, "USER_ROLE", { enumerable: true, get: function () { return constant_1.USER_ROLE; } });
Object.defineProperty(exports, "UserStatus", { enumerable: true, get: function () { return constant_1.UserStatus; } });
exports.UserSearchableFields = ['name', 'email', 'id'];
exports.UserFilterableFields = ['role', 'status'];
