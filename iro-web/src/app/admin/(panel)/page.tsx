"use client";
import Link from "next/link";
import { Badge, Card, Empty, Loading, PageTitle, Table, Td } from "@/components/admin/ui";
import { useAuth } from "@/lib/admin/auth";
import { useFetch } from "@/lib/admin/hooks";
import { isAdmin } from "@/lib/admin/roles";
import type { JoinRec } from "@/lib/admin/types";

function Stat({ label, value, href, loading }: { label: string; value?: number; href: string; loading: boolean }) {
  return (
    <Link href={href}>
      <Card className="border-l-4 border-l-gold transition hover:shadow-md">
        <div className="font-display text-3xl font-bold text-brand">{loading ? "…" : value ?? "–"}</div>
        <div className="text-sm text-ink/70">{label}</div>
      </Card>
    </Link>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const admin = !!user && isAdmin(user.role);
  const programs = useFetch("/programs", { limit: 1 });
  const items = useFetch("/items", { limit: 1 });
  const newReq = useFetch("/join-requests", { limit: 1, status: "new" });
  const users = useFetch(admin ? "/users" : null, { limit: 1 });
  const recent = useFetch<JoinRec[]>("/join-requests", { limit: 5 });

  return (
    <>
      <PageTitle title={`Welcome, ${user?.name.split(" ")[0] ?? ""}`} sub="Manage everything shown on the IRO website, in Bangla and English." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Programs" value={programs.meta?.total} href="/admin/programs" loading={programs.loading} />
        <Stat label="Content items" value={items.meta?.total} href="/admin/items" loading={items.loading} />
        <Stat label="New join requests" value={newReq.meta?.total} href="/admin/join-requests" loading={newReq.loading} />
        {admin && <Stat label="Users" value={users.meta?.total} href="/admin/users" loading={users.loading} />}
      </div>

      <h2 className="mb-3 mt-10 font-display text-lg font-bold text-brand">Latest join requests</h2>
      {recent.loading ? <Loading /> : (
        <Table head={["Name", "Contact", "Type", "Status", "Received"]}>
          {recent.data?.length ? recent.data.map((r) => (
            <tr key={r._id}>
              <Td className="font-semibold">{r.name}</Td><Td>{r.contact}</Td><Td>{r.type}</Td>
              <Td><Badge tone={r.status === "new" ? "gold" : r.status === "closed" ? "gray" : "green"}>{r.status}</Badge></Td>
              <Td>{new Date(r.createdAt).toLocaleDateString()}</Td>
            </tr>
          )) : <Empty cols={5}>No requests yet.</Empty>}
        </Table>
      )}
    </>
  );
}
