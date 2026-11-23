import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arabesque } from "@/components/Arabesque";
import { AyahCard } from "@/components/AyahCard";
import { locales } from "@/i18n/config";
import { getT } from "@/i18n/server";
import { bn } from "@/lib/content/bn";

type Params = Promise<{ locale: string; slug: string }>;

export const generateStaticParams = () =>
  locales.flatMap((locale) => bn.programs.map((p) => ({ locale, slug: p.id })));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { t } = await getT(params);
  const { slug } = await params;
  const p = t.programs.find((x) => x.id === slug);
  return p ? { title: p.title, description: p.short } : {};
}

export default async function ProgramPage({ params }: { params: Params }) {
  const { locale, t } = await getT(params);
  const { slug } = await params;
  const p = t.programs.find((x) => x.id === slug);
  if (!p) notFound();
  const x = t.programExtras[p.id as keyof typeof t.programExtras];
  if (!x) notFound();
  const u = t.ui.programs;
  const planned = x.status === "planned";
  const others = t.programs.filter((o) => o.id !== p.id);

  return (
    <>
      <section className="relative overflow-hidden bg-brand text-cream">
        <Arabesque className="pattern-unfold absolute inset-0 text-gold opacity-20 [mask-image:linear-gradient(to_left,black,transparent_80%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 md:py-20">
          <Link href={`/${locale}/programs`} className="text-sm text-gold-soft hover:text-gold">← {u.all}</Link>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center">
            <div className="m-3 grid h-24 w-24 shrink-0 rotate-45 place-items-center border-2 border-gold bg-brand-dark md:h-28 md:w-28">
              <span className="-rotate-45 text-5xl md:text-6xl" aria-hidden>{p.icon}</span>
            </div>
            <div>
              <span className={`inline-block rounded-full px-4 py-0.5 text-sm font-semibold ${planned ? "border border-gold text-gold-soft" : "bg-gold text-brand-dark"}`}>
                {planned ? u.planned : u.ongoing}
              </span>
              <h1 className="mt-3 font-display text-3xl font-bold leading-snug md:text-5xl">{p.title}</h1>
              <p className="mt-3 max-w-2xl text-lg text-gold-soft">{x.tagline}</p>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gold" />
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="font-display text-lg leading-9">{p.body}</p>
          <h2 className="mt-12 font-display text-2xl font-bold text-brand">{u.whatWeDo}</h2>
          <ul className="mt-5 space-y-4">
            {x.points.map((pt) => (
              <li key={pt} className="flex gap-4">
                <span className="mt-2.5 h-2.5 w-2.5 shrink-0 rotate-45 bg-gold" aria-hidden />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="border-2 border-gold bg-sand p-6">
            <h2 className="font-display text-xl font-bold text-brand">{u.inNumbers}</h2>
            {x.figures.length > 0 ? (
              <dl className="mt-5 space-y-5">
                {x.figures.map((f) => (
                  <div key={f.label} className="border-l-4 border-gold pl-4">
                    <dt className="font-display text-4xl font-bold text-brand">{f.value}</dt>
                    <dd className="text-sm text-ink/75">{f.label}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-ink/80">{u.plannedNote}</p>
            )}
          </div>
        </aside>
      </section>

      {x.ayah?.arabic && (
        <section className="bg-sand">
          <div className="mx-auto max-w-4xl px-5 py-16">
            <AyahCard arabic={x.ayah.arabic} translation={x.ayah.text} source={x.ayah.src} />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl font-bold text-brand">{u.others}</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {others.map((o) => (
            <li key={o.id}>
              <Link href={`/${locale}/programs/${o.id}`} className="flex h-full items-center gap-3 border border-gold/40 bg-white px-4 py-3 transition hover:border-gold hover:bg-sand">
                <span className="text-2xl" aria-hidden>{o.icon}</span>
                <span className="font-display text-sm font-bold text-brand">{o.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative overflow-hidden bg-brand-dark text-center text-cream">
        <Arabesque className="absolute inset-0 text-gold opacity-10" />
        <div className="relative mx-auto max-w-2xl px-5 py-14">
          <h2 className="font-display text-2xl font-bold md:text-3xl">{u.ctaTitle}</h2>
          <p className="mt-3 text-gold-soft">{u.ctaText}</p>
          <Link href={`/${locale}/join`} className="mt-6 inline-block rounded-full bg-gold px-8 py-2.5 font-semibold text-brand-dark hover:bg-gold-soft">{u.ctaBtn}</Link>
        </div>
      </section>
    </>
  );
}
