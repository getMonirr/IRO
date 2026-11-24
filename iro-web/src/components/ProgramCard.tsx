import Link from "next/link";

type P = { id: string; icon: string; title: string; short: string };

export function ProgramCard({
  locale,
  p,
  label,
  donateLabel,
}: {
  locale: string;
  p: P;
  label: string;
  donateLabel?: string;
}) {
  return (
    <article className="box-motion motion-sheen group flex flex-col border border-gold/40 border-t-4 border-t-transparent bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="m-2 grid h-14 w-14 rotate-45 place-items-center border border-gold bg-sand transition duration-500 group-hover:rotate-[135deg] group-hover:bg-brand">
        <span
          className="-rotate-45 text-2xl transition duration-500 group-hover:-rotate-[135deg]"
          aria-hidden
        >
          {p.icon}
        </span>
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-brand">
        {p.title}
      </h3>
      <p className="mt-2 flex-1 text-ink/80">{p.short}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/${locale}/programs/${p.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-brand px-4 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-cream"
        >
          {label} <span aria-hidden>→</span>
        </Link>
        {donateLabel && (
          <Link
            href={`/${locale}/donate?program=${encodeURIComponent(p.id)}`}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-cream transition hover:bg-brand-dark"
          >
            {donateLabel} <span aria-hidden>↗</span>
          </Link>
        )}
      </div>
    </article>
  );
}
