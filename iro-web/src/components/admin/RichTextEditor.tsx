"use client";

import { apiUpload } from "@/lib/admin/api";
import type { Bi } from "@/lib/admin/types";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { inputCls } from "./ui";

const tools: Array<{ label: string; command: string; text: string }> = [
  { label: "Undo", command: "undo", text: "↶" },
  { label: "Redo", command: "redo", text: "↷" },
  { label: "Bold", command: "bold", text: "B" },
  { label: "Italic", command: "italic", text: "I" },
  { label: "Underline", command: "underline", text: "U" },
  { label: "Strikethrough", command: "strikeThrough", text: "S" },
  { label: "Heading", command: "formatBlock", text: "H2" },
  { label: "Subheading", command: "formatBlock", text: "H3" },
  { label: "Bulleted list", command: "insertUnorderedList", text: "•" },
  { label: "Numbered list", command: "insertOrderedList", text: "1." },
  { label: "Blockquote", command: "formatBlock", text: "❝" },
  { label: "Clear formatting", command: "removeFormat", text: "Tx" },
  { label: "Align left", command: "justifyLeft", text: "≡" },
  { label: "Align center", command: "justifyCenter", text: "≡" },
  { label: "Align right", command: "justifyRight", text: "≡" },
];

export function RichTextEditor({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: Bi;
  onChange: (value: Bi) => void;
  hint?: ReactNode;
}) {
  const editors = useRef<Partial<Record<"bn" | "en", HTMLDivElement | null>>>(
    {},
  );
  const imageInput = useRef<HTMLInputElement>(null);
  const [imageLang, setImageLang] = useState<"bn" | "en">("bn");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (["bn", "en"] as const).forEach((lang) => {
      const editor = editors.current[lang];
      if (!editor) return;
      if (
        document.activeElement !== editor &&
        editor.innerHTML !== value[lang]
      ) {
        editor.innerHTML = value[lang] || "";
      }
    });
  }, [value.bn, value.en]);

  const run = (lang: "bn" | "en", command: string) => {
    const editor = editors.current[lang];
    editor?.focus();
    document.execCommand(
      command,
      false,
      command === "formatBlock"
        ? command === "formatBlock" && label === "Heading"
          ? "h2"
          : undefined
        : undefined,
    );
  };

  const addImage = async (file?: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", `iro/posts/articles/${imageLang}`);
    setUploading(true);
    try {
      const response = await apiUpload<{ secure_url: string }>(
        "/uploads/image",
        formData,
      );
      const editor = editors.current[imageLang];
      editor?.focus();
      document.execCommand(
        "insertHTML",
        false,
        `<p><img src="${response.data.secure_url}" alt="" style="max-width:100%;height:auto;"></p>`,
      );
      if (editor) onChange({ ...value, [imageLang]: editor.innerHTML });
    } finally {
      setUploading(false);
      if (imageInput.current) imageInput.current.value = "";
    }
  };

  const addLink = (lang: "bn" | "en") => {
    const url = window.prompt("Link URL");
    if (!url) return;
    editors.current[lang]?.focus();
    document.execCommand("createLink", false, url);
  };

  return (
    <div>
      <span className="font-semibold text-brand">{label}</span>
      <div className="mt-1 grid gap-3 md:grid-cols-2">
        {(["bn", "en"] as const).map((lang) => (
          <div key={lang}>
            <div className="flex flex-wrap gap-1 rounded-t border border-b-0 border-brand/25 bg-sand p-1">
              {tools.map((tool) => (
                <button
                  key={`${lang}-${tool.label}`}
                  type="button"
                  title={tool.label}
                  aria-label={tool.label}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    editors.current[lang]?.focus();
                    if (tool.label === "Heading")
                      document.execCommand("formatBlock", false, "h2");
                    else if (tool.label === "Subheading")
                      document.execCommand("formatBlock", false, "h3");
                    else if (tool.label === "Blockquote")
                      document.execCommand("formatBlock", false, "blockquote");
                    else run(lang, tool.command);
                  }}
                  className="grid h-8 min-w-8 place-items-center rounded px-2 text-sm font-bold text-brand hover:bg-white"
                >
                  {tool.text}
                </button>
              ))}
              <button
                type="button"
                title="Image"
                aria-label="Image"
                disabled={uploading}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setImageLang(lang);
                  imageInput.current?.click();
                }}
                className="h-8 rounded px-2 text-sm font-bold text-brand hover:bg-white disabled:opacity-50"
              >
                {uploading ? "…" : "IMG"}
              </button>
              <button
                type="button"
                title="Link"
                aria-label="Link"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addLink(lang)}
                className="h-8 rounded px-2 text-sm font-bold text-brand hover:bg-white"
              >
                ↗
              </button>
            </div>
            <div
              ref={(node) => {
                editors.current[lang] = node;
              }}
              lang={lang}
              dir="ltr"
              role="textbox"
              aria-label={`${label} (${lang === "bn" ? "Bangla" : "English"})`}
              contentEditable
              suppressContentEditableWarning
              onInput={(event) =>
                onChange({ ...value, [lang]: event.currentTarget.innerHTML })
              }
              className={`${inputCls} min-h-56 cursor-text rounded-t-none overflow-y-auto whitespace-pre-wrap text-left direction-ltr [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-bold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic`}
            />
          </div>
        ))}
      </div>
      {hint && <span className="mt-1 block text-xs text-ink/60">{hint}</span>}
    </div>
  );
}
