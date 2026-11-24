"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

export function PostDownload({
  title,
  excerpt,
  body,
  author,
  category,
  locale,
}: {
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  locale: string;
}) {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 48;
      const usableWidth = pageWidth - margin * 2;
      let y = 54;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      const titleLines = doc.splitTextToSize(title, usableWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 24 + 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      const metadata = [category, author].filter(Boolean).join("  |  ");
      if (metadata) {
        doc.text(doc.splitTextToSize(metadata, usableWidth), margin, y);
        y += 20;
      }

      if (excerpt) {
        doc.setFontSize(11);
        doc.setTextColor(45, 45, 45);
        const excerptLines = doc.splitTextToSize(excerpt, usableWidth);
        doc.text(excerptLines, margin, y);
        y += excerptLines.length * 15 + 16;
      }

      doc.setFontSize(12);
      doc.setTextColor(25, 25, 25);
      const parser = new DOMParser();
      const html = parser.parseFromString(body, "text/html");
      const blocks = Array.from(html.body.children);
      const textBlocks = blocks.length
        ? blocks.map((block) => block.textContent?.trim() ?? "")
        : [html.body.textContent ?? body];

      for (const block of textBlocks) {
        if (!block) continue;
        const lines = doc.splitTextToSize(block, usableWidth);
        for (const line of lines) {
          if (y > 790) {
            doc.addPage();
            y = 54;
          }
          doc.text(line, margin, y);
          y += 17;
        }
        y += 8;
      }

      const slug =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "iro-post";
      doc.save(`${slug}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" onClick={download} disabled={busy} variant="outline">
      <Download aria-hidden="true" />
      {busy
        ? locale === "bn"
          ? "তৈরি হচ্ছে…"
          : "Creating…"
        : locale === "bn"
          ? "PDF ডাউনলোড"
          : "Download PDF"}
    </Button>
  );
}
