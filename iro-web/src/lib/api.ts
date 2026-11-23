import type { Dict } from "./content/bn";

// ব্রাউজার থেকে (ফর্ম সাবমিট) ও সার্ভার থেকে (কন্টেন্ট ফেচ) আলাদা URL দেওয়া যায়
const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL;
const INTERNAL_URL = process.env.API_URL || PUBLIC_URL;

/** ব্যাকএন্ড থেকে স্থানীয়কৃত কন্টেন্ট আনে। সার্ভার বন্ধ/ধীর/ভুল ডেটা হলে null (তখন ডিফল্ট ডেটা ব্যবহার হবে)। */
export async function fetchContent(locale: string): Promise<Partial<Dict> | null> {
  if (!INTERNAL_URL) return null;
  try {
    const res = await fetch(`${INTERNAL_URL}/api/v1/public/content?lang=${locale}`, {
      next: { revalidate: 60, tags: ["content"] },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json && typeof json.data === "object" ? json.data : null;
  } catch {
    return null;
  }
}

export async function apiPost(path: string, data: unknown) {
  if (!PUBLIC_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const res = await fetch(`${PUBLIC_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.errorMessage ?? json?.message ?? "Request failed");
  return json;
}
