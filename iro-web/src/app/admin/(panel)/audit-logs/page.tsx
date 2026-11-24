"use client";
import {
  Badge,
  Empty,
  Loading,
  Notice,
  PageTitle,
  Pager,
  Table,
  TableRow,
  Td,
} from "@/components/admin/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/lib/admin/hooks";
import type { AuditRec } from "@/lib/admin/types";
import { useState } from "react";

const RESOURCES = [
  "program",
  "item",
  "setting",
  "join-request",
  "user",
  "auth",
];
const ACTIONS = ["create", "update", "delete", "login", "change-password"];

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [resource, setResource] = useState("");
  const [action, setAction] = useState("");
  const { data, meta, loading, error } = useFetch<AuditRec[]>("/audit-logs", {
    page,
    limit: 30,
    resource,
    action,
  });
  return (
    <>
      <PageTitle
        title="Audit log"
        sub="Who changed what, and when. Entries are kept for one year."
      />
      {error && <Notice>{error}</Notice>}
      <div className="mb-4 flex gap-3">
        <Select
          value={resource || "all"}
          onValueChange={(value) => {
            setResource(value === "all" || !value ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All resources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All resources</SelectItem>
            {RESOURCES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={action || "all"}
          onValueChange={(value) => {
            setAction(value === "all" || !value ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {ACTIONS.map((item) => (
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
        <Table head={["When", "Who", "Action", "Resource", "Details", "IP"]}>
          {data?.length ? (
            data.map((l) => (
              <TableRow key={l._id}>
                <Td className="whitespace-nowrap">
                  {new Date(l.createdAt).toLocaleString()}
                </Td>
                <Td>
                  {l.actor ? (
                    <>
                      <span className="font-semibold">{l.actor.name}</span>
                      <span className="block text-xs text-ink/60">
                        {l.actor.email}
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  <Badge
                    tone={
                      l.action === "delete"
                        ? "red"
                        : l.action === "create"
                          ? "green"
                          : "gold"
                    }
                  >
                    {l.action}
                  </Badge>
                </Td>
                <Td>
                  {l.resource}
                  {l.resourceId && (
                    <span
                      className="block max-w-[10rem] truncate font-mono text-xs text-ink/50"
                      title={l.resourceId}
                    >
                      {l.resourceId}
                    </span>
                  )}
                </Td>
                <Td className="max-w-xs break-words font-mono text-xs text-ink/70">
                  {l.meta ? JSON.stringify(l.meta) : ""}
                </Td>
                <Td className="text-xs">{l.ip}</Td>
              </TableRow>
            ))
          ) : (
            <Empty cols={6} />
          )}
        </Table>
      )}
      <Pager meta={meta} onPage={setPage} />
    </>
  );
}
