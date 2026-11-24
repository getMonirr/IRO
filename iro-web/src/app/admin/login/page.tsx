"use client";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Arabesque, StarMark } from "@/components/Arabesque";
import { Btn, Field, inputCls, Loading, Notice } from "@/components/admin/ui";
import { useAuth } from "@/lib/admin/auth";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) router.replace("/admin"); }, [user, router]);
  if (loading || user) return <Loading full />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError("");
    try { await login(String(f.get("email")), String(f.get("password"))); router.replace("/admin"); }
    catch (err) { setError(err instanceof Error ? err.message : "Login failed"); setBusy(false); }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-brand p-4 leading-normal">
      <Arabesque className="absolute inset-0 text-gold opacity-20" />
      <form onSubmit={onSubmit} className="relative w-full max-w-sm space-y-4 rounded-lg border-2 border-gold bg-background p-7 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded bg-brand-dark p-1.5"><StarMark size={32} /></div>
          <div><h1 className="font-display text-xl font-bold text-brand">IRO Admin</h1><p className="text-xs text-ink/60">Sign in to manage the website</p></div>
        </div>
        {error && <Notice>{error}</Notice>}
        <Field label="Email"><Input name="email" type="email" required autoComplete="username" className={inputCls} /></Field>
        <Field label="Password"><Input name="password" type="password" required autoComplete="current-password" className={inputCls} /></Field>
        <Btn disabled={busy} className="w-full">{busy ? "Signing in…" : "Sign in"}</Btn>
      </form>
    </main>
  );
}
