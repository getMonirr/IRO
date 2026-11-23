"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_validation_1 = require("./program.validation");
const valid = {
    slug: 'quran',
    title: { bn: 'কুরআন শিক্ষা', en: '' },
    short: { bn: 'সংক্ষিপ্ত', en: 'Short' },
};
const { createProgramValidationSchema: create, updateProgramValidationSchema: update, } = program_validation_1.ProgramValidation;
describe('Program validation', () => {
    it('accepts a minimal valid program and fills defaults', () => {
        const res = create.parse({ body: valid });
        expect(res.body.status).toBe('ongoing');
        expect(res.body.published).toBe(true);
        expect(res.body.points).toEqual([]);
    });
    it('requires Bangla title text', () => {
        expect(() => create.parse({ body: Object.assign(Object.assign({}, valid), { title: { bn: '', en: 'x' } }) })).toThrow();
    });
    it('rejects an invalid slug', () => {
        expect(() => create.parse({ body: Object.assign(Object.assign({}, valid), { slug: 'Bad Slug!' }) })).toThrow();
    });
    it('does not reset omitted fields on partial update', () => {
        const res = update.parse({ body: { order: 3 } });
        expect(res.body).toEqual({ order: 3 });
    });
});
