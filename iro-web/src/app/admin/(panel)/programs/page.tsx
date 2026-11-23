"use client";
import Link from "next/link";
import { useState } from "react";
import { Badge, Btn, Empty, inputCls, Loading, Notice, PageTitle, Pager, Table, Td } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { useAuth } from "@/lib/admin/auth";
import { useFetch } from "@/lib/admin/hooks";
import { isAdmin } from "@/lib/admin/roles";
import type { ProgramRec } from "@/lib/admin/types";

export default function ProgramsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState<{ tone: "error" | "success"; text: string }>();
  const { data, meta, loading, error, reload } = useFetch<ProgramRec[]>("/programs", { page, limit: 20, searchTerm: q, status });

  async function remove(p: ProgramRec) {
    if (!confirm(`Delete "${p.title.bn || p.slug}"? This cannot be undone.`)) return;
    try { await api(`/programs/${p._id}`, { method: "DELETE" }); setMsg({ tone: "success", text: "Program deleted" }); reload(); }
    catch (e) { setMsg({ tone: "error", text: (e as Error).message }); }
  }

  return (
    <>
      <PageTitle title="Programs" sub="The activities shown as cards and detail pages." action={<Link href="/admin/programs/new"><Btn>+ New program</Btn></Link>} />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      {error && <Notice>{error}</Notice>}
      <div className="mb-4 flex flex-wrap gap-3">
        <input placeholder="Search title or slug…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className={inputCls + " max-w-xs"} />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={inputCls + " max-w-[10rem]"}>
          <option value="">All statuses</option><option value="ongoing">Ongoing</option><option value="planned">Planned</option>
        </select>
      </div>
      {loading && !data ? <Loading /> : (
        <Table head={["Order", "Program", "Slug", "Status", "Visible", ""]}>
          {data?.length ? data.map((p) => (
            <tr key={p._id}>
              <Td>{p.order}</Td>
              <Td><span className="mr-2 text-xl">{p.icon}</span><span className="font-semibold">{p.title.bn}</span>{p.title.en && <span className="block text-xs text-ink/60">{p.title.en}</span>}</Td>
              <Td className="font-mono text-xs">{p.slug}</Td>
              <Td><Badge tone={p.status === "ongoing" ? "green" : "gold"}>{p.status}</Badge></Td>
              <Td>{p.published ? <Badge tone="green">Published</Badge> : <Badge>Hidden</Badge>}</Td>
              <Td className="space-x-3 whitespace-nowrap text-right">
                <Link href={`/admin/programs/${p._id}`} className="font-semibold text-brand hover:underline">Edit</Link>
                {user && isAdmin(user.role) && <button onClick={() => remove(p)} className="font-semibold text-red-700 hover:underline">Delete</button>}
              </Td>
            </tr>
          )) : <Empty cols={6} />}
        </Table>
      )}
      <Pager meta={meta} onPage={setPage} />
    </>
  );
}
