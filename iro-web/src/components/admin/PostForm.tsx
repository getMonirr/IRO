"use client";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/admin/api";
import { useFetch } from "@/lib/admin/hooks";
import { emptyBi, toBi, type PostData, type PostRec } from "@/lib/admin/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";
import { BiField, Btn, Card, Field, inputCls, Notice } from "./ui";

const blank = (): PostData => ({
  slug: "",
  type: "blog",
  icon: "",
  coverImage: "",
  category: emptyBi(),
  title: emptyBi(),
  excerpt: emptyBi(),
  body: emptyBi(),
  author: emptyBi(),
  published: true,
  featured: false,
  publishedAt: new Date().toISOString().slice(0, 10),
});

const normalize = (post: PostRec): PostData => ({
  slug: post.slug,
  type: post.type,
  icon: post.icon ?? "",
  coverImage: post.coverImage ?? "",
  category: toBi(post.category),
  title: toBi(post.title),
  excerpt: toBi(post.excerpt),
  body: toBi(post.body),
  author: toBi(post.author),
  published: post.published,
  featured: post.featured,
  publishedAt: post.publishedAt
    ? String(post.publishedAt).slice(0, 10)
    : new Date().toISOString().slice(0, 10),
});

export function PostForm({ initial }: { initial?: PostRec }) {
  const router = useRouter();
  const [d, setD] = useState<PostData>(initial ? normalize(initial) : blank());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { data: options } = useFetch<{
    categories: { bn: string[]; en: string[] };
    authors: { bn: string[]; en: string[] };
  }>("/posts/options");
  const set = <K extends keyof PostData>(key: K, value: PostData[K]) =>
    setD((state) => ({ ...state, [key]: value }));

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = {
        ...d,
        publishedAt: new Date(`${d.publishedAt}T12:00:00.000Z`).toISOString(),
      };
      if (initial)
        await api(`/posts/${initial._id}`, { method: "PATCH", body });
      else await api("/posts", { method: "POST", body });
      router.push("/admin/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save post");
      setBusy(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {error && <Notice>{error}</Notice>}
      <Card className="space-y-4">
        <h2 className="font-display text-lg font-bold text-brand">
          Publication
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Type">
            <Select
              value={d.type}
              onValueChange={(value) =>
                value && set("type", value as PostData["type"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="news">News</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Slug (URL)" hint="e.g. islamic-research-news">
            <Input
              required
              value={d.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase())}
              className={inputCls}
              placeholder="my-article"
            />
          </Field>
          <Field label="Publish date">
            <Input
              type="date"
              required
              value={d.publishedAt}
              onChange={(e) => set("publishedAt", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Icon or emoji">
            <Input
              value={d.icon}
              onChange={(e) => set("icon", e.target.value)}
              className={inputCls}
              maxLength={20}
              placeholder="📰"
            />
          </Field>
        </div>
        <ImageUpload
          value={d.coverImage}
          onChange={(url) => set("coverImage", url)}
          folder={`iro/posts/${d.type}`}
          label="Cover image"
          hint="Recommended: 1600 × 900 px · PNG, JPG or WebP · 5 MB maximum"
        />
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={d.published}
              onCheckedChange={(checked) => set("published", checked === true)}
            />
            Published
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={d.featured}
              onCheckedChange={(checked) => set("featured", checked === true)}
            />
            Featured on homepage
          </label>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-lg font-bold text-brand">
          Article content
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(["bn", "en"] as const).map((lang) => (
            <Field
              key={lang}
              label={lang === "bn" ? "Category (Bangla)" : "Category (English)"}
            >
              <Input
                list={`category-options-${lang}`}
                value={d.category[lang]}
                onChange={(event) =>
                  set("category", { ...d.category, [lang]: event.target.value })
                }
                className={inputCls}
                placeholder={lang === "bn" ? "গবেষণা" : "Research"}
              />
              <datalist id={`category-options-${lang}`}>
                {options?.categories[lang].map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            </Field>
          ))}
        </div>
        <BiField
          label="Title"
          value={d.title}
          onChange={(value) => set("title", value)}
          hint="Bangla is required; English is optional"
        />
        <BiField
          label="Short excerpt"
          value={d.excerpt}
          onChange={(value) => set("excerpt", value)}
          multiline
          rows={3}
        />
        <div className="grid gap-3 md:grid-cols-2">
          {(["bn", "en"] as const).map((lang) => (
            <Field
              key={lang}
              label={lang === "bn" ? "Author (Bangla)" : "Author (English)"}
            >
              <Input
                list={`author-options-${lang}`}
                value={d.author[lang]}
                onChange={(event) =>
                  set("author", { ...d.author, [lang]: event.target.value })
                }
                className={inputCls}
                placeholder={lang === "bn" ? "লেখকের নাম" : "Author name"}
              />
              <datalist id={`author-options-${lang}`}>
                {options?.authors[lang].map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            </Field>
          ))}
        </div>
        <RichTextEditor
          label="Full article"
          value={d.body}
          onChange={(value) => set("body", value)}
          hint="Bangla is required; English is optional"
        />
      </Card>

      <div className="flex gap-3">
        <Btn disabled={busy}>
          {busy ? "Saving…" : initial ? "Save changes" : "Create post"}
        </Btn>
        <Btn
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/posts")}
        >
          Cancel
        </Btn>
      </div>
    </form>
  );
}
