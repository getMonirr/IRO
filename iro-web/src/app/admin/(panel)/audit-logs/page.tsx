"use client";
import { useState } from "react";
import { Badge, Empty, inputCls, Loading, Notice, PageTitle, Pager, Table, Td } from "@/components/admin/ui";
import { useFetch } from "@/lib/admin/hooks";
import type { AuditRec } from "@/lib/admin/types";

const RESOURCES = ["program", "item", "setting", "join-request", "user", "auth"];
const ACTIONS = ["create", "update", "delete", "login", "change-password"];

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [resource, setResource] = useState(""); const [action, setAction] = useState("");
  const { data, meta, loading, error } = useFetch<AuditRec[]>("/audit-logs", { page, limit: 30, resource, action });
  return (
    <>
      <PageTitle title="Audit log" sub="Who changed what, and when. Entries are kept for one year." />
      {error && <Notice>{error}</Notice>}
      <div className="mb-4 flex gap-3">
        <select value={resource} onChange={(e) => { setResource(e.target.value); setPage(1); }} className={inputCls + " max-w-[11rem]"}><option value="">All resources</option>{RESOURCES.map((r) => <option key={r}>{r}</option>)}</select>
        <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className={inputCls + " max-w-[11rem]"}><option value="">All actions</option>{ACTIONS.map((a) => <option key={a}>{a}</option>)}</select>
      </div>
      {loading && !data ? <Loading /> : (
        <Table head={["When", "Who", "Action", "Resource", "Details", "IP"]}>
          {data?.length ? data.map((l) => (
            <tr key={l._id}>
              <Td className="whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</Td>
              <Td>{l.actor ? <><span className="font-semibold">{l.actor.name}</span><span className="block text-xs text-ink/60">{l.actor.email}</span></> : "—"}</Td>
              <Td><Badge tone={l.action === "delete" ? "red" : l.action === "create" ? "green" : "gold"}>{l.action}</Badge></Td>
              <Td>{l.resource}{l.resourceId && <span className="block max-w-[10rem] truncate font-mono text-xs text-ink/50" title={l.resourceId}>{l.resourceId}</span>}</Td>
              <Td className="max-w-xs break-words font-mono text-xs text-ink/70">{l.meta ? JSON.stringify(l.meta) : ""}</Td>
              <Td className="text-xs">{l.ip}</Td>
            </tr>
          )) : <Empty cols={6} />}
        </Table>
      )}
      <Pager meta={meta} onPage={setPage} />
    </>
  );
}
