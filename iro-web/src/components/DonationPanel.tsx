"use client";

import { Reveal } from "@/components/Reveal";
import type { PublicDonationMethod } from "@/lib/content/bn";
import { useState } from "react";

type Brand = { mark: string; color: string };

function getBrand(method: PublicDonationMethod): Brand {
  const value = `${method.provider} ${method.name}`.toLowerCase();
  if (value.includes("bkash")) return { mark: "bK", color: "#e2136e" };
  if (value.includes("nagad")) return { mark: "N", color: "#f6921e" };
  if (value.includes("rocket")) return { mark: "R", color: "#7b2c8f" };
  if (value.includes("paypal")) return { mark: "P", color: "#003087" };
  if (value.includes("visa")) return { mark: "VISA", color: "#1a1f71" };
  if (value.includes("mastercard")) return { mark: "MC", color: "#eb001b" };
  if (method.type === "crypto") return { mark: "₿", color: "#f7931a" };
  if (method.type === "bank-transfer")
    return { mark: "BANK", color: "#1f5b4b" };
  if (method.type === "card") return { mark: "CARD", color: "#315c9b" };
  return { mark: "৳", color: "#8a6a20" };
}

export function DonationPanel({
  methods,
  labels,
}: {
  methods: PublicDonationMethod[];
  labels: {
    methods: string;
    bangladesh: string;
    abroad: string;
    accountName: string;
    accountNumber: string;
    instructions: string;
    proceed: string;
    setup: string;
  };
}) {
  const [copiedMethod, setCopiedMethod] = useState("");
  const orderedMethods = [...methods].sort(
    (a, b) =>
      Number(a.region !== "bangladesh") - Number(b.region !== "bangladesh"),
  );

  async function copy(methodId: string, value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedMethod(methodId);
    window.setTimeout(() => setCopiedMethod(""), 1600);
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-brand">
        {labels.methods}
      </h2>
      {!methods.length && <p className="mt-4 text-ink/70">{labels.setup}</p>}
      <Reveal stagger className="mt-4 grid gap-4 sm:grid-cols-2">
        {orderedMethods.map((method) => {
          const brand = getBrand(method);
          return (
            <article
              key={method.id}
              className="box-motion border border-gold/40 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    aria-label={method.name}
                    className="grid h-12 min-w-12 place-items-center rounded-lg px-2 text-xs font-black text-white shadow-sm"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.mark}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                      {method.region === "bangladesh"
                        ? labels.bangladesh
                        : labels.abroad}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold text-brand">
                      {method.name}
                    </h3>
                    {method.provider && (
                      <p className="text-sm text-ink/65">{method.provider}</p>
                    )}
                  </div>
                </div>
                <span className="rounded-full bg-sand px-2 py-1 text-xs font-semibold text-brand">
                  {method.currency}
                </span>
              </div>
              {method.accountName && (
                <p className="mt-4 text-sm">
                  <strong>{labels.accountName}:</strong> {method.accountName}
                </p>
              )}
              {method.accountNumber && (
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <p className="break-all">
                    <strong>{labels.accountNumber}:</strong>{" "}
                    {method.accountNumber}
                  </p>
                  <button
                    type="button"
                    onClick={() => copy(method.id, method.accountNumber)}
                    className="shrink-0 border-b border-gold text-xs font-semibold text-brand"
                  >
                    {copiedMethod === method.id ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
              {method.instructions && (
                <p className="mt-3 text-sm leading-6 text-ink/75">
                  <strong>{labels.instructions}:</strong> {method.instructions}
                </p>
              )}
              {method.checkoutUrl && (
                <a
                  href={method.checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block rounded-full bg-brand px-4 py-2 text-sm font-semibold text-cream hover:bg-brand-dark"
                >
                  {labels.proceed} <span aria-hidden>→</span>
                </a>
              )}
            </article>
          );
        })}
      </Reveal>
    </div>
  );
}
