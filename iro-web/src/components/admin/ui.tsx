"use client";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, Card as ShadcnCard } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Meta } from "@/lib/admin/api";
import type { Bi } from "@/lib/admin/types";
import { type ReactNode } from "react";

export const inputCls = "w-full";

export function Btn({
  variant = "primary",
  className = "",
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const v = {
    primary: { variant: "default" as const, className: "hover:bg-brand-dark" },
    ghost: { variant: "outline" as const, className: "text-primary" },
    danger: { variant: "destructive" as const, className: "" },
  }[variant];
  return (
    <Button
      {...p}
      variant={v.variant}
      className={`${v.className} ${className}`}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Label className="block text-sm">
      <span className="font-semibold text-foreground">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && (
        <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
      )}
    </Label>
  );
}

/** Bangla + English inputs side by side */
export function BiField({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
  hint,
}: {
  label: string;
  value: Bi;
  onChange: (v: Bi) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="text-sm">
      <Label className="font-semibold text-foreground">{label}</Label>
      <div className="mt-1 grid gap-2 md:grid-cols-2">
        {(["bn", "en"] as const).map((l) => (
          <div key={l} className="relative">
            {multiline ? (
              <Textarea
                className={inputCls + " pt-5"}
                rows={rows}
                value={value[l]}
                lang={l}
                onChange={(e) => onChange({ ...value, [l]: e.target.value })}
                aria-label={`${label} (${l === "bn" ? "Bangla" : "English"})`}
              />
            ) : (
              <Input
                className={inputCls + " pt-5"}
                value={value[l]}
                lang={l}
                onChange={(e) => onChange({ ...value, [l]: e.target.value })}
                aria-label={`${label} (${l === "bn" ? "Bangla" : "English"})`}
              />
            )}
            <span className="pointer-events-none absolute left-3 top-1 text-[10px] font-semibold uppercase tracking-wide text-gold">
              {l === "bn" ? "বাংলা" : "English"}
            </span>
          </div>
        ))}
      </div>
      {hint && (
        <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
      )}
    </div>
  );
}

export const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <ShadcnCard className={className}>
    <CardContent className="pt-4">{children}</CardContent>
  </ShadcnCard>
);

export const PageTitle = ({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
    </div>
    {action}
  </div>
);

export function Notice({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: ReactNode;
}) {
  const variant = {
    error: "destructive",
    success: "secondary",
    info: "outline",
  }[tone] as "destructive" | "secondary" | "outline";
  return (
    <div role={tone === "error" ? "alert" : "status"} className="mb-4">
      <ShadcnBadge
        variant={variant}
        className="h-auto whitespace-normal px-3 py-2 text-left"
      >
        {children}
      </ShadcnBadge>
    </div>
  );
}

export function Badge({
  tone = "gray",
  children,
}: {
  tone?: "gray" | "green" | "gold" | "red";
  children: ReactNode;
}) {
  const variant = (
    {
      gray: "outline",
      green: "default",
      gold: "secondary",
      red: "destructive",
    } as const
  )[tone];
  return <ShadcnBadge variant={variant}>{children}</ShadcnBadge>;
}

export const Loading = ({ full }: { full?: boolean }) => (
  <div
    className={`grid place-items-center text-sm text-muted-foreground ${full ? "min-h-screen" : "py-10"}`}
  >
    Loading…
  </div>
);

export function Modal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className={wide ? "sm:max-w-3xl" : "sm:max-w-lg"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function Pager({
  meta,
  onPage,
}: {
  meta?: Meta;
  onPage: (p: number) => void;
}) {
  if (!meta || meta.totalPage <= 1)
    return meta ? (
      <p className="mt-3 text-xs text-muted-foreground">{meta.total} total</p>
    ) : null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        {meta.total} total · page {meta.page} of {meta.totalPage}
      </span>
      <div className="flex gap-2">
        <Btn
          variant="ghost"
          disabled={meta.page <= 1}
          onClick={() => onPage(meta.page - 1)}
        >
          Previous
        </Btn>
        <Btn
          variant="ghost"
          disabled={meta.page >= meta.totalPage}
          onClick={() => onPage(meta.page + 1)}
        >
          Next
        </Btn>
      </div>
    </div>
  );
}

export const Table = ({
  head,
  children,
}: {
  head: string[];
  children: ReactNode;
}) => (
  <ShadcnTable>
    <TableHeader className="bg-muted text-xs uppercase text-muted-foreground">
      <TableRow>
        {head.map((heading) => (
          <TableHead key={heading} className="px-4 font-semibold">
            {heading}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>{children}</TableBody>
  </ShadcnTable>
);
export const Td = ({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <TableCell className={`px-4 py-3 align-top ${className}`}>
    {children}
  </TableCell>
);
export const Empty = ({
  cols,
  children = "Nothing here yet.",
}: {
  cols: number;
  children?: ReactNode;
}) => (
  <TableRow>
    <TableCell
      colSpan={cols}
      className="px-4 py-10 text-center text-muted-foreground"
    >
      {children}
    </TableCell>
  </TableRow>
);

export { TableRow };
