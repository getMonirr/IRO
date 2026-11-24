"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiUpload } from "@/lib/admin/api";
import type { Bi } from "@/lib/admin/types";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { inputCls } from "./ui";

const tools: Array<{ label: string; command: string; icon: LucideIcon }> = [
  { label: "Undo", command: "undo", icon: Undo2 },
  { label: "Redo", command: "redo", icon: Redo2 },
  { label: "Bold", command: "bold", icon: Bold },
  { label: "Italic", command: "italic", icon: Italic },
  { label: "Underline", command: "underline", icon: Underline },
  { label: "Strikethrough", command: "strikeThrough", icon: Strikethrough },
  { label: "Heading", command: "formatBlock", icon: Heading2 },
  { label: "Subheading", command: "formatBlock", icon: Heading3 },
  { label: "Bulleted list", command: "insertUnorderedList", icon: List },
  { label: "Numbered list", command: "insertOrderedList", icon: ListOrdered },
  { label: "Blockquote", command: "formatBlock", icon: Quote },
  {
    label: "Clear formatting",
    command: "removeFormat",
    icon: RemoveFormatting,
  },
  { label: "Align left", command: "justifyLeft", icon: AlignLeft },
  { label: "Align center", command: "justifyCenter", icon: AlignCenter },
  { label: "Align right", command: "justifyRight", icon: AlignRight },
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
            <div className="flex flex-wrap items-center gap-1 rounded-t border border-b-0 border-input bg-muted p-1">
              {tools.map((tool) => (
                <Tooltip key={`${lang}-${tool.label}`}>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        aria-label={tool.label}
                        variant="ghost"
                        size="icon-sm"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          editors.current[lang]?.focus();
                          if (tool.label === "Heading")
                            document.execCommand("formatBlock", false, "h2");
                          else if (tool.label === "Subheading")
                            document.execCommand("formatBlock", false, "h3");
                          else if (tool.label === "Blockquote")
                            document.execCommand(
                              "formatBlock",
                              false,
                              "blockquote",
                            );
                          else run(lang, tool.command);
                        }}
                      />
                    }
                  >
                    <tool.icon aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipContent>{tool.label}</TooltipContent>
                </Tooltip>
              ))}
              <Separator orientation="vertical" className="mx-1 h-5" />
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      aria-label="Insert image"
                      variant="ghost"
                      size="icon-sm"
                      disabled={uploading}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setImageLang(lang);
                        imageInput.current?.click();
                      }}
                    />
                  }
                >
                  <ImagePlus aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>
                  {uploading ? "Uploading image" : "Insert image"}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      aria-label="Insert link"
                      variant="ghost"
                      size="icon-sm"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => addLink(lang)}
                    />
                  }
                >
                  <Link2 aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>Insert link</TooltipContent>
              </Tooltip>
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
