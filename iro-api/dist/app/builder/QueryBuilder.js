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
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * Chainable list helper: search, exact filters (whitelisted), sort and pagination.
 * Only plain string query values are accepted, so operators like ?role[$ne]=x are ignored.
 */
class QueryBuilder {
    constructor(modelQuery, query) {
        this.page = 1;
        this.limit = 20;
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        const term = this.query.searchTerm;
        if (typeof term === 'string' && term.trim()) {
            const regex = { $regex: escapeRegex(term.trim()), $options: 'i' };
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(f => ({ [f]: regex })),
            });
        }
        return this;
    }
    filter(allowed) {
        const filter = {};
        for (const key of allowed) {
            const v = this.query[key];
            if (typeof v === 'string' && v !== '')
                filter[key] = v;
        }
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    sort(defaultSort = 'order createdAt') {
        const s = this.query.sort;
        const sort = typeof s === 'string' && /^[-\w., ]+$/.test(s)
            ? s.split(/[, ]+/).join(' ')
            : defaultSort;
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        this.page = Math.max(1, parseInt(String(this.query.page)) || 1);
        this.limit = Math.min(100, Math.max(1, parseInt(String(this.query.limit)) || 20));
        this.modelQuery = this.modelQuery
            .skip((this.page - 1) * this.limit)
            .limit(this.limit);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this.modelQuery.model.countDocuments(this.modelQuery.getFilter());
            return {
                page: this.page,
                limit: this.limit,
                total,
                totalPage: Math.ceil(total / this.limit),
            };
        });
    }
}
exports.default = QueryBuilder;
