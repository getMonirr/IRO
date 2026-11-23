import Link from "next/link";
import { Arabesque } from "./Arabesque";
import type { Dict } from "@/lib/content/bn";

export function Footer({ locale, t }: { locale: string; t: Dict }) {
  return (
    <footer className="relative overflow-hidden bg-brand-dark text-cream">
      <Arabesque className="absolute inset-0 text-gold opacity-10" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold">{t.site.name}</p>
          <p className="mt-2 text-sm text-gold-soft">{t.site.tagline}</p>
          <p className="mt-4 text-sm opacity-80">{t.ui.footer.about}</p>
        </div>
        <ul className="space-y-1 text-sm">
          {[...t.nav, { href: "/join", label: t.ui.header.join }].map((n) => (
            <li key={n.href}><Link href={`/${locale}${n.href}`} className="hover:text-gold">{n.label}</Link></li>
          ))}
        </ul>
        <p className="font-display text-sm leading-7 text-gold-soft">{t.ui.footer.quote}</p>
      </div>
      <p className="relative border-t border-gold/20 py-4 text-center text-xs opacity-70">© Islamic Research Organization (IRO). All Rights Reserved.</p>
    </footer>
  );
}
