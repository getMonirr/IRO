import type { Dict } from "@/lib/content/bn";
import Link from "next/link";

export function FloatingActions({ locale, t }: { locale: string; t: Dict }) {
  return (
    <div className="motion-float fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <Link
        href={`/${locale}/donate`}
        className="motion-sheen rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-cream shadow-lg ring-2 ring-cream/80 transition hover:bg-brand-dark"
      >
        <span aria-hidden>♥</span> {t.ui.floating.donate}
      </Link>
      <Link
        href={`/${locale}/contact`}
        className="motion-sheen rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-cream shadow-lg ring-2 ring-cream/80 transition hover:bg-brand-dark"
      >
        <span aria-hidden>💬</span> {t.ui.floating.chat}
      </Link>
    </div>
  );
}
