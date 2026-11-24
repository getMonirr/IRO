"use client";

import { useEffect, useRef, useState } from "react";

const bengaliDigits = "০১২৩৪৫৬৭৮৯";
const latinDigits = "0123456789";

function parseValue(value: string) {
  const match = value.match(/[0-9০-৯,]+/);
  if (!match) return null;
  const raw = match[0].replaceAll(",", "");
  const latin = [...raw]
    .map((digit) => {
      const index = bengaliDigits.indexOf(digit);
      return index >= 0 ? latinDigits[index] : digit;
    })
    .join("");
  return {
    target: Number(latin),
    prefix: value.slice(0, match.index),
    suffix: value.slice((match.index ?? 0) + match[0].length),
    bengali: /[০-৯]/.test(raw),
  };
}

function formatNumber(value: number, bengali: boolean) {
  const digits = Math.round(value).toString();
  return bengali
    ? [...digits].map((digit) => bengaliDigits[Number(digit)]).join("")
    : digits;
}

export function CountUp({ value }: { value: string }) {
  const parsed = parseValue(value);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(parsed?.target ?? 0);

  useEffect(() => {
    if (!parsed) return;
    const element = elementRef.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      setCurrent(parsed.target);
      return;
    }

    let frame = 0;
    let started = false;
    let startTime = 0;
    const duration = 1400;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        startTime = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(parsed.target * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  if (!parsed) return <span>{value}</span>;
  return (
    <span ref={elementRef}>
      {parsed.prefix}
      {formatNumber(current, parsed.bengali)}
      {parsed.suffix}
    </span>
  );
}
