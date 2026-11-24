"use client";
import {
  BiField,
  Btn,
  Empty,
  Field,
  inputCls,
  Loading,
  Modal,
  Notice,
  PageTitle,
  Table,
  TableRow,
  Td,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/admin/api";
import { useAuth } from "@/lib/admin/auth";
import { useFetch } from "@/lib/admin/hooks";
import { isAdmin } from "@/lib/admin/roles";
import {
  emptyBi,
  ITEM_GROUPS,
  toBi,
  type ItemData,
  type ItemGroup,
  type ItemRec,
} from "@/lib/admin/types";
import { useState } from "react";

// which fields each group uses, and how to label them
const GROUPS: Record<
  ItemGroup,
  {
    label: string;
    hint: string;
    value?: string;
    icon?: boolean;
    title: string;
    text?: string;
  }
> = {
  stat: {
    label: "Numbers (home)",
    hint: "The figures in the journey section",
    value: "Value (e.g. 300+)",
    title: "Label",
    text: "Note",
  },
  principle: {
    label: "Principles",
    hint: "About page",
    icon: true,
    title: "Title",
    text: "Description",
  },
  goal: { label: "Goals", hint: "About page, numbered list", title: "Goal" },
  department: {
    label: "Departments",
    hint: "Departments page",
    title: "Name (without the word 'Department')",
  },
  roadmap: {
    label: "Roadmap",
    hint: "Future plans timeline",
    title: "Title",
    text: "Description",
  },
  joinWay: {
    label: "Ways to join",
    hint: "Join page",
    icon: true,
    title: "Title (e.g. Volunteer)",
    text: "Description",
  },
};

const blank = (group: ItemGroup, order: number): ItemData => ({
  group,
  order,
  published: true,
  icon: "",
  value: emptyBi(),
  title: emptyBi(),
  text: emptyBi(),
});

export default function ItemsPage() {
  const { user } = useAuth();
  const [group, setGroup] = useState<ItemGroup>("stat");
  const { data, loading, error, reload } = useFetch<ItemRec[]>("/items", {
    group,
    limit: 100,
  });
  const [editing, setEditing] = useState<{ id?: string; d: ItemData } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "error" | "success"; text: string }>();
  const [formErr, setFormErr] = useState("");
  const cfg = GROUPS[group];

  const openNew = () => setEditing({ d: blank(group, data?.length ?? 0) });
  const openEdit = (r: ItemRec) =>
    setEditing({
      id: r._id,
      d: {
        group: r.group,
        order: r.order,
        published: r.published,
        icon: r.icon ?? "",
        value: toBi(r.value),
        title: toBi(r.title),
        text: toBi(r.text),
      },
    });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    setFormErr("");
    try {
      if (editing.id)
        await api(`/items/${editing.id}`, { method: "PATCH", body: editing.d });
      else await api("/items", { method: "POST", body: editing.d });
      setEditing(null);
      setMsg({ tone: "success", text: "Saved" });
      reload();
    } catch (err) {
      setFormErr((err as Error).message);
    }
    setBusy(false);
  }

  async function remove(r: ItemRec) {
    if (!confirm(`Delete "${r.title.bn}"?`)) return;
    try {
      await api(`/items/${r._id}`, { method: "DELETE" });
      setMsg({ tone: "success", text: "Deleted" });
      reload();
    } catch (e) {
      setMsg({ tone: "error", text: (e as Error).message });
    }
  }

  const d = editing?.d;
  const upd = (patch: Partial<ItemData>) =>
    setEditing((s) => (s ? { ...s, d: { ...s.d, ...patch } } : s));

  return (
    <>
      <PageTitle
        title="Content items"
        sub={cfg.hint}
        action={<Btn onClick={openNew}>+ Add {cfg.label.toLowerCase()}</Btn>}
      />
      <Tabs
        value={group}
        onValueChange={(value) => setGroup(value as ItemGroup)}
        className="mb-5"
      >
        <TabsList>
          {ITEM_GROUPS.map((g) => (
            <TabsTrigger key={g} value={g}>
              {GROUPS[g].label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={group}>
          {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
          {error && <Notice>{error}</Notice>}
          {loading && !data ? (
            <Loading />
          ) : (
            <Table
              head={[
                "Order",
                ...(cfg.value ? ["Value"] : []),
                "Text (বাংলা / English)",
                "Visible",
                "",
              ]}
            >
              {data?.length ? (
                data.map((r) => (
                  <TableRow key={r._id}>
                    <Td>{r.order}</Td>
                    {cfg.value && (
                      <Td className="font-semibold">
                        {r.value?.bn}
                        <span className="block text-xs text-ink/60">
                          {r.value?.en}
                        </span>
                      </Td>
                    )}
                    <Td>
                      {r.icon && <span className="mr-2 text-lg">{r.icon}</span>}
                      <span className="font-semibold">{r.title.bn}</span>
                      <span className="block text-xs text-ink/60">
                        {r.title.en}
                      </span>
                    </Td>
                    <Td>
                      {r.published ? (
                        "Yes"
                      ) : (
                        <span className="text-ink/50">Hidden</span>
                      )}
                    </Td>
                    <Td className="space-x-3 whitespace-nowrap text-right">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => openEdit(r)}
                      >
                        Edit
                      </Button>
                      {user && isAdmin(user.role) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(r)}
                        >
                          Delete
                        </Button>
                      )}
                    </Td>
                  </TableRow>
                ))
              ) : (
                <Empty cols={cfg.value ? 5 : 4} />
              )}
            </Table>
          )}
        </TabsContent>
      </Tabs>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={`${editing?.id ? "Edit" : "Add"} · ${cfg.label}`}
        wide
      >
        {d && (
          <form onSubmit={save} className="space-y-4">
            {formErr && <Notice>{formErr}</Notice>}
            {cfg.value && (
              <BiField
                label={cfg.value}
                value={d.value}
                onChange={(v) => upd({ value: v })}
              />
            )}
            {cfg.icon && (
              <Field label="Icon (emoji)">
                <Input
                  value={d.icon}
                  maxLength={10}
                  onChange={(e) => upd({ icon: e.target.value })}
                  className={inputCls + " max-w-[8rem]"}
                />
              </Field>
            )}
            <BiField
              label={cfg.title}
              value={d.title}
              onChange={(v) => upd({ title: v })}
              hint="Bangla is required; English is optional"
            />
            {cfg.text && (
              <BiField
                label={cfg.text}
                value={d.text}
                onChange={(v) => upd({ text: v })}
                multiline
                rows={3}
              />
            )}
            <div className="flex items-end gap-6">
              <Field label="Order">
                <Input
                  type="number"
                  value={d.order}
                  onChange={(e) => upd({ order: Number(e.target.value) })}
                  className={inputCls + " w-28"}
                />
              </Field>
              <label className="flex items-center gap-2 pb-2 text-sm">
                <Checkbox
                  checked={d.published}
                  onCheckedChange={(checked) =>
                    upd({ published: checked === true })
                  }
                />{" "}
                Published
              </label>
            </div>
            <div className="flex gap-3">
              <Btn disabled={busy}>{busy ? "Saving…" : "Save"}</Btn>
              <Btn
                type="button"
                variant="ghost"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Btn>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
