"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shell } from "@/components/admin/Shell";
import { Loading } from "@/components/admin/ui";
import { useAuth } from "@/lib/admin/auth";
import { isStaff } from "@/lib/admin/roles";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace("/admin/login"); }, [loading, user, router]);

  if (loading || !user) return <Loading full />;
  if (!isStaff(user.role)) {
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <div><h1 className="font-display text-xl font-bold text-brand">No dashboard access</h1>
          <p className="mt-2 text-ink/70">Your account does not have a role that can use the dashboard.</p>
          <button onClick={async () => { await logout(); router.replace("/admin/login"); }} className="mt-4 rounded bg-brand px-4 py-2 text-sm font-semibold text-cream">Log out</button></div>
      </main>
    );
  }
  return <Shell>{children}</Shell>;
}
