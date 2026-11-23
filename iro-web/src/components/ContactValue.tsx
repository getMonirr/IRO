"use client";

import { useState } from "react";

const bengaliDigits = "০১২৩৪৫৬৭৮৯";

function toDialableNumber(value: string) {
  return value
    .replace(/[০-৯]/g, (digit) => String(bengaliDigits.indexOf(digit)))
    .replace(/[^\d+]/g, "");
}

function CopyIcon() {
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
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-start font-medium text-gold underline-offset-4 hover:text-gold-soft hover:underline ${className}`}
      >
        {handle}
        <span className="relative -top-1 ml-1 text-[0.7em]" aria-hidden>
          ↗
        </span>
      </a>
    );
  }

  const isEmail = value.includes("@");
  const href = isEmail ? `mailto:${value}` : `tel:${toDialableNumber(value)}`;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <a
        href={href}
        className="font-medium text-gold underline-offset-4 hover:text-gold-soft hover:underline"
      >
        {value}
      </a>
      <button
        type="button"
        onClick={copyValue}
        aria-label={copied ? copiedLabel : copyLabel}
        title={copied ? copiedLabel : copyLabel}
        className="text-gold-soft hover:text-gold"
      >
        <CopyIcon />
      </button>
    </span>
  );
}
