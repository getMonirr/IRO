"use client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BiField,
  Btn,
  Card,
  inputCls,
  Loading,
  Notice,
  PageTitle,
} from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { useFetch } from "@/lib/admin/hooks";
import { bn as defBn } from "@/lib/content/bn";
import { en as defEn } from "@/lib/content/en";
import { resolveTheme, themeStyle, type ThemeTokens } from "@/lib/theme";
import { useState } from "react";

type Key = "site" | "nav" | "ui";
type Tab = Key | "contact" | "theme";
type Rec = { key: Key | "theme"; value: any };
const base: Record<Key, { bn: any; en: any }> = {
  site: { bn: defBn.site, en: defEn.site },
  nav: { bn: defBn.nav, en: defEn.nav },
  ui: { bn: defBn.ui, en: defEn.ui },
};

const isObj = (v: any) => v && typeof v === "object" && !Array.isArray(v);
/** saved values on top of the built-in defaults, so every key is editable even if the database lacks it */
function merge(b: any, o: any): any {
  if (Array.isArray(b)) {
    if (!Array.isArray(o) || !o.length) return b;
    return o.map((x, i) => (i < b.length ? merge(b[i], x) : x));
  }
  if (isObj(b)) {
    const out = { ...b };
    if (isObj(o))
      for (const k of Object.keys(o))
        out[k] = k in b ? merge(b[k], o[k]) : o[k];
    return out;
  }
  return typeof o === typeof b && o != null ? o : b;
}
function flatten(v: any, prefix = "", out: Record<string, string> = {}) {
  if (typeof v === "string") out[prefix] = v;
  else if (Array.isArray(v))
    v.forEach((x, i) => flatten(x, prefix ? `${prefix}.${i}` : String(i), out));
  else if (isObj(v))
    for (const [k, x] of Object.entries(v))
      flatten(x, prefix ? `${prefix}.${k}` : k, out);
  return out;
}
function setPath(obj: any, path: string, value: string) {
  const keys = path.split(".");
  let cur = obj;
  for (const k of keys.slice(0, -1)) cur = cur?.[k];
  if (cur) cur[keys[keys.length - 1]] = value;
}

function useSave(key: Key) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "error" | "success"; text: string }>();
  async function save(bn: any, en: any) {
    setBusy(true);
    setMsg(undefined);
    try {
      await api(`/settings/${key}`, { method: "PUT", body: { bn, en } });
      setMsg({
        tone: "success",
        text: "Saved. The website updates within a minute.",
      });
    } catch (e) {
      setMsg({ tone: "error", text: (e as Error).message });
    }
    setBusy(false);
  }
  return { save, busy, msg };
}

function SiteTab({ bn, en }: { bn: any; en: any }) {
  const [b, setB] = useState(bn);
  const [e, setE] = useState(en);
  const { save, busy, msg } = useSave("site");
  const fields: [string, string][] = [
    ["name", "Organization name"],
    ["short", "Short name"],
    ["tagline", "Tagline"],
    ["motto", "Motto"],
  ];
  return (
    <Card className="space-y-4">
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      {fields.map(([k, label]) => (
        <BiField
          key={k}
          label={label}
          value={{ bn: b[k] ?? "", en: e[k] ?? "" }}
          onChange={(v) => {
            setB({ ...b, [k]: v.bn });
            setE({ ...e, [k]: v.en });
          }}
        />
      ))}
      <Btn disabled={busy} onClick={() => save(b, e)}>
        {busy ? "Saving…" : "Save"}
      </Btn>
    </Card>
  );
}

