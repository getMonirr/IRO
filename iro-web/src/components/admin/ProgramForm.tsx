"use client";
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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/admin/api";
import {
  emptyBi,
  toBi,
  type Bi,
  type ProgramData,
  type ProgramRec,
} from "@/lib/admin/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiField, Btn, Card, Field, inputCls, Notice } from "./ui";

const blank = (): ProgramData => ({
  slug: "",
  icon: "",
  order: 0,
  status: "ongoing",
  published: true,
  title: emptyBi(),
  short: emptyBi(),
  body: emptyBi(),
  tagline: emptyBi(),
  points: [],
  figures: [],
  ayah: { arabic: "", text: emptyBi(), source: emptyBi() },
});

const normalize = (p: ProgramRec): ProgramData => ({
  slug: p.slug,
  icon: p.icon ?? "",
  order: p.order ?? 0,
  status: p.status ?? "ongoing",
  published: p.published ?? true,
  title: toBi(p.title),
  short: toBi(p.short),
  body: toBi(p.body),
  tagline: toBi(p.tagline),
  points: (p.points ?? []).map(toBi),
  figures: (p.figures ?? []).map((f) => ({
    value: toBi(f.value),
    label: toBi(f.label),
  })),
  ayah: {
    arabic: p.ayah?.arabic ?? "",
    text: toBi(p.ayah?.text),
    source: toBi(p.ayah?.source),
  },
});

export function ProgramForm({ initial }: { initial?: ProgramRec }) {
  const router = useRouter();
  const [d, setD] = useState<ProgramData>(
    initial ? normalize(initial) : blank(),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof ProgramData>(k: K, v: ProgramData[K]) =>
    setD((s) => ({ ...s, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (initial)
        await api(`/programs/${initial._id}`, { method: "PATCH", body: d });
      else await api("/programs", { method: "POST", body: d });
      router.push("/admin/programs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
      setBusy(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {error && <Notice>{error}</Notice>}
      <Card className="space-y-4">
        <h2 className="font-display text-lg font-bold text-brand">Basics</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Slug (URL)" hint="/programs/<slug>">
            <Input
              required
              value={d.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase())}
              className={inputCls}
              placeholder="quran"
            />
          </Field>
          <Field label="Icon (emoji)">
            <Input
              value={d.icon}
              onChange={(e) => set("icon", e.target.value)}
              className={inputCls}
              maxLength={10}
            />
          </Field>
          <Field label="Order">
            <Input
              type="number"
              value={d.order}
              onChange={(e) => set("order", Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Status">
            <Select
              value={d.status}
              onValueChange={(value) =>
                value && set("status", value as ProgramData["status"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={d.published}
            onCheckedChange={(checked) => set("published", checked === true)}
          />{" "}
          Published (visible on the website)
        </label>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-lg font-bold text-brand">Text</h2>
        <BiField
          label="Title"
          value={d.title}
          onChange={(v) => set("title", v)}
          hint="Bangla is required; English is optional"
        />
        <BiField
          label="Short description (card)"
          value={d.short}
          onChange={(v) => set("short", v)}
          multiline
          rows={2}
        />
        <BiField
          label="Tagline (details page header)"
          value={d.tagline}
          onChange={(v) => set("tagline", v)}
        />
        <BiField
          label="Full description"
          value={d.body}
          onChange={(v) => set("body", v)}
          multiline
          rows={6}
        />
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand">
            What we do (bullet points)
          </h2>
          <Btn
            type="button"
            variant="ghost"
            onClick={() => set("points", [...d.points, emptyBi()])}
          >
            + Add point
          </Btn>
        </div>
        {d.points.map((p, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex-1">
              <BiField
                label={`Point ${i + 1}`}
                value={p}
                onChange={(v) =>
                  set(
                    "points",
                    d.points.map((x, j) => (j === i ? v : x)),
                  )
                }
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() =>
                set(
                  "points",
                  d.points.filter((_, j) => j !== i),
                )
              }
            >
              Remove
            </Button>
          </div>
        ))}
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand">
            Numbers (side card)
          </h2>
          <Btn
            type="button"
            variant="ghost"
            onClick={() =>
              set("figures", [
                ...d.figures,
                { value: emptyBi(), label: emptyBi() },
              ])
            }
          >
            + Add number
          </Btn>
        </div>
        {d.figures.map((f, i) => (
          <div key={i} className="flex gap-3 rounded border border-gold/30 p-3">
            <div className="flex-1 space-y-3">
              <BiField
                label="Value (e.g. 300+ / ৩০০+)"
                value={f.value}
                onChange={(v) =>
                  set(
                    "figures",
                    d.figures.map((x, j) => (j === i ? { ...x, value: v } : x)),
                  )
                }
              />
              <BiField
                label="Label"
                value={f.label}
                onChange={(v) =>
                  set(
                    "figures",
                    d.figures.map((x, j) => (j === i ? { ...x, label: v } : x)),
                  )
                }
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() =>
                set(
                  "figures",
                  d.figures.filter((_, j) => j !== i),
                )
              }
            >
              Remove
            </Button>
          </div>
        ))}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-lg font-bold text-brand">
          Ayah or hadith
        </h2>
        <Field label="Arabic text">
          <Textarea
            dir="rtl"
            lang="ar"
            rows={2}
            value={d.ayah.arabic}
            onChange={(e) => set("ayah", { ...d.ayah, arabic: e.target.value })}
            className={inputCls + " font-arabic text-xl"}
          />
        </Field>
        <BiField
          label="Translation"
          value={d.ayah.text}
          onChange={(v: Bi) => set("ayah", { ...d.ayah, text: v })}
          multiline
          rows={2}
        />
        <BiField
          label="Source (e.g. Surah An-Nahl, 16:125)"
          value={d.ayah.source}
          onChange={(v: Bi) => set("ayah", { ...d.ayah, source: v })}
        />
      </Card>

      <div className="flex gap-3">
        <Btn disabled={busy}>
          {busy ? "Saving…" : initial ? "Save changes" : "Create program"}
        </Btn>
        <Btn
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/programs")}
        >
          Cancel
        </Btn>
      </div>
    </form>
  );
}
