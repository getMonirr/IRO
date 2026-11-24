import { Arabesque } from "@/components/Arabesque";
import { AyahCard } from "@/components/AyahCard";
import { ContactIcon } from "@/components/ContactIcon";
import { ContactValue } from "@/components/ContactValue";
import { CountUp } from "@/components/CountUp";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PostCard } from "@/components/PostCard";
import { ProgramCard } from "@/components/ProgramCard";
import { Reveal } from "@/components/Reveal";
import { ScrollDownAnimation } from "@/components/ScrollDownAnimation";
import { getT, type Params } from "@/i18n/server";
import Link from "next/link";

export default async function Home({ params }: { params: Params }) {
  const { locale, t } = await getT(params);
  const h = t.ui.home;
  const navLabel = (href: string) =>
    t.nav.find((item) => item.href === href)?.label ?? "";
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-brand text-primary-foreground xl:min-h-[calc(100svh-6rem)]">
        <Arabesque className="pattern-unfold absolute inset-0 text-gold opacity-25 mask-[linear-gradient(to_left,black,transparent_75%)]" />
        <div className="relative mx-auto grid w-full flex-1 items-center gap-10 px-5 pb-24 pt-12 md:max-w-6xl md:grid-cols-[1.2fr_1fr] md:gap-14 md:py-16">
          <div className="hero-copy">
            <p className="text-gold-soft">{h.kicker}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-snug md:text-6xl md:leading-tight">
              {h.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg opacity-90">{h.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/join`}
                className="motion-sheen rounded-full bg-gold px-7 py-2.5 font-semibold text-brand-dark hover:bg-gold-soft"
              >
                {h.ctaJoin}
              </Link>
              <Link
                href={`/${locale}/programs`}
                className="motion-sheen rounded-full border border-gold px-7 py-2.5 hover:bg-gold/10"
              >
                {h.ctaPrograms}
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <HeroCarousel
              arabic="ٱدْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِٱلْحِكْمَةِ وَٱلْمَوْعِظَةِ ٱلْحَسَنَةِ"
              translation={h.ayah}
              source={h.ayahSrc}
              previousLabel={h.carouselPrevious}
              nextLabel={h.carouselNext}
            />
          </div>
        </div>
        <Link
          href="#about"
          aria-label={h.scrollDown}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-gold transition hover:text-gold-soft"
        >
          <span className="flex flex-col items-center gap-1 text-xs">
            <span>{h.scrollDown}</span>
            <ScrollDownAnimation size={64} />
          </span>
        </Link>
        <div className="h-1 bg-gold" />
      </section>

      <section id="about" className="mx-auto max-w-6xl px-5 py-16 scroll-mt-24">
        <Reveal stagger className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              {navLabel("/about")}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-brand md:text-4xl">
              {t.ui.about.visionTitle}
            </h2>
            <p className="mt-4 leading-8 text-ink/80">{t.ui.about.vision}</p>
          </div>
          <div className="border-l-4 border-gold bg-sand px-6 py-6 md:mt-10">
            <h3 className="font-display text-2xl font-bold text-brand">
              {t.ui.about.missionTitle}
            </h3>
            <p className="mt-3 leading-8 text-ink/80">{t.ui.about.mission}</p>
            <Link
              href={`/${locale}/about`}
              className="mt-5 inline-block border-b-2 border-gold font-semibold text-brand"
            >
              {navLabel("/about")}
            </Link>
          </div>
        </Reveal>
      </section>

      <section
        id="programs"
        className="mx-auto max-w-6xl px-5 py-16 scroll-mt-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-brand md:text-4xl">
            {h.programsTitle}
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 bg-gold" />
          <p className="mt-4 text-ink/80">{h.programsLead}</p>
        </div>
        <Reveal
          stagger
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {t.programs.map((p) => (
            <ProgramCard
              key={p.id}
              locale={locale}
              p={p}
              label={t.ui.programs.details}
              donateLabel={t.ui.donation.button}
            />
          ))}
        </Reveal>
        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/programs`}
            className="inline-block border-b-2 border-gold font-semibold text-brand"
          >
            {h.allPrograms}
          </Link>
        </div>
      </section>

      <section id="departments" className="bg-sand scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            {navLabel("/departments")}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand">
            {t.ui.departments.title}
          </h2>
          <p className="mt-3 max-w-2xl">{t.ui.departments.lead}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.departments.map((department) => (
              <li
                key={department}
                className="box-motion group border-l-4 border-gold bg-background px-4 py-4 font-display font-bold text-brand shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-primary-foreground hover:shadow-lg"
              >
                {t.ui.departments.suffix.replace("{d}", department)}
              </li>
            ))}
          </ul>
          <h3 className="mt-16 font-display text-3xl font-bold text-brand">
            {h.journeyTitle}
          </h3>
          <p className="mt-3 max-w-2xl">{h.journeyLead}</p>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.stats.map((s) => (
              <div key={s.label} className="border-l-4 border-gold pl-4">
                <dt className="font-display text-4xl font-bold text-brand">
                  <CountUp value={s.value} />{" "}
                  <span className="text-xl">{s.label}</span>
                </dt>
                <dd className="mt-1 text-sm text-ink/75">{s.note}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={`/${locale}/departments`}
            className="mt-10 inline-block border-b-2 border-gold font-semibold text-brand"
          >
            {navLabel("/departments")}
          </Link>
        </div>
      </section>

      <section
        id="roadmap"
        className="mx-auto max-w-4xl px-5 py-16 scroll-mt-24"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          {navLabel("/roadmap")}
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-brand">
          {t.ui.roadmap.title}
        </h2>
        <p className="mt-3 max-w-2xl">{t.ui.roadmap.lead}</p>
        <Reveal stagger className="relative mt-10 border-l-2 border-gold pl-8">
          {t.roadmap.map((item) => (
            <li key={item.title} className="group relative pb-8 last:pb-0">
              <span
                className="absolute -left-10.25 top-1 h-5 w-5 rotate-45 border-2 border-gold bg-background transition duration-300 group-hover:rotate-90 group-hover:bg-gold"
                aria-hidden
              />
              <h3 className="font-display text-xl font-bold text-brand transition group-hover:translate-x-2">
                {item.title}
              </h3>
              <p className="mt-1 text-ink/80 transition group-hover:translate-x-2">
                {item.text}
              </p>
            </li>
          ))}
        </Reveal>
        <Link
          href={`/${locale}/roadmap`}
          className="mt-8 inline-block border-b-2 border-gold font-semibold text-brand"
        >
          {navLabel("/roadmap")}
        </Link>
      </section>

      {t.posts.length > 0 && (
        <section
          id="journal"
          className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                {locale === "bn" ? "সংবাদের জানালা" : "Latest updates"}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand">
                {locale === "bn" ? "ব্লগসমূহ ও সংবাদ" : "Blogs & News"}
              </h2>
            </div>
            <div className="flex gap-5">
              <Link
                href={`/${locale}/blog`}
                className="border-b-2 border-gold font-semibold text-brand"
              >
                {navLabel("/blog")}
              </Link>
              <Link
                href={`/${locale}/news`}
                className="border-b-2 border-gold font-semibold text-brand"
              >
                {navLabel("/news")}
              </Link>
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {t.posts.slice(0, 4).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                locale={locale}
                featured={post.featured}
              />
            ))}
          </div>
        </section>
      )}

      <section id="join" className="mx-auto max-w-4xl px-5 py-16 scroll-mt-24">
        <AyahCard
          arabic="إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ"
          translation={h.hadith}
          source={h.hadithSrc}
        />
        <div className="mt-10 text-center">
          <h2 className="font-display text-2xl font-bold text-brand">
            {h.joinTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-xl">{h.joinText}</p>
          <div className="mt-8 grid gap-5 text-left sm:grid-cols-2">
            {t.joinWays.map((way) => (
              <div
                key={way.title}
                className="flex gap-4 border-l-4 border-gold bg-sand px-5 py-4"
              >
                <span className="text-2xl" aria-hidden>
                  {way.icon}
                </span>
                <div>
                  <h3 className="font-display font-bold text-brand">
                    {way.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink/80">{way.text}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href={`/${locale}/join`}
            className="mt-5 inline-block rounded-full bg-brand px-8 py-2.5 font-semibold text-primary-foreground hover:bg-brand-dark"
          >
            {h.joinBtn}
          </Link>
        </div>
      </section>

      <section id="contact" className="bg-sand scroll-mt-24">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            {navLabel("/contact")}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand">
            {t.ui.contact.title}
          </h2>
          <p className="mt-3 max-w-2xl">{t.ui.contact.lead}</p>
          <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {t.ui.contact.items.map((item) => (
              <div
                key={item.label}
                className="flex gap-4 border-b border-gold/40 pb-4"
              >
                <dt className="flex w-24 shrink-0 items-center gap-2 font-semibold text-brand">
                  <ContactIcon icon={item.icon} value={item.value} />{" "}
                  {item.label}
                </dt>
                <dd>
                  <ContactValue
                    value={item.value}
                    copyLabel={t.ui.contact.copy}
                    copiedLabel={t.ui.contact.copied}
                  />
                </dd>
              </div>
            ))}
          </dl>
          <Link
            href={`/${locale}/contact`}
            className="mt-8 inline-block border-b-2 border-gold font-semibold text-brand"
          >
            {navLabel("/contact")}
          </Link>
        </div>
      </section>
    </>
  );
}
