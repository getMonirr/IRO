"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Copy, Share2 } from "lucide-react";
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
        <span className="mr-1 text-muted-foreground">
          {locale === "bn" ? "শেয়ার" : "Share"}
        </span>
        <Button
          type="button"
          onClick={() => share("facebook")}
          aria-label="Share on Facebook"
          variant="outline"
          size="sm"
        >
          <Share2 aria-hidden="true" />
          Facebook
        </Button>
        <Button
          type="button"
          onClick={() => share("twitter")}
          aria-label="Share on X"
          variant="outline"
          size="sm"
        >
          <Share2 aria-hidden="true" />X
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <Button
          type="button"
          onClick={() => share("copy")}
          aria-label="Copy link"
          variant="outline"
          size="sm"
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied
            ? locale === "bn"
              ? "কপি হয়েছে ✓"
              : "Copied ✓"
            : locale === "bn"
              ? "কপি"
              : "Copy"}
        </Button>
      </div>
    </div>
  );
}
