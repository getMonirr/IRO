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
exports.PublicServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bilingual_1 = require("../../shared/bilingual");
const donation_model_1 = require("../Donation/donation.model");
const listItem_model_1 = require("../ListItem/listItem.model");
const post_model_1 = require("../Post/post.model");
const program_model_1 = require("../Program/program.model");
const setting_model_1 = require("../Setting/setting.model");
/** Builds the whole public website content in the chosen language (same shape as the frontend's default dictionary). */
const getPublicContentFromDB = (lang) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const [programs, items, settings, posts, donationMethods] = yield Promise.all([
        program_model_1.Program.find({ published: true }).sort({ order: 1 }).lean(),
        listItem_model_1.ListItem.find({ published: true }).sort({ order: 1 }).lean(),
        setting_model_1.Setting.find().lean(),
        post_model_1.Post.find({ published: true })
            .sort({ featured: -1, publishedAt: -1 })
            .lean(),
        donation_model_1.DonationMethod.find({ enabled: true }).sort({ order: 1 }).lean(),
    ]);
    const group = (g) => items.filter(i => i.group === g);
    const card = (i) => ({
        icon: i.icon,
        title: (0, bilingual_1.pickLang)(i.title, lang),
        text: (0, bilingual_1.pickLang)(i.text, lang),
    });
    const out = {
        stats: group('stat').map(i => ({
            value: (0, bilingual_1.pickLang)(i.value, lang),
            label: (0, bilingual_1.pickLang)(i.title, lang),
            note: (0, bilingual_1.pickLang)(i.text, lang),
        })),
        programs: programs.map(p => ({
            id: p.slug,
            icon: p.icon,
            title: (0, bilingual_1.pickLang)(p.title, lang),
            short: (0, bilingual_1.pickLang)(p.short, lang),
            body: (0, bilingual_1.pickLang)(p.body, lang),
        })),
        programExtras: Object.fromEntries(programs.map(p => {
            var _a, _b, _c, _d, _e, _f;
            return [
                p.slug,
                {
                    status: p.status,
                    tagline: (0, bilingual_1.pickLang)(p.tagline, lang),
                    points: ((_a = p.points) !== null && _a !== void 0 ? _a : []).map((x) => (0, bilingual_1.pickLang)(x, lang)),
                    figures: ((_b = p.figures) !== null && _b !== void 0 ? _b : []).map((f) => ({
                        value: (0, bilingual_1.pickLang)(f.value, lang),
                        label: (0, bilingual_1.pickLang)(f.label, lang),
                    })),
                    ayah: {
                        arabic: (_d = (_c = p.ayah) === null || _c === void 0 ? void 0 : _c.arabic) !== null && _d !== void 0 ? _d : '',
                        text: (0, bilingual_1.pickLang)((_e = p.ayah) === null || _e === void 0 ? void 0 : _e.text, lang),
                        src: (0, bilingual_1.pickLang)((_f = p.ayah) === null || _f === void 0 ? void 0 : _f.source, lang),
                    },
                },
            ];
        })),
        principles: group('principle').map(card),
        goals: group('goal').map(i => (0, bilingual_1.pickLang)(i.title, lang)),
        departments: group('department').map(i => (0, bilingual_1.pickLang)(i.title, lang)),
        roadmap: group('roadmap').map(i => ({
            title: (0, bilingual_1.pickLang)(i.title, lang),
            text: (0, bilingual_1.pickLang)(i.text, lang),
        })),
        joinWays: group('joinWay').map(card),
        posts: posts.map(p => {
            var _a;
            return ({
                id: p.slug,
                slug: p.slug,
                type: p.type,
                icon: p.icon,
                coverImage: p.coverImage,
                category: (0, bilingual_1.pickLang)(p.category, lang),
                title: (0, bilingual_1.pickLang)(p.title, lang),
                excerpt: (0, bilingual_1.pickLang)(p.excerpt, lang),
                body: (0, bilingual_1.pickLang)(p.body, lang),
                author: (0, bilingual_1.pickLang)(p.author, lang),
                featured: p.featured,
                publishedAt: p.publishedAt,
                viewCount: (_a = p.viewCount) !== null && _a !== void 0 ? _a : 0,
            });
        }),
        donationMethods: donationMethods.map(method => ({
            id: String(method._id),
            slug: method.slug,
            region: method.region,
            type: method.type,
            name: (0, bilingual_1.pickLang)(method.name, lang),
            provider: method.provider,
            accountName: (0, bilingual_1.pickLang)(method.accountName, lang),
            accountNumber: method.accountNumber,
            instructions: (0, bilingual_1.pickLang)(method.instructions, lang),
            checkoutUrl: method.checkoutUrl,
            currency: method.currency,
        })),
    };
    for (const s of settings) {
        if (s.key === 'theme') {
            out.theme = s.value;
            continue;
        }
        const v = (_b = (_a = s.value) === null || _a === void 0 ? void 0 : _a[lang]) !== null && _b !== void 0 ? _b : (_c = s.value) === null || _c === void 0 ? void 0 : _c.bn;
        if (v !== undefined)
            out[s.key] = v;
    }
    return out;
});
exports.PublicServices = { getPublicContentFromDB };
