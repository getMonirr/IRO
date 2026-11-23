import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { getT, type Params } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { t } = await getT(params);
  return { title: t.ui.about.title };
}

export default async function About({ params }: { params: Params }) {
  const { t } = await getT(params);
  const a = t.ui.about;
  return (
    <>
      <PageHead title={a.title} lead={a.lead} />
      <section className="mx-auto max-w-6xl gap-12 px-5 py-16 md:grid md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-brand">{a.visionTitle}</h2>
          <p className="mt-4 font-display leading-9">{a.vision}</p>
        </div>
        <div className="mt-10 md:mt-0">
          <h2 className="font-display text-3xl font-bold text-brand">{a.missionTitle}</h2>
          <p className="mt-4 font-display leading-9">{a.mission}</p>
        </div>
      </section>
      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl font-bold text-brand">{a.principlesTitle}</h2>
          <p className="mt-3 max-w-2xl">{a.principlesLead[0]}<span lang="ar" className="font-arabic text-xl">لا إله إلا الله محمد رسول الله</span>{a.principlesLead[1]}</p>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {t.principles.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="text-2xl" aria-hidden>{p.icon}</span>
                <div><h3 className="font-display text-lg font-bold text-brand">{p.title}</h3><p className="text-ink/80">{p.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-display text-3xl font-bold text-brand">{a.goalsTitle}</h2>
        <ol className="mt-6 list-decimal space-y-3 pl-6 marker:text-gold">
          {t.goals.map((g) => <li key={g}>{g}</li>)}
        </ol>
      </section>
    </>
  );
}
