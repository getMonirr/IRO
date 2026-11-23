import Link from "next/link";
import { Arabesque } from "@/components/Arabesque";
import { AyahCard } from "@/components/AyahCard";
import { ProgramCard } from "@/components/ProgramCard";
import { getT, type Params } from "@/i18n/server";

export default async function Home({ params }: { params: Params }) {
  const { locale, t } = await getT(params);
  const h = t.ui.home;
  return (
    <>
      <section className="relative overflow-hidden bg-brand text-cream">
        <Arabesque className="pattern-unfold absolute inset-0 text-gold opacity-25 [mask-image:linear-gradient(to_left,black,transparent_75%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div>
            <p className="text-gold-soft">{h.kicker}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-snug md:text-6xl md:leading-[1.25]">{h.title}</h1>
            <p className="mt-6 max-w-xl text-lg opacity-90">{h.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}/join`} className="rounded-full bg-gold px-7 py-2.5 font-semibold text-brand-dark hover:bg-gold-soft">{h.ctaJoin}</Link>
              <Link href={`/${locale}/programs`} className="rounded-full border border-gold px-7 py-2.5 hover:bg-gold/10">{h.ctaPrograms}</Link>
            </div>
          </div>
          <AyahCard dark arabic="ٱدْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِٱلْحِكْمَةِ وَٱلْمَوْعِظَةِ ٱلْحَسَنَةِ" translation={h.ayah} source={h.ayahSrc} />
        </div>
        <div className="h-1 bg-gold" />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-brand md:text-4xl">{h.programsTitle}</h2>
          <div className="mx-auto mt-3 h-1 w-16 bg-gold" />
          <p className="mt-4 text-ink/80">{h.programsLead}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.programs.map((p) => <ProgramCard key={p.id} locale={locale} p={p} label={t.ui.programs.details} />)}
        </div>
        <div className="mt-10 text-center">
          <Link href={`/${locale}/programs`} className="inline-block border-b-2 border-gold font-semibold text-brand">{h.allPrograms}</Link>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl font-bold text-brand">{h.journeyTitle}</h2>
          <p className="mt-3 max-w-2xl">{h.journeyLead}</p>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.stats.map((s) => (
              <div key={s.label} className="border-l-4 border-gold pl-4">
                <dt className="font-display text-4xl font-bold text-brand">{s.value} <span className="text-xl">{s.label}</span></dt>
                <dd className="mt-1 text-sm text-ink/75">{s.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <AyahCard
          arabic="إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ"
          translation={h.hadith} source={h.hadithSrc} />
        <div className="mt-10 text-center">
          <h2 className="font-display text-2xl font-bold text-brand">{h.joinTitle}</h2>
          <p className="mx-auto mt-2 max-w-xl">{h.joinText}</p>
          <Link href={`/${locale}/join`} className="mt-5 inline-block rounded-full bg-brand px-8 py-2.5 font-semibold text-cream hover:bg-brand-dark">{h.joinBtn}</Link>
        </div>
      </section>
    </>
  );
}
