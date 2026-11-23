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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingServices = void 0;
const revalidate_1 = require("../../helpers/revalidate");
const setting_model_1 = require("./setting.model");
const getAllSettingsFromDB = () => __awaiter(void 0, void 0, void 0, function* () { return setting_model_1.Setting.find().lean(); });
const upsertSettingIntoDB = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield setting_model_1.Setting.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    (0, revalidate_1.notifyFrontend)();
    return result;
});
exports.SettingServices = { getAllSettingsFromDB, upsertSettingIntoDB };
