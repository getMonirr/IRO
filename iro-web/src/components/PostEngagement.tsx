"use client";

import { useEffect, useState } from "react";

export function PostEngagement({
  slug,
  initialCount,
  locale,
}: {
  slug: string;
  initialCount: number;
  locale: string;
}) {
  const [count, setCount] = useState(initialCount);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = `iro-viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;
    const base = process.env.NEXT_PUBLIC_API_URL ?? "";
    fetch(`${base}/api/v1/public/posts/${encodeURIComponent(slug)}/view`, {
      method: "POST",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.viewCount !== undefined) setCount(json.data.viewCount);
        sessionStorage.setItem(key, "1");
      })
      .catch(() => undefined);
  }, [slug]);

  const shareUrl = typeof window === "undefined" ? "" : window.location.href;
  const title = typeof document === "undefined" ? "IRO" : document.title;
  const share = (network: "facebook" | "twitter" | "copy") => {
    if (!shareUrl) return;
    if (network === "copy") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      });
      return;
    }
    const url =
      network === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        : `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=620");
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-gold/30 py-4 text-sm">
      <span className="font-semibold text-gold-soft">
        {locale === "bn"
          ? `${count.toLocaleString("bn-BD")} বার পঠিত`
          : `${count.toLocaleString("en-US")} views`}
      </span>
      <div className="flex items-center gap-2">
        <span className="mr-1 text-gold-soft/80">
          {locale === "bn" ? "শেয়ার" : "Share"}
        </span>
        <button
          type="button"
          onClick={() => share("facebook")}
          className="rounded border border-gold/60 px-3 py-1.5 font-semibold text-cream transition hover:bg-gold/15"
          aria-label="Share on Facebook"
        >
          Facebook
        </button>
        <button
          type="button"
          onClick={() => share("twitter")}
          className="rounded border border-gold/60 px-3 py-1.5 font-semibold text-cream transition hover:bg-gold/15"
          aria-label="Share on X"
        >
          X
        </button>
        <button
          type="button"
          onClick={() => share("copy")}
          className={`rounded border border-gold/60 px-3 py-1.5 font-semibold transition ${copied ? "scale-105 bg-gold text-brand-dark" : "text-cream hover:bg-gold/15"}`}
          aria-label="Copy link"
        >
          {copied
            ? locale === "bn"
              ? "কপি হয়েছে ✓"
              : "Copied ✓"
            : locale === "bn"
              ? "কপি"
              : "Copy"}
        </button>
      </div>
    </div>
  );
}