function NavTab({ bn, en }: { bn: any[]; en: any[] }) {
  const [b, setB] = useState(bn);
  const [e, setE] = useState(en);
  const { save, busy, msg } = useSave("nav");
  return (
    <Card className="space-y-4">
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      {b.map((item, i) => (
        <BiField
          key={item.href}
          label={`Menu: ${item.href}`}
          value={{ bn: item.label, en: e[i]?.label ?? "" }}
          onChange={(v) => {
            setB(b.map((x, j) => (j === i ? { ...x, label: v.bn } : x)));
            setE(e.map((x, j) => (j === i ? { ...x, label: v.en } : x)));
          }}
        />
      ))}
      <Btn disabled={busy} onClick={() => save(b, e)}>
        {busy ? "Saving…" : "Save"}
      </Btn>
    </Card>
  );
}

function ContactTab({ bn, en }: { bn: any; en: any }) {
  const [b, setB] = useState(bn);
  const [e, setE] = useState(en);
  const { save, busy, msg } = useSave("ui");
  const items = Array.from({
    length: Math.max(b.items?.length ?? 0, e.items?.length ?? 0),
  });

  function update(
    index: number,
    field: "icon" | "label" | "value",
    lang: "bn" | "en",
    value: string,
  ) {
    const set = lang === "bn" ? setB : setE;
    const current = lang === "bn" ? b : e;
    const nextItems = [...(current.items ?? [])];
    nextItems[index] = { ...(nextItems[index] ?? {}), [field]: value };
    set({ ...current, items: nextItems });
  }

  return (
    <Card className="space-y-5">
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      {items.map((_, i) => (
        <div
          key={i}
          className="space-y-3 border-b border-gold/20 pb-5 last:border-0 last:pb-0"
        >
          <p className="font-semibold text-brand">Contact {i + 1}</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              aria-label={`Bangla icon ${i + 1}`}
              value={b.items?.[i]?.icon ?? ""}
              onChange={(ev) => update(i, "icon", "bn", ev.target.value)}
              className={inputCls}
              placeholder="Bangla icon"
            />
            <Input
              aria-label={`English icon ${i + 1}`}
              value={e.items?.[i]?.icon ?? ""}
              onChange={(ev) => update(i, "icon", "en", ev.target.value)}
              className={inputCls}
              placeholder="English icon"
            />
            <Input
              aria-label={`Bangla label ${i + 1}`}
              value={b.items?.[i]?.label ?? ""}
              onChange={(ev) => update(i, "label", "bn", ev.target.value)}
              className={inputCls}
              placeholder="Bangla label"
            />
            <Input
              aria-label={`English label ${i + 1}`}
              value={e.items?.[i]?.label ?? ""}
              onChange={(ev) => update(i, "label", "en", ev.target.value)}
              className={inputCls}
              placeholder="English label"
            />
            <Input
              aria-label={`Bangla value ${i + 1}`}
              value={b.items?.[i]?.value ?? ""}
              onChange={(ev) => update(i, "value", "bn", ev.target.value)}
              className={inputCls}
              placeholder="Bangla value"
            />
            <Input
              aria-label={`English value ${i + 1}`}
              value={e.items?.[i]?.value ?? ""}
              onChange={(ev) => update(i, "value", "en", ev.target.value)}
              className={inputCls}
              placeholder="English value"
            />
          </div>
        </div>
      ))}
      <Btn
        disabled={busy}
        onClick={() =>
          save({ ...bn, items: b.items }, { ...en, items: e.items })
        }
      >
        {busy ? "Saving…" : "Save contact info"}
      </Btn>
    </Card>
  );
}

