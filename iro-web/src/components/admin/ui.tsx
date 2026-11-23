"use client";
import { useEffect, type ReactNode } from "react";
import type { Meta } from "@/lib/admin/api";
import type { Bi } from "@/lib/admin/types";

export const inputCls = "w-full rounded border border-brand/25 bg-white px-3 py-2 text-sm leading-normal focus:border-brand disabled:bg-sand/60";

export function Btn({ variant = "primary", className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const v = {
    primary: "bg-brand text-cream hover:bg-brand-dark",
    ghost: "border border-brand/30 text-brand hover:bg-sand",
    danger: "border border-red-300 text-red-700 hover:bg-red-50",
  }[variant];
  return <button {...p} className={`rounded px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${v} ${className}`} />;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-brand">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-ink/60">{hint}</span>}
    </label>
  );
}

/** Bangla + English inputs side by side */
export function BiField({ label, value, onChange, multiline, rows = 3, hint }: {
  label: string; value: Bi; onChange: (v: Bi) => void; multiline?: boolean; rows?: number; hint?: string;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="text-sm">
      <span className="font-semibold text-brand">{label}</span>
      <div className="mt-1 grid gap-2 md:grid-cols-2">
        {(["bn", "en"] as const).map((l) => (
          <div key={l} className="relative">
            <Tag
              className={inputCls + " pt-5"} rows={multiline ? rows : undefined} value={value[l]} lang={l}
              onChange={(e) => onChange({ ...value, [l]: e.target.value })} aria-label={`${label} (${l === "bn" ? "Bangla" : "English"})`}
            />
            <span className="pointer-events-none absolute left-3 top-1 text-[10px] font-semibold uppercase tracking-wide text-gold">{l === "bn" ? "বাংলা" : "English"}</span>
          </div>
        ))}
      </div>
      {hint && <span className="mt-1 block text-xs text-ink/60">{hint}</span>}
    </div>
  );
}

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-lg border border-gold/30 bg-white p-5 shadow-sm ${className}`}>{children}</div>
);

export const PageTitle = ({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="font-display text-2xl font-bold text-brand">{title}</h1>
      {sub && <p className="text-sm text-ink/70">{sub}</p>}
    </div>
    {action}
  </div>
);

export function Notice({ tone = "error", children }: { tone?: "error" | "success" | "info"; children: ReactNode }) {
  const c = { error: "border-red-300 bg-red-50 text-red-800", success: "border-green-300 bg-green-50 text-green-800", info: "border-gold bg-sand text-ink" }[tone];
  return <div role={tone === "error" ? "alert" : "status"} className={`mb-4 rounded border px-4 py-2 text-sm ${c}`}>{children}</div>;
}

export function Badge({ tone = "gray", children }: { tone?: "gray" | "green" | "gold" | "red"; children: ReactNode }) {
  const c = { gray: "bg-sand text-ink/70", green: "bg-green-100 text-green-800", gold: "bg-gold-soft text-brand-dark", red: "bg-red-100 text-red-800" }[tone];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>{children}</span>;
}

export const Loading = ({ full }: { full?: boolean }) => (
  <div className={`grid place-items-center text-sm text-ink/60 ${full ? "min-h-screen" : "py-10"}`}>Loading…</div>
);

export function Modal({ open, title, onClose, children, wide }: { open: boolean; title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}
        className={`my-8 w-full rounded-lg bg-cream p-6 shadow-xl ${wide ? "max-w-3xl" : "max-w-lg"}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-brand">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none text-ink/60 hover:text-ink">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Pager({ meta, onPage }: { meta?: Meta; onPage: (p: number) => void }) {
  if (!meta || meta.totalPage <= 1) return meta ? <p className="mt-3 text-xs text-ink/60">{meta.total} total</p> : null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-ink/60">{meta.total} total · page {meta.page} of {meta.totalPage}</span>
      <div className="flex gap-2">
        <Btn variant="ghost" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>Previous</Btn>
        <Btn variant="ghost" disabled={meta.page >= meta.totalPage} onClick={() => onPage(meta.page + 1)}>Next</Btn>
      </div>
    </div>
  );
}

export const Table = ({ head, children }: { head: string[]; children: ReactNode }) => (
  <div className="overflow-x-auto rounded-lg border border-gold/30 bg-white">
    <table className="w-full text-left text-sm">
      <thead className="bg-sand text-xs uppercase tracking-wide text-brand">
        <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gold/20">{children}</tbody>
    </table>
  </div>
);
export const Td = ({ children, className = "" }: { children?: ReactNode; className?: string }) => <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
export const Empty = ({ cols, children = "Nothing here yet." }: { cols: number; children?: ReactNode }) => (
  <tr><td colSpan={cols} className="px-4 py-10 text-center text-ink/60">{children}</td></tr>
);
