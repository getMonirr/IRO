"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

const bengaliDigits = "০১২৩৪৫৬৭৮৯";

function toDialableNumber(value: string) {
  return value
    .replace(/[০-৯]/g, (digit) => String(bengaliDigits.indexOf(digit)))
    .replace(/[^\d+]/g, "");
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
          <ExternalLink className="ml-1 size-3" aria-hidden="true" />
        </a>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                onClick={copyValue}
                aria-label={copied ? copiedLabel : copyLabel}
                variant="ghost"
                size="icon-sm"
              />
            }
          >
            {copied ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
          </TooltipTrigger>
          <TooltipContent>{copied ? copiedLabel : copyLabel}</TooltipContent>
        </Tooltip>
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
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              onClick={copyValue}
              aria-label={copied ? copiedLabel : copyLabel}
              variant="ghost"
              size="icon-sm"
            />
          }
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </TooltipTrigger>
        <TooltipContent>{copied ? copiedLabel : copyLabel}</TooltipContent>
      </Tooltip>
    </span>
  );
}