function UiTab({ bn, en }: { bn: any; en: any }) {
  const [fb, setFb] = useState(flatten(bn));
  const [fe, setFe] = useState(flatten(en));
  const [q, setQ] = useState("");
  const { save, busy, msg } = useSave("ui");
  const paths = Array.from(new Set([...Object.keys(fb), ...Object.keys(fe)]));
  const shown = paths.filter(
    (p) =>
      !q ||
      `${p} ${fb[p] ?? ""} ${fe[p] ?? ""}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const sections = Array.from(new Set(shown.map((p) => p.split(".")[0])));

  function onSave() {
    const nb = structuredClone(bn),
      ne = structuredClone(en);
    for (const [p, v] of Object.entries(fb)) setPath(nb, p, v);
    for (const [p, v] of Object.entries(fe)) setPath(ne, p, v);
    save(nb, ne);
  }
  const cell = (val: string, lang: "bn" | "en", p: string) => {
    const set = lang === "bn" ? setFb : setFe;
    const cur = lang === "bn" ? fb : fe;
    const long = (fb[p] ?? "").length > 70 || (fe[p] ?? "").length > 70;
    return long ? (
      <Textarea
        lang={lang}
        rows={3}
        value={val}
        onChange={(e) => set({ ...cur, [p]: e.target.value })}
        className={inputCls}
      />
    ) : (
      <Input
        lang={lang}
        value={val}
        onChange={(e) => set({ ...cur, [p]: e.target.value })}
        className={inputCls}
      />
    );
  };

  return (
    <div className="space-y-4">
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <Input
        placeholder="Filter by key or text…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className={inputCls + " max-w-sm"}
      />
      {sections.map((s) => (
        <details
          key={s}
          open={!!q}
          className="rounded-lg border border-gold/30 bg-card"
        >
          <summary className="cursor-pointer px-5 py-3 font-display font-bold capitalize text-brand">
            {s}
          </summary>
          <div className="space-y-4 border-t border-gold/20 p-5">
            {shown
              .filter((p) => p.split(".")[0] === s)
              .map((p) => (
                <div key={p}>
                  <code className="text-xs text-ink/55">{p}</code>
                  <div className="mt-1 grid gap-2 md:grid-cols-2">
                    {cell(fb[p] ?? "", "bn", p)}
                    {cell(fe[p] ?? "", "en", p)}
                  </div>
                </div>
              ))}
          </div>
        </details>
      ))}
      {!sections.length && <p className="text-sm text-ink/60">No matches.</p>}
      <div className="sticky bottom-4">
        <Btn disabled={busy} onClick={onSave} className="shadow-lg">
          {busy ? "Saving…" : "Save all texts"}
        </Btn>
      </div>
    </div>
  );
}

const themeFields: { key: keyof ThemeTokens; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "primaryForeground", label: "Primary text" },
  { key: "secondary", label: "Secondary" },
  { key: "secondaryForeground", label: "Secondary text" },
  { key: "accent", label: "Accent" },
  { key: "accentForeground", label: "Accent text" },
  { key: "background", label: "Page background" },
  { key: "foreground", label: "Page text" },
  { key: "muted", label: "Muted background" },
  { key: "mutedForeground", label: "Muted text" },
  { key: "card", label: "Card background" },
  { key: "cardForeground", label: "Card text" },
  { key: "destructive", label: "Destructive" },
  { key: "destructiveForeground", label: "Destructive text" },
  { key: "border", label: "Border" },
  { key: "ring", label: "Focus ring" },
];

const contrastPairs: [keyof ThemeTokens, keyof ThemeTokens, string][] = [
  ["primary", "primaryForeground", "Primary"],
  ["secondary", "secondaryForeground", "Secondary"],
  ["accent", "accentForeground", "Accent"],
  ["background", "foreground", "Page"],
  ["background", "primary", "Brand text on page"],
  ["card", "primary", "Brand text on cards"],
  ["muted", "mutedForeground", "Muted"],
  ["card", "cardForeground", "Card"],
  ["destructive", "destructiveForeground", "Destructive"],
];

function contrastRatio(first: string, second: string) {
  const luminance = (hex: string) => {
    const channels = hex
      .slice(1)
      .match(/.{2}/g)!
      .map((channel) => parseInt(channel, 16) / 255)
      .map((channel) =>
        channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4,
      );
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function ThemeTab({ initialTheme }: { initialTheme: ThemeTokens }) {
  const [theme, setTheme] = useState(initialTheme);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    tone: "error" | "success";
    text: string;
  }>();
  const failures = contrastPairs.filter(
    ([background, foreground]) =>
      contrastRatio(theme[background], theme[foreground]) < 4.5,
  );

  async function saveTheme() {
    setBusy(true);
    setMessage(undefined);
    try {
      await api("/settings/theme", { method: "PUT", body: { value: theme } });
      setMessage({
        tone: "success",
        text: "Theme saved and applied to the website.",
      });
    } catch (error) {
      setMessage({ tone: "error", text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      {failures.length > 0 && (
        <Notice>
          Increase contrast to at least 4.5:1 for{" "}
          {failures.map(([, , label]) => label).join(", ")} text/background
          pairs before saving.
        </Notice>
      )}
      <Card className="space-y-5">
        <div>
          <h2 className="font-semibold text-foreground">Brand color tokens</h2>
          <p className="text-sm text-muted-foreground">
            Changes apply to public pages and the dashboard.
          </p>
        </div>
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {themeFields.map(({ key, label }) => (
            <label
              key={key}
              htmlFor={`theme-${key}`}
              className="block text-sm font-medium text-foreground"
            >
              {label}
              <span className="mt-1 flex items-center gap-3">
                <Input
                  id={`theme-${key}`}
                  type="color"
                  value={theme[key]}
                  onChange={(event) =>
                    setTheme({ ...theme, [key]: event.target.value })
                  }
                  className="h-10 w-14 cursor-pointer rounded border border-input bg-background p-1"
                />
                <code className="text-xs text-muted-foreground">
                  {theme[key]}
                </code>
              </span>
            </label>
          ))}
        </div>
      </Card>
      <div
        style={themeStyle(theme)}
        className="rounded-lg border border-border bg-background p-5 text-foreground"
      >
        <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
          Live preview
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Primary action
          </span>
          <span className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
            Secondary
          </span>
          <span className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
            Accent
          </span>
          <span className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
            Destructive
          </span>
        </div>
        <div className="mt-4 rounded-md border border-border bg-card p-4 text-card-foreground">
          <p className="font-semibold">Card surface</p>
          <p className="text-sm text-muted-foreground">
            Muted text and borders preview here.
          </p>
        </div>
      </div>
      <div className="sticky bottom-4">
        <Btn
          disabled={busy || failures.length > 0}
          onClick={saveTheme}
          className="shadow-lg"
        >
          {busy ? "Saving…" : "Save theme"}
        </Btn>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data, loading, error } = useFetch<Rec[]>("/settings");
  const [tab, setTab] = useState<Tab>("site");
  if (loading) return <Loading />;
  const val = (k: Key, l: "bn" | "en") =>
    merge(base[k][l], data?.find((s) => s.key === k)?.value?.[l]);
  const tabs: [Tab, string][] = [
    ["site", "Site info"],
    ["nav", "Menu"],
    ["contact", "Contact info"],
    ["ui", "Page & button texts"],
    ["theme", "Theme"],
  ];
  return (
    <>
      <PageTitle
        title="Site settings"
        sub="Manage site copy and brand colors. Programs and lists are under their own sections."
      />
      {error && <Notice>{error}</Notice>}
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as Tab)}
        className="gap-5"
      >
        <TabsList className="flex-wrap">
          {tabs.map(([k, label]) => (
            <TabsTrigger key={k} value={k}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="site">
          <SiteTab bn={val("site", "bn")} en={val("site", "en")} />
        </TabsContent>
        <TabsContent value="nav">
          <NavTab bn={val("nav", "bn")} en={val("nav", "en")} />
        </TabsContent>
        <TabsContent value="contact">
          <ContactTab
            bn={val("ui", "bn").contact}
            en={val("ui", "en").contact}
          />
        </TabsContent>
        <TabsContent value="ui">
          <UiTab bn={val("ui", "bn")} en={val("ui", "en")} />
        </TabsContent>
        <TabsContent value="theme">
          <ThemeTab
            initialTheme={resolveTheme(
              data?.find((setting) => setting.key === "theme")?.value,
            )}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
