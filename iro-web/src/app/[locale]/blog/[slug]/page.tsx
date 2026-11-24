import { Arabesque } from "@/components/Arabesque";
import { ArticleBody } from "@/components/ArticleBody";
import { PostDownload } from "@/components/PostDownload";
import { PostEngagement } from "@/components/PostEngagement";
import { getT } from "@/i18n/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const { t } = await getT(params);
  const post = t.posts.find(
    (item) => item.type === "blog" && item.slug === slug,
  );
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogDetail({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const { t } = await getT(params);
  const post = t.posts.find(
    (item) => item.type === "blog" && item.slug === slug,
  );
  if (!post) notFound();
  const others = t.posts
    .filter((item) => item.type === "blog" && item.slug !== slug)
    .slice(0, 3);
  return (
    <>
      <article>
        <header className="relative overflow-hidden bg-brand-dark text-cream">
          <Arabesque className="absolute inset-0 text-gold opacity-10" />
          <div className="relative mx-auto max-w-4xl px-5 py-14 md:py-20">
            <Link
              href={`/${locale}/blog`}
              className="text-sm text-gold-soft hover:text-gold"
            >
              ← {locale === "bn" ? "সব ব্লগ" : "All blogs"}
            </Link>
            {post.category && (
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                {post.category}
              </p>
            )}
            <h1 className="mt-3 font-display text-3xl font-bold leading-snug md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 max-w-2xl text-lg text-gold-soft">
                {post.excerpt}
              </p>
            )}
            <p className="mt-6 text-sm text-cream/70">
              {post.author}
              {post.category ? ` · ${post.category}` : ""}
              {post.publishedAt
                ? ` · ${new Date(post.publishedAt).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US")}`
                : ""}
            </p>
            <PostEngagement
              slug={post.slug}
              initialCount={post.viewCount ?? 0}
              locale={locale}
            />
            <div className="mt-4">
              <PostDownload
                title={post.title}
                excerpt={post.excerpt}
                body={post.body}
                author={post.author}
                category={post.category}
                locale={locale}
              />
            </div>
          </div>
        </header>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            className="mx-auto max-h-130 w-full max-w-6xl object-cover md:mt-10"
          />
        )}
        <div className="mx-auto max-w-3xl px-5 py-14">
          <ArticleBody body={post.body} />
        </div>
      </article>
      {others.length > 0 && (
        <section className="border-t border-gold/20 bg-sand px-5 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-bold text-brand">
              {locale === "bn" ? "আরও ব্লগ" : "More blogs"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/blog/${item.slug}`}
                  className="group overflow-hidden rounded-lg border border-gold/30 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {item.coverImage && (
                    <img
                      src={item.coverImage}
                      alt=""
                      className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  )}
                  <div className="p-4 font-display font-bold text-brand">
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
