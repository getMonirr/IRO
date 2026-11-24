"use client";

import { PostForm } from "@/components/admin/PostForm";
import { Loading, Notice, PageTitle } from "@/components/admin/ui";
import { useFetch } from "@/lib/admin/hooks";
import type { PostRec } from "@/lib/admin/types";
import { useParams } from "next/navigation";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetch<PostRec>(`/posts/${id}`);
  if (loading) return <Loading />;
  if (error || !data) return <Notice>{error ?? "Post not found"}</Notice>;
  return (
    <>
      <PageTitle title={`Edit: ${data.title.bn || data.slug}`} />
      <PostForm initial={data} />
    </>
  );
}
