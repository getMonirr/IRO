"use client";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/lib/content/bn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { StarMark } from "./Arabesque";

export function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const other: Locale = locale === "bn" ? "en" : "bn";
  const switchHref = pathname.replace(/^\/(bn|en)/, `/${other}`) || `/${other}`;
  const h = t.ui.header;
  const links = [...t.nav, { href: "/join", label: h.join }];
  const getHref = (href: string) => `/${locale}${href}`;
  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-brand-dark text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <StarMark />
          <span className="font-display text-lg font-bold leading-tight">
            {t.site.name}
            <span className="block text-xs font-normal text-gold-soft">
              {t.site.short}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label={h.main}>
          {t.nav.map((n) => (
            <Link
              key={n.href}
              href={getHref(n.href)}
              className="text-sm hover:text-gold"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href={switchHref}
            lang={other}
            className="rounded border border-gold/50 px-3 py-1 text-sm hover:bg-gold/10"
          >
            {h.switchLabel}
          </Link>
          <Link
            href={getHref("/join")}
            className="rounded-full bg-gold px-5 py-1.5 text-sm font-semibold text-brand-dark hover:bg-gold-soft"
          >
            {h.join}
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={switchHref}
            lang={other}
            className="rounded border border-gold/50 px-3 py-1 text-sm"
          >
            {h.switchLabel}
          </Link>
          <button
            className="rounded border border-gold/50 px-3 py-1 text-sm"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? h.close : h.menu}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="border-t border-gold/20 px-5 pb-4 md:hidden"
          aria-label={h.mobile}
        >
          {links.map((n) => (
            <Link
              key={n.href}
              href={getHref(n.href)}
              onClick={() => setOpen(false)}
              className="block border-b border-gold/10 py-3"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
