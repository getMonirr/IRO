"use client";

import { PostForm } from "@/components/admin/PostForm";
import { PageTitle } from "@/components/admin/ui";

export default function NewPost() {
  return (
    <>
      <PageTitle
        title="New blog or news post"
        sub="Create content for the website homepage and dedicated archives."
      />
      <PostForm />
    </>
  );
}
