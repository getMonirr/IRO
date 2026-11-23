"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Btn, Card, Field, inputCls, Notice, PageTitle } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { useAuth } from "@/lib/admin/auth";
import { roleLabel } from "@/lib/admin/roles";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("newPassword") !== f.get("confirm")) return setError("The new passwords do not match");
    setBusy(true); setError("");
    try {
      await api("/auth/change-password", { method: "POST", body: { currentPassword: f.get("currentPassword"), newPassword: f.get("newPassword") } });
      await logout(); // every session ended: sign in again with the new password
      router.replace("/admin/login");
    } catch (err) { setError((err as Error).message); setBusy(false); }
  }

  return (
    <>
      <PageTitle title="My account" />
      <Card className="mb-6 max-w-lg text-sm">
        <p><strong>{user?.name}</strong> · {user && roleLabel[user.role]}</p><p className="text-ink/70">{user?.email}</p>
      </Card>
      <Card className="max-w-lg">
        <h2 className="mb-4 font-display text-lg font-bold text-brand">Change password</h2>
        {error && <Notice>{error}</Notice>}
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Current password"><input name="currentPassword" type="password" required autoComplete="current-password" className={inputCls} /></Field>
          <Field label="New password" hint="At least 10 characters with a letter and a digit. You will be signed out everywhere afterwards."><input name="newPassword" type="password" required autoComplete="new-password" className={inputCls} /></Field>
          <Field label="Confirm new password"><input name="confirm" type="password" required autoComplete="new-password" className={inputCls} /></Field>
          <Btn disabled={busy}>{busy ? "Updating…" : "Update password"}</Btn>
        </form>
      </Card>
    </>
  );
}
