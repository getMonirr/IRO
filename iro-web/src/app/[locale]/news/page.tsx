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
  return { title: locale === "bn" ? "সংবাদ" : "News" };
}

export default async function NewsPage({ params }: { params: Params }) {
  const { locale, t } = await getT(params);
  const posts = t.posts.filter((post) => post.type === "news");
  return (
    <>
      <PageHead
        title={locale === "bn" ? "সংবাদ" : "News"}
        lead={
          locale === "bn"
            ? "সংগঠন ও সমাজের সর্বশেষ কার্যক্রম ও ঘোষণা"
            : "Latest activities, announcements and reports"
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
              ? "এখনও কোনো সংবাদ প্রকাশিত হয়নি।"
              : "No news published yet."}
          </p>
        )}
      </div>
    </>
  );
}
