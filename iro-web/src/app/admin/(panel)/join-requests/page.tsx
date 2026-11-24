"use client";
import {
  Badge,
  Btn,
  Empty,
  Field,
  inputCls,
  Loading,
  Modal,
  Notice,
  Pager,
  PageTitle,
  Table,
  TableRow,
  Td,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/admin/api";
import { useAuth } from "@/lib/admin/auth";
import { useFetch } from "@/lib/admin/hooks";
import { isAdmin } from "@/lib/admin/roles";
import type { JoinRec } from "@/lib/admin/types";
import { useState } from "react";

const tone = { new: "gold", contacted: "green", closed: "gray" } as const;

export default function JoinRequestsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const { data, meta, loading, error, reload } = useFetch<JoinRec[]>(
    "/join-requests",
    { page, limit: 20, searchTerm: q, status, type },
  );
  const [open, setOpen] = useState<JoinRec | null>(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<{ tone: "error" | "success"; text: string }>();

  async function patch(id: string, body: Partial<JoinRec>) {
    try {
      await api(`/join-requests/${id}`, { method: "PATCH", body });
      reload();
      return true;
    } catch (e) {
      setMsg({ tone: "error", text: (e as Error).message });
      return false;
    }
  }
  async function remove(r: JoinRec) {
    if (!confirm(`Delete the request from ${r.name}?`)) return;
    try {
      await api(`/join-requests/${r._id}`, { method: "DELETE" });
      setOpen(null);
      reload();
    } catch (e) {
      setMsg({ tone: "error", text: (e as Error).message });
    }
  }
  const openRow = (r: JoinRec) => {
    setOpen(r);
    setNote(r.note ?? "");
  };

  return (
    <>
      <PageTitle
        title="Join requests"
        sub="Submissions from the “Join us” form on the website."
      />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      {error && <Notice>{error}</Notice>}
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search name or contact…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className={inputCls + " max-w-xs"}
        />
        <Select
          value={status || "all"}
          onValueChange={(value) => {
            setStatus(value === "all" || !value ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={type || "all"}
          onValueChange={(value) => {
            setType(value === "all" || !value ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {["volunteer", "member", "donor", "partner"].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          head={["Received", "Name", "Contact", "Type", "Lang", "Status", ""]}
        >
          {data?.length ? (
            data.map((r) => (
              <TableRow key={r._id}>
                <Td className="whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleString()}
                </Td>
                <Td className="font-semibold">{r.name}</Td>
                <Td>{r.contact}</Td>
                <Td>{r.type}</Td>
                <Td className="uppercase">{r.lang}</Td>
                <Td>
                  <Select
                    value={r.status}
                    onValueChange={(value) =>
                      value &&
                      patch(r._id, { status: value as JoinRec["status"] })
                    }
                  >
                    <SelectTrigger className="w-32" aria-label="Status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </Td>
                <Td className="text-right">
                  <Button variant="link" size="sm" onClick={() => openRow(r)}>
                    Details
                  </Button>
                </Td>
              </TableRow>
            ))
          ) : (
            <Empty cols={7} />
          )}
        </Table>
      )}
      <Pager meta={meta} onPage={setPage} />

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        title={open ? `Request from ${open.name}` : ""}
      >
        {open && (
          <div className="space-y-4 text-sm">
            <p>
              <Badge tone={tone[open.status]}>{open.status}</Badge>{" "}
              <span className="ml-2 text-ink/60">
                {open.type} · {new Date(open.createdAt).toLocaleString()}
              </span>
            </p>
            <p>
              <strong>Contact:</strong> {open.contact}
            </p>
            <div>
              <strong>Message</strong>
              <p className="mt-1 whitespace-pre-wrap rounded border border-gold/30 bg-card p-3">
                {open.message || "—"}
              </p>
            </div>
            <Field label="Internal note">
              <Textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={inputCls}
              />
            </Field>
            <div className="flex flex-wrap gap-3">
              <Btn
                onClick={async () => {
                  if (await patch(open._id, { note })) setOpen(null);
                }}
              >
                Save note
              </Btn>
              {user && isAdmin(user.role) && (
                <Btn variant="danger" onClick={() => remove(open)}>
                  Delete
                </Btn>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
