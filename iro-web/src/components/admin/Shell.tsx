"use client";
import { StarMark } from "@/components/Arabesque";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/admin/auth";
import { isAdmin, roleLabel } from "@/lib/admin/roles";
import {
  BookOpen,
  HeartHandshake,
  Home,
  KeyRound,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  PanelsTopLeft,
  ScrollText,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Notice } from "./ui";

const nav = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/programs", label: "Programs", icon: BookOpen },
  { href: "/admin/items", label: "Content items", icon: PanelsTopLeft },
  { href: "/admin/posts", label: "Blogs & News", icon: Newspaper },
  {
    href: "/admin/donations",
    label: "Donations",
    icon: HeartHandshake,
    admin: true,
  },
  {
    href: "/admin/settings",
    label: "Site settings",
    icon: Settings,
    admin: true,
  },
  { href: "/admin/join-requests", label: "Join requests", icon: Mail },
  { href: "/admin/users", label: "Users", icon: UsersRound, admin: true },
  {
    href: "/admin/audit-logs",
    label: "Audit log",
    icon: ScrollText,
    admin: true,
  },
  { href: "/admin/account", label: "My account", icon: KeyRound },
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
      className="flex h-full flex-col bg-brand-dark text-primary-foreground"
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
            <Button
              render={<Link href={n.href} onClick={() => setOpen(false)} />}
              variant={active(n.href) ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
            >
              <n.icon aria-hidden="true" />
              {n.label}
            </Button>
          </li>
        ))}
      </ul>
      <div className="border-t border-gold/30 p-3 text-sm">
        <Button
          render={<Link href="/bn" target="_blank" />}
          variant="ghost"
          className="w-full justify-start"
        >
          View website
        </Button>
      </div>
    </nav>
  );

  return (
    <div className="admin-shell min-h-screen bg-sand/50 leading-normal md:grid md:grid-cols-[250px_1fr]">
      <aside className="hidden md:block">
        <div className="sticky top-0 h-screen">{side}</div>
      </aside>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="left-0 top-0 h-dvh max-w-xs translate-x-0 translate-y-0 rounded-none p-0 sm:max-w-xs md:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Dashboard menu</DialogTitle>
          </DialogHeader>
          {side}
        </DialogContent>
      </Dialog>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gold/30 bg-background px-4 py-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setOpen(true)}
                  aria-label="Open dashboard menu"
                />
              }
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </TooltipTrigger>
            <TooltipContent>Open dashboard menu</TooltipContent>
          </Tooltip>
          <span className="hidden text-sm text-ink/60 md:block">
            Signed in as
          </span>
          <div className="flex items-center gap-3 text-sm">
            <span>
              <strong className="text-brand">{user.name}</strong>{" "}
              <span className="text-ink/60">· {roleLabel[user.role]}</span>
            </span>
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                router.replace("/admin/login");
              }}
            >
              <LogOut aria-hidden="true" />
              Log out
            </Button>
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
