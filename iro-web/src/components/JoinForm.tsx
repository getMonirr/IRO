"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import type { Dict } from "@/lib/content/bn";

const TYPE_KEYS = ["volunteer", "member", "donor", "partner"];

export function JoinForm({ locale, f }: { locale: string; f: Dict["ui"]["form"] }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    try {
      await apiPost("/api/v1/join-requests", { ...data, lang: locale });
      setState("done");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : f.retry);
      setState("error");
    }
  }

  if (state === "done") return <p className="rounded border border-gold bg-sand p-6">{f.done}</p>;

  const field = "mt-1 w-full rounded border border-brand/30 bg-white px-3 py-2 focus:border-brand";
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded border border-gold/60 bg-white p-6">
      <label className="block text-sm font-semibold">{f.name}<input name="name" required className={field} /></label>
      <label className="block text-sm font-semibold">{f.contact}<input name="contact" required className={field} /></label>
      <label className="block text-sm font-semibold">{f.type}
        <select name="type" className={field}>{f.types.map((x, i) => <option key={x} value={TYPE_KEYS[i]}>{x}</option>)}</select>
      </label>
      <label className="block text-sm font-semibold">{f.message}<textarea name="message" rows={4} className={field} /></label>
      {state === "error" && <p role="alert" className="text-sm text-red-700">{msg}</p>}
      <button disabled={state === "sending"} className="rounded-full bg-brand px-6 py-2 font-semibold text-cream hover:bg-brand-dark disabled:opacity-60">
        {state === "sending" ? f.sending : f.send}
      </button>
    </form>
  );
}
