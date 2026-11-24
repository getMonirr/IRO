"use client";

import {
  Badge,
  Btn,
  Empty,
  inputCls,
  Loading,
  Notice,
  Pager,
  PageTitle,
  Table,
  Td,
} from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { useAuth } from "@/lib/admin/auth";
import { useFetch } from "@/lib/admin/hooks";
import { isAdmin } from "@/lib/admin/roles";
import type { PostRec } from "@/lib/admin/types";
import Link from "next/link";
import { useState } from "react";

export default function PostsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [msg, setMsg] = useState<{ tone: "error" | "success"; text: string }>();
  const { data, meta, loading, error, reload } = useFetch<PostRec[]>("/posts", {
    page,
    limit: 20,
    searchTerm: q,
    type,
  });

  async function remove(post: PostRec) {
    if (
      !confirm(`Delete "${post.title.bn || post.slug}"? This cannot be undone.`)
    )
      return;
    try {
      await api(`/posts/${post._id}`, { method: "DELETE" });
      setMsg({ tone: "success", text: "Post deleted" });
      reload();
    } catch (err) {
      setMsg({ tone: "error", text: (err as Error).message });
    }
  }

  return (
    <>
      <PageTitle
        title="Blog & News"
        sub="Manage articles, announcements and published updates."
        action={
          <Link href="/admin/posts/new">
            <Btn>+ New post</Btn>
          </Link>
        }
      />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      {error && <Notice>{error}</Notice>}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Search title or slug…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className={inputCls + " max-w-xs"}
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className={inputCls + " max-w-40"}
        >
          <option value="">All types</option>
          <option value="blog">Blog</option>
          <option value="news">News</option>
        </select>
      </div>
      {loading && !data ? (
        <Loading />
      ) : (
        <Table head={["Date", "Post", "Type", "Featured", "Visible", ""]}>
          {data?.length ? (
            data.map((post) => (
              <tr key={post._id}>
                <Td className="whitespace-nowrap text-xs">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : "—"}
                </Td>
                <Td>
                  <span className="mr-2">
                    {post.icon || (post.type === "news" ? "📰" : "✍️")}
                  </span>
                  <span className="font-semibold">{post.title.bn}</span>
                  {post.title.en && (
                    <span className="block text-xs text-ink/60">
                      {post.title.en}
                    </span>
                  )}
                  <span className="block font-mono text-xs text-ink/50">
                    /{post.slug}
                  </span>
                </Td>
                <Td>
                  <Badge tone={post.type === "news" ? "gold" : "gray"}>
                    {post.type}
                  </Badge>
                </Td>
                <Td>
                  {post.featured ? <Badge tone="gold">Featured</Badge> : "—"}
                </Td>
                <Td>
                  {post.published ? (
                    <Badge tone="green">Published</Badge>
                  ) : (
                    <Badge>Draft</Badge>
                  )}
                </Td>
                <Td className="space-x-3 whitespace-nowrap text-right">
                  <Link
                    href={`/admin/posts/${post._id}`}
                    className="font-semibold text-brand hover:underline"
                  >
                    Edit
                  </Link>
                  {user && isAdmin(user.role) && (
                    <button
                      onClick={() => remove(post)}
                      className="font-semibold text-red-700 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </Td>
              </tr>
            ))
          ) : (
            <Empty cols={6} />
          )}
        </Table>
      )}
      <Pager meta={meta} onPage={setPage} />
    </>
  );
}
