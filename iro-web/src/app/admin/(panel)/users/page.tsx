"use client";
import { useState } from "react";
import { Badge, Btn, Empty, Field, inputCls, Loading, Modal, Notice, PageTitle, Pager, Table, Td } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { useAuth } from "@/lib/admin/auth";
import { useFetch } from "@/lib/admin/hooks";
import { assignableRoles, RANK, roleLabel } from "@/lib/admin/roles";
import type { Role, UserRec } from "@/lib/admin/types";

type Form = { name: string; email: string; password: string; role: Role; status: "in-progress" | "blocked" };

export default function UsersPage() {
  const { user: me } = useAuth();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const { data, meta, loading, error, reload } = useFetch<UserRec[]>("/users", { page, limit: 20, searchTerm: q });
  const [editing, setEditing] = useState<{ id?: string; self?: boolean; f: Form } | null>(null);
  const [busy, setBusy] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [msg, setMsg] = useState<{ tone: "error" | "success"; text: string }>();
  if (!me) return null;
  const roles = assignableRoles(me.role);

  const openNew = () => setEditing({ f: { name: "", email: "", password: "", role: roles[0] ?? "member", status: "in-progress" } });
  const openEdit = (u: UserRec) => setEditing({ id: u._id, self: u.id === me.id, f: { name: u.name, email: u.email, password: "", role: u.role, status: u.status } });
  const upd = (p: Partial<Form>) => setEditing((s) => (s ? { ...s, f: { ...s.f, ...p } } : s));
  const manageable = (u: UserRec) => u.id === me.id || RANK[u.role] < RANK[me.role];

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const { f } = editing;
    setBusy(true); setFormErr("");
    try {
      if (editing.id) {
        const body: Record<string, unknown> = { name: f.name };
        if (!editing.self) { body.role = f.role; body.status = f.status; }
        if (f.password) body.password = f.password;
        await api(`/users/${editing.id}`, { method: "PATCH", body });
      } else {
        await api("/users", { method: "POST", body: { name: f.name, email: f.email, password: f.password, role: f.role } });
      }
      setEditing(null); setMsg({ tone: "success", text: "Saved" }); reload();
    } catch (err) { setFormErr((err as Error).message); }
    setBusy(false);
  }
  async function remove(u: UserRec) {
    if (!confirm(`Delete ${u.name} (${u.email})? They will no longer be able to sign in.`)) return;
    try { await api(`/users/${u._id}`, { method: "DELETE" }); setMsg({ tone: "success", text: "User deleted" }); reload(); }
    catch (e) { setMsg({ tone: "error", text: (e as Error).message }); }
  }

  return (
    <>
      <PageTitle title="Users" sub="You can manage users whose role is below yours." action={<Btn onClick={openNew}>+ New user</Btn>} />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      {error && <Notice>{error}</Notice>}
      <input placeholder="Search name, email or id…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className={inputCls + " mb-4 max-w-xs"} />
      {loading && !data ? <Loading /> : (
        <Table head={["Name", "Email", "Role", "Status", "Last login", ""]}>
          {data?.length ? data.map((u) => (
            <tr key={u._id}>
              <Td className="font-semibold">{u.name}{u.id === me.id && <span className="ml-2 text-xs text-ink/50">(you)</span>}</Td>
              <Td>{u.email}</Td><Td>{roleLabel[u.role]}</Td>
              <Td><Badge tone={u.status === "blocked" ? "red" : "green"}>{u.status === "blocked" ? "Blocked" : "Active"}</Badge></Td>
              <Td className="whitespace-nowrap">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}</Td>
              <Td className="space-x-3 whitespace-nowrap text-right">
                {manageable(u) && <button onClick={() => openEdit(u)} className="font-semibold text-brand hover:underline">Edit</button>}
                {manageable(u) && u.id !== me.id && <button onClick={() => remove(u)} className="font-semibold text-red-700 hover:underline">Delete</button>}
              </Td>
            </tr>
          )) : <Empty cols={6} />}
        </Table>
      )}
      <Pager meta={meta} onPage={setPage} />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit user" : "New user"}>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            {formErr && <Notice>{formErr}</Notice>}
            <Field label="Name"><input required value={editing.f.name} onChange={(e) => upd({ name: e.target.value })} className={inputCls} /></Field>
            <Field label="Email"><input required type="email" disabled={!!editing.id} value={editing.f.email} onChange={(e) => upd({ email: e.target.value })} className={inputCls} /></Field>
            <Field label={editing.id ? "New password (leave empty to keep)" : "Password"} hint="At least 10 characters with a letter and a digit. The user is asked to change it after login.">
              <input type="password" autoComplete="new-password" required={!editing.id} value={editing.f.password} onChange={(e) => upd({ password: e.target.value })} className={inputCls} />
            </Field>
            {!editing.self && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Role"><select value={editing.f.role} onChange={(e) => upd({ role: e.target.value as Role })} className={inputCls}>{roles.map((r) => <option key={r} value={r}>{roleLabel[r]}</option>)}</select></Field>
                {editing.id && <Field label="Status"><select value={editing.f.status} onChange={(e) => upd({ status: e.target.value as Form["status"] })} className={inputCls}><option value="in-progress">Active</option><option value="blocked">Blocked</option></select></Field>}
              </div>
            )}
            <div className="flex gap-3"><Btn disabled={busy}>{busy ? "Saving…" : "Save"}</Btn><Btn type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn></div>
          </form>
        )}
      </Modal>
    </>
  );
}
