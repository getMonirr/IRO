export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bn";
export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
