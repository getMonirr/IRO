export function ArticleBody({ body }: { body: string }) {
  const hasHtml = /<[^>]+>/.test(body);
  if (!hasHtml) {
    return (
      <div className="whitespace-pre-wrap font-display text-lg leading-10 text-ink">
        {body}
      </div>
    );
  }
  return (
    <div
      className="article-content [&_img]:my-6 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-lg [&_img]:object-cover font-display text-lg leading-9 text-ink [&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:bg-sand [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-brand [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
