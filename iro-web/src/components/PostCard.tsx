import { Card, CardContent } from "@/components/ui/card";
import type { PublicPost } from "@/lib/content/bn";
import Link from "next/link";

function formatDate(value: string, locale: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function PostCard({
  post,
  locale,
  featured = false,
}: {
  post: PublicPost;
  locale: string;
  featured?: boolean;
}) {
  const base = post.type === "news" ? "news" : "blog";
  return (
    <Card
      className={`group overflow-hidden transition-shadow hover:shadow-md ${featured ? "md:grid md:grid-cols-[1.15fr_1fr]" : "flex h-full flex-col"}`}
    >
      <Link
        href={`/${locale}/${base}/${post.slug}`}
        className={`relative block overflow-hidden bg-sand ${featured ? "min-h-72 md:min-h-full" : "aspect-16/10"}`}
      >
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center overflow-hidden bg-brand-dark">
            <span className="text-7xl" aria-hidden>
              {post.icon || (post.type === "news" ? "📰" : "✍️")}
            </span>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, var(--accent) 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
            />
          </div>
        )}
      </Link>
      <CardContent className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand">
          {post.category && (
            <span className="rounded-full bg-sand px-3 py-1">
              {post.category}
            </span>
          )}
          {post.featured && <span className="text-gold">Featured</span>}
        </div>
        <h3
          className={`mt-3 font-display font-bold leading-snug text-brand ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}
        >
          <Link
            href={`/${locale}/${base}/${post.slug}`}
            className="hover:underline hover:decoration-gold hover:underline-offset-4"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink/75">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-ink/60">
          <span>
            {post.author} ·{" "}
            {(post.viewCount ?? 0).toLocaleString(
              locale === "bn" ? "bn-BD" : "en-US",
            )}
          </span>
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt, locale)}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}
