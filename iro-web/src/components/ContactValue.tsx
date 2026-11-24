"use client";

import { useState } from "react";

const bengaliDigits = "০১২৩৪৫৬৭৮৯";

function toDialableNumber(value: string) {
  return value
    .replace(/[০-৯]/g, (digit) => String(bengaliDigits.indexOf(digit)))
    .replace(/[^\d+]/g, "");
}

function CopyIcon({ copied = false }: { copied?: boolean }) {
  if (copied) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 animate-[pulse_.45s_ease-out]"
        aria-hidden
      >
        <path
          d="M4 12.5 9 17l11-11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ContactValue({
  value,
  className = "",
  copyLabel = "Copy",
  copiedLabel = "Copied",
}: {
  value: string;
  className?: string;
  copyLabel?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (value.startsWith("http")) {
    const handle =
      value.split("/").filter(Boolean).pop()?.replace(/^@/, "") ?? value;

    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-start font-medium text-brand underline-offset-4 hover:text-brand-dark hover:underline"
        >
          {handle}
          <span className="relative -top-1 ml-1 text-[0.7em]" aria-hidden>
            ↗
          </span>
        </a>
        <button
          type="button"
          onClick={copyValue}
          aria-label={copied ? copiedLabel : copyLabel}
          title={copied ? copiedLabel : copyLabel}
          className={`transition duration-200 ${copied ? "scale-125 rotate-6 text-green-700" : "text-brand/70 hover:scale-110 hover:text-brand"}`}
        >
          <CopyIcon copied={copied} />
        </button>
      </span>
    );
  }

  const isEmail = value.includes("@");
  const href = isEmail ? `mailto:${value}` : `tel:${toDialableNumber(value)}`;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <a
        href={href}
        className={`font-medium text-brand underline-offset-4 hover:text-brand-dark hover:underline ${className}`}
      >
        {value}
      </a>
      <button
        type="button"
        onClick={copyValue}
        aria-label={copied ? copiedLabel : copyLabel}
        title={copied ? copiedLabel : copyLabel}
        className={`transition duration-200 ${copied ? "scale-125 rotate-6 text-green-700" : "text-brand/70 hover:scale-110 hover:text-brand"}`}
      >
        <CopyIcon copied={copied} />
      </button>
    </span>
  );
}
