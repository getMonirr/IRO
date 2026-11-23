import Link from "next/link";

type P = { id: string; icon: string; title: string; short: string };

export function ProgramCard({ locale, p, label }: { locale: string; p: P; label: string }) {
  return (
    <article className="group flex flex-col border border-gold/40 border-t-4 border-t-gold bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="m-2 grid h-14 w-14 rotate-45 place-items-center border border-gold bg-sand transition group-hover:bg-brand">
        <span className="-rotate-45 text-2xl" aria-hidden>{p.icon}</span>
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-brand">{p.title}</h3>
      <p className="mt-2 flex-1 text-ink/80">{p.short}</p>
      <Link href={`/${locale}/programs/${p.id}`} className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-brand px-5 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-cream">
        {label} <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
