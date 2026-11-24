import { fetchContent } from "@/lib/api";
import { bn, type Dict } from "@/lib/content/bn";
import { en } from "@/lib/content/en";
import { resolveTheme } from "@/lib/theme";
import { notFound } from "next/navigation";
import { isLocale } from "./config";

const defaults: Record<string, Dict> = { bn, en };
export type Params = Promise<{ locale: string }>;

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const nonEmpty = (v: unknown) =>
  Array.isArray(v)
    ? v.length > 0
    : isObj(v)
      ? Object.keys(v).length > 0
      : v != null && v !== "";

/** ডিফল্টের উপর API ডেটা বসায়। ui ও site গভীরভাবে মার্জ হয় (কোনো কী বাদ পড়লে ডিফল্ট থাকে), বাকি সব কী খালি না হলে API-র মান নেয়। */
function deepMerge<T>(base: T, over: unknown): T {
  if (isObj(base) && isObj(over)) {
    const out: Record<string, unknown> = { ...base };
    for (const k of Object.keys(over))
      out[k] =
        k in base
          ? deepMerge((base as Record<string, unknown>)[k], over[k])
          : over[k];
    return out as T;
  }
  return (nonEmpty(over) ? over : base) as T;
}

function mergeContent(fallback: Dict, api: Partial<Dict> | null): Dict {
  if (!api) return fallback;
  const out: Record<string, unknown> = { ...fallback };
  for (const [k, v] of Object.entries(api)) {
    if (!(k in fallback)) continue;
    if (k === "ui" || k === "site")
      out[k] = deepMerge((fallback as Record<string, unknown>)[k], v);
    else if (k === "nav" && Array.isArray(v)) {
      const saved = v as Array<{ href: string; label: string }>;
      out[k] = fallback.nav.map(
        (item) => saved.find((x) => x.href === item.href) ?? item,
      );
    } else if (nonEmpty(v)) out[k] = v;
  }
  return out as Dict;
}

export async function getT(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await fetchContent(locale);
  const t = mergeContent(defaults[locale], content);
  return { locale, t, theme: resolveTheme(content?.theme) };
}
