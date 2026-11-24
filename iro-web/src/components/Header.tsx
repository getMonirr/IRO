"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/lib/content/bn";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const other: Locale = locale === "bn" ? "en" : "bn";
  const switchHref = pathname.replace(/^\/(bn|en)/, `/${other}`) || `/${other}`;
  const h = t.ui.header;
  const home = t.nav.find((n) => n.href === "/") ?? {
    href: "/",
    label: locale === "bn" ? "হোম" : "Home",
  };
  const navLinks = [home, ...t.nav.filter((n) => n.href !== "/")];
  const links = [
    ...navLinks,
    { href: "/donate", label: h.donate },
    { href: "/join", label: h.join },
  ];
  const getHref = (href: string) => `/${locale}${href}`;
  return (
    <header className="sticky top-0 z-50 h-20 border-b border-gold/30 bg-brand-dark text-primary-foreground xl:h-24">
      <div className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="min-w-0 shrink-0 flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/iro-logo.png"
            alt={t.site.name}
            width={64}
            height={64}
            className="h-14 w-14 xl:h-16 xl:w-16"
            priority
          />
          <span className="font-display text-lg font-bold leading-tight">
            <span className="max-w-52 truncate sm:max-w-none">
              {t.site.name}
            </span>
            <span className="block text-xs font-normal text-gold-soft">
              {t.site.short}
            </span>
          </span>
        </Link>
        <nav
          className="hidden min-w-0 items-center gap-3 xl:flex 2xl:gap-5"
          aria-label={h.main}
        >
          {navLinks.map((n) => (
            <Link
              key={n.href}
              href={getHref(n.href)}
              className="nav-underline whitespace-nowrap text-base hover:text-gold"
            >
              {n.label}
            </Link>
          ))}
          <Button
            render={<Link href={switchHref} lang={other} />}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
          >
            {h.switchLabel}
          </Button>
          <Button
            render={<Link href={getHref("/donate")} />}
            className="whitespace-nowrap"
          >
            {h.donate}
          </Button>
          <Button
            render={<Link href={getHref("/join")} />}
            variant="secondary"
            className="whitespace-nowrap"
          >
            {h.join}
          </Button>
        </nav>
        <div className="flex items-center gap-2 xl:hidden">
          <Button
            render={<Link href={switchHref} lang={other} />}
            variant="outline"
            size="sm"
          >
            {h.switchLabel}
          </Button>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-expanded={open}
                  aria-label={open ? h.close : h.menu}
                  onClick={() => setOpen(!open)}
                />
              }
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </TooltipTrigger>
            <TooltipContent>{open ? h.close : h.menu}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      {open && (
        <nav
          className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-gold/20 px-5 pb-4 xl:hidden"
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
