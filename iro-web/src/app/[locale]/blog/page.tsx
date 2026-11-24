import { PageHead } from "@/components/PageHead";
import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";
import { getT, type Params } from "@/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "bn" ? "ব্লগসমূহ" : "Blogs" };
}

export default async function BlogPage({ params }: { params: Params }) {
  const { locale, t } = await getT(params);
  const posts = t.posts.filter((post) => post.type === "blog");
  return (
    <>
      <PageHead
        title={locale === "bn" ? "ব্লগসমূহ" : "Blogs"}
        lead={
          locale === "bn"
            ? "গবেষণা, চিন্তা ও বাস্তব জীবনের আলোকিত লেখা"
            : "Research, reflection and practical insight"
        }
      />
      <div className="mx-auto max-w-6xl px-5 py-16">
        {posts.length ? (
          <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} />
            ))}
          </Reveal>
        ) : (
          <p className="rounded-lg border border-gold/30 bg-sand px-5 py-12 text-center text-ink/60">
            {locale === "bn"
              ? "এখনও কোনো ব্লগ প্রকাশিত হয়নি।"
              : "No blog posts published yet."}
          </p>
        )}
      </div>
    </>
  );
}
