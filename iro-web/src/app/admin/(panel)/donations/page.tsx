"use client";
import { TableRow } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  BiField,
  Btn,
  Card,
  Empty,
  Field,
  inputCls,
  Loading,
  Notice,
  PageTitle,
  Table,
  Td,
} from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { useFetch } from "@/lib/admin/hooks";
import {
  emptyBi,
  toBi,
  type Bi,
  type DonationRec,
  type DonationRegion,
  type DonationType,
} from "@/lib/admin/types";
import { useState } from "react";

type DonationData = Omit<DonationRec, "_id">;

const blank = (): DonationData => ({
  slug: "",
  region: "bangladesh",
  type: "mobile-banking",
  name: emptyBi(),
  provider: "",
  accountName: emptyBi(),
  accountNumber: "",
  instructions: emptyBi(),
  checkoutUrl: "",
  currency: "BDT",
  enabled: false,
  order: 0,
});

const normalize = (method: DonationRec): DonationData => ({
  ...method,
  name: toBi(method.name),
  accountName: toBi(method.accountName),
  instructions: toBi(method.instructions),
});

export default function DonationsPage() {
  const { data, loading, error, reload } = useFetch<DonationRec[]>(
    "/donations/methods",
    { limit: 100 },
  );
  const [draft, setDraft] = useState<DonationData>(blank());
  const [editing, setEditing] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    tone: "error" | "success";
    text: string;
  }>();
  const set = <K extends keyof DonationData>(key: K, value: DonationData[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  function edit(method: DonationRec) {
    setEditing(method._id);
    setDraft(normalize(method));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditing(undefined);
    setDraft(blank());
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(undefined);
    try {
      const payload = { ...draft, order: Number(draft.order) };
      if (editing)
        await api(`/donations/methods/${editing}`, {
          method: "PATCH",
          body: payload,
        });
      else await api("/donations/methods", { method: "POST", body: payload });
      setMessage({
        tone: "success",
        text: "Donation method saved. The public page will update shortly.",
      });
      reset();
      reload();
    } catch (e) {
      setMessage({
        tone: "error",
        text: e instanceof Error ? e.message : "Could not save donation method",
      });
    } finally {
      setBusy(false);
    }
  }

  async function remove(method: DonationRec) {
    if (!window.confirm(`Delete ${method.name.en || method.name.bn}?`)) return;
    try {
      await api(`/donations/methods/${method._id}`, { method: "DELETE" });
      setMessage({ tone: "success", text: "Donation method deleted." });
      reload();
    } catch (e) {
      setMessage({
        tone: "error",
        text:
          e instanceof Error ? e.message : "Could not delete donation method",
      });
    }
  }

  if (loading) return <Loading />;
  return (
    <>
      <PageTitle
        title="Donations"
        sub="Manage the payment instructions shown to donors. No payment credentials are processed by the website."
      />
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      {error && <Notice>{error}</Notice>}
      <form onSubmit={save} className="mb-8 space-y-5">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-brand">
              {editing ? "Edit payment method" : "Add payment method"}
            </h2>
            {editing && (
              <Btn type="button" variant="ghost" onClick={reset}>
                New method
              </Btn>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Slug">
              <Input
                required
                value={draft.slug}
                onChange={(e) => set("slug", e.target.value.toLowerCase())}
                className={inputCls}
                placeholder="bkash-personal"
              />
            </Field>
            <Field label="Region">
              <Select
                value={draft.region}
                onValueChange={(value) =>
                  value && set("region", value as DonationRegion)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="abroad">Abroad</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Payment type">
              <Select
                value={draft.type}
                onValueChange={(value) =>
                  value && set("type", value as DonationType)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile-banking">Mobile banking</SelectItem>
                  <SelectItem value="bank-transfer">Bank transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Display order">
              <Input
                type="number"
                value={draft.order}
                onChange={(e) => set("order", Number(e.target.value))}
                className={inputCls}
              />
            </Field>
          </div>
          <BiField
            label="Payment method name"
            value={draft.name}
            onChange={(value: Bi) => set("name", value)}
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Provider">
              <Input
                value={draft.provider}
                onChange={(e) => set("provider", e.target.value)}
                className={inputCls}
                placeholder="bKash, Bank, PayPal"
              />
            </Field>
            <Field label="Currency">
              <Input
                required
                value={draft.currency}
                onChange={(e) => set("currency", e.target.value.toUpperCase())}
                className={inputCls}
                placeholder="BDT"
              />
            </Field>
            <Field
              label="Account / checkout URL"
              hint="Optional secure external payment link"
            >
              <Input
                type="url"
                value={draft.checkoutUrl}
                onChange={(e) => set("checkoutUrl", e.target.value)}
                className={inputCls}
                placeholder="https://..."
              />
            </Field>
          </div>
          <BiField
            label="Account name"
            value={draft.accountName}
            onChange={(value: Bi) => set("accountName", value)}
          />
          <Field label="Account number or identifier">
            <Input
              value={draft.accountNumber}
              onChange={(e) => set("accountNumber", e.target.value)}
              className={inputCls}
            />
          </Field>
          <BiField
            label="Donor instructions"
            value={draft.instructions}
            onChange={(value: Bi) => set("instructions", value)}
            multiline
            rows={3}
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-brand">
            <Checkbox
              checked={draft.enabled}
              onCheckedChange={(checked) => set("enabled", checked === true)}
            />
            Show this method publicly
          </label>
          <Btn disabled={busy}>
            {busy ? "Saving…" : editing ? "Save changes" : "Add payment method"}
          </Btn>
        </Card>
      </form>

      <Table
        head={["Method", "Region", "Type", "Currency", "Status", "Actions"]}
      >
        {!data?.length && <Empty cols={6}>No payment methods yet.</Empty>}
        {data?.map((method) => (
          <TableRow key={method._id}>
            <Td>
              <strong>{method.name.en || method.name.bn}</strong>
              <span className="block text-xs text-ink/60">{method.slug}</span>
            </Td>
            <Td>{method.region}</Td>
            <Td>{method.type}</Td>
            <Td>{method.currency}</Td>
            <Td>{method.enabled ? "Visible" : "Hidden"}</Td>
            <Td className="space-x-3 whitespace-nowrap">
              <Button
                type="button"
                onClick={() => edit(method)}
                variant="link"
                size="sm"
              >
                Edit
              </Button>
              <Button
                type="button"
                onClick={() => remove(method)}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </Td>
          </TableRow>
        ))}
      </Table>
    </>
  );
}
