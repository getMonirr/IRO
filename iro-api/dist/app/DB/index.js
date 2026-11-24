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
exports.seedContent = void 0;
const config_1 = __importDefault(require("../config"));
const donation_model_1 = require("../modules/Donation/donation.model");
const listItem_model_1 = require("../modules/ListItem/listItem.model");
const post_model_1 = require("../modules/Post/post.model");
const program_model_1 = require("../modules/Program/program.model");
const setting_model_1 = require("../modules/Setting/setting.model");
const user_model_1 = require("../modules/User/user.model");
const constant_1 = require("../shared/constant");
const logger_1 = __importDefault(require("../utils/logger"));
const seed_data_json_1 = __importDefault(require("./seed-data.json"));
/** Creates the first super admin when none exists (credentials from .env). */
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    //when database is connected, we will check is there any user who is super admin
    const isSuperAdminExits = yield user_model_1.User.findOne({ role: constant_1.USER_ROLE.superAdmin });
    if (isSuperAdminExits)
        return;
    if (!config_1.default.super_admin_email || !config_1.default.super_admin_password) {
        logger_1.default.warn('No super admin yet: set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env');
        return;
    }
    yield user_model_1.User.create({
        id: '0001',
        name: config_1.default.super_admin_name,
        email: config_1.default.super_admin_email,
        password: config_1.default.super_admin_password,
        needsPasswordChange: true,
        role: constant_1.USER_ROLE.superAdmin,
        status: 'in-progress',
        isDeleted: false,
    });
    logger_1.default.info({ email: config_1.default.super_admin_email }, 'super admin created, please change the password after the first login');
});
/**
 * Loads the default Bangla + English website content.
 * Without `reset` it only fills collections that are empty, so it never overwrites or
 * re-adds anything an admin changed or deleted. `reset` replaces all content (users are untouched).
 */
const seedContent = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (reset = false) {
    if (reset) {
        yield Promise.all([
            program_model_1.Program.deleteMany({}),
            listItem_model_1.ListItem.deleteMany({}),
            setting_model_1.Setting.deleteMany({}),
            post_model_1.Post.deleteMany({}),
            donation_model_1.DonationMethod.deleteMany({}),
        ]);
        logger_1.default.warn('content collections cleared');
    }
    if (!(yield program_model_1.Program.exists({})))
        yield program_model_1.Program.insertMany(seed_data_json_1.default.programs);
    if (!(yield listItem_model_1.ListItem.exists({})))
        yield listItem_model_1.ListItem.insertMany(seed_data_json_1.default.items);
    if (!(yield setting_model_1.Setting.exists({})))
        yield setting_model_1.Setting.insertMany(seed_data_json_1.default.settings);
    if (!(yield post_model_1.Post.exists({})))
        yield post_model_1.Post.insertMany(seed_data_json_1.default.posts);
    if (!(yield donation_model_1.DonationMethod.exists({})) && seed_data_json_1.default.donationMethods)
        yield donation_model_1.DonationMethod.insertMany(seed_data_json_1.default.donationMethods);
});
exports.seedContent = seedContent;
exports.default = seedSuperAdmin;
