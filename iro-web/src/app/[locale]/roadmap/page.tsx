import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { getT, type Params } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { t } = await getT(params);
  return { title: t.ui.roadmap.title };
}

export default async function Roadmap({ params }: { params: Params }) {
  const { t } = await getT(params);
  return (
    <>
      <PageHead title={t.ui.roadmap.title} lead={t.ui.roadmap.lead} />
      <ol className="relative mx-auto my-16 ml-5 max-w-3xl border-l-2 border-gold px-5 md:mx-auto">
        {t.roadmap.map((r) => (
          <li key={r.title} className="relative pb-10 pl-8 last:pb-0">
            <span className="absolute -left-[11px] top-2 h-5 w-5 rotate-45 border-2 border-gold bg-background" aria-hidden />
            <h2 className="font-display text-xl font-bold text-brand">{r.title}</h2>
            <p className="mt-1 text-ink/80">{r.text}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
