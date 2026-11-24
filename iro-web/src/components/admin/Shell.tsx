"use client";
import { StarMark } from "@/components/Arabesque";
import { useAuth } from "@/lib/admin/auth";
import { isAdmin, roleLabel } from "@/lib/admin/roles";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Notice } from "./ui";

const nav = [
  { href: "/admin", label: "Overview", icon: "🏠" },
  { href: "/admin/programs", label: "Programs", icon: "📖" },
  { href: "/admin/items", label: "Content items", icon: "🗂" },
  { href: "/admin/posts", label: "Blogs & News", icon: "📰" },
  { href: "/admin/donations", label: "Donations", icon: "♥", admin: true },
  { href: "/admin/settings", label: "Site texts", icon: "✏️", admin: true },
  { href: "/admin/join-requests", label: "Join requests", icon: "✉️" },
  { href: "/admin/users", label: "Users", icon: "👥", admin: true },
  { href: "/admin/audit-logs", label: "Audit log", icon: "🧾", admin: true },
  { href: "/admin/account", label: "My account", icon: "🔑" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const items = nav.filter((n) => !n.admin || isAdmin(user.role));
  const active = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const side = (
    <nav
      className="flex h-full flex-col bg-brand-dark text-cream"
      aria-label="Dashboard menu"
    >
      <div className="flex items-center gap-3 border-b border-gold/30 px-5 py-4">
        <StarMark size={30} />
        <div className="font-display font-bold leading-tight">
          IRO
          <span className="block text-xs font-normal text-gold-soft">
            Admin dashboard
          </span>
        </div>
      </div>
      <ul className="flex-1 space-y-1 p-3">
        {items.map((n) => (
          <li key={n.href}>
            <Link
              href={n.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded px-3 py-2 text-sm ${active(n.href) ? "bg-gold text-brand-dark font-semibold" : "hover:bg-white/10"}`}
            >
              <span aria-hidden>{n.icon}</span>
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-t border-gold/30 p-3 text-sm">
        <Link
          href="/bn"
          target="_blank"
          className="block rounded px-3 py-2 hover:bg-white/10"
        >
          ↗ View website
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="admin-shell min-h-screen bg-sand/50 leading-normal md:grid md:grid-cols-[250px_1fr]">
      <aside className="hidden md:block">
        <div className="sticky top-0 h-screen">{side}</div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="h-full w-64" onClick={(e) => e.stopPropagation()}>
            {side}
          </div>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gold/30 bg-cream px-4 py-3">
          <button
            className="rounded border border-brand/30 px-3 py-1 text-sm md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            ☰ Menu
          </button>
          <span className="hidden text-sm text-ink/60 md:block">
            Signed in as
          </span>
          <div className="flex items-center gap-3 text-sm">
            <span>
              <strong className="text-brand">{user.name}</strong>{" "}
              <span className="text-ink/60">· {roleLabel[user.role]}</span>
            </span>
            <button
              onClick={async () => {
                await logout();
                router.replace("/admin/login");
              }}
              className="rounded border border-brand/30 px-3 py-1 text-brand hover:bg-sand"
            >
              Log out
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4 md:p-8">
          {user.needsPasswordChange && (
            <Notice tone="info">
              Please{" "}
              <Link href="/admin/account" className="font-semibold underline">
                change your temporary password
              </Link>
              .
            </Notice>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
