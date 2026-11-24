"use client";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { apiUpload } from "@/lib/admin/api";
import { ImagePlus, LoaderCircle, Replace, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

export function ImageUpload({
  value,
  onChange,
  folder = "iro/uploads",
  label = "Cover image",
  hint = "PNG, JPG or WebP · maximum 5 MB",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    setBusy(true);
    try {
      const response = await apiUpload<{ secure_url: string }>(
        "/uploads/image",
        formData,
      );
      onChange(response.data.secure_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="font-semibold text-brand">{label}</p>
          <p className="text-xs text-ink/60">{hint}</p>
        </div>
        {value && (
          <Button
            type="button"
            onClick={() => onChange("")}
            variant="destructive"
            size="sm"
          >
            <Trash2 aria-hidden="true" />
            Remove
          </Button>
        )}
      </div>

      {value ? (
        <div className="overflow-hidden rounded-lg border border-gold/30 bg-sand">
          <img
            src={value}
            alt="Uploaded preview"
            className="aspect-video w-full object-cover"
          />
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            variant="ghost"
            className="w-full rounded-none border-t"
          >
            {busy ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Replace aria-hidden="true" />
            )}
            {busy ? "Uploading…" : "Replace image"}
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          variant="outline"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void upload(event.dataTransfer.files[0]);
          }}
          className="min-h-44 w-full flex-col whitespace-normal border-dashed px-5 text-center"
        >
          <span>
            {busy ? (
              <LoaderCircle
                className="mx-auto mb-2 size-7 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <ImagePlus className="mx-auto mb-2 size-7" aria-hidden="true" />
            )}
            <span className="block font-semibold">
              {busy ? "Uploading…" : "Choose or drop an image"}
            </span>
            <span className="mt-1 block text-xs text-ink/60">
              Stored securely in Cloudinary
            </span>
          </span>
        </Button>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      {error && (
        <p className="mt-2 text-sm font-semibold text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
