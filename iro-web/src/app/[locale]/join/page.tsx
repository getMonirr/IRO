import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { JoinForm } from "@/components/JoinForm";
import { getT, type Params } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { t } = await getT(params);
  return { title: t.ui.header.join };
}

export default async function Join({ params }: { params: Params }) {
  const { locale, t } = await getT(params);
  return (
    <>
      <PageHead title={t.ui.join.title} lead={t.ui.join.lead} />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2">
        <ul className="space-y-6">
          {t.joinWays.map((w) => (
            <li key={w.title} className="flex gap-4">
              <span className="text-3xl" aria-hidden>{w.icon}</span>
              <div><h2 className="font-display text-xl font-bold text-brand">{t.ui.join.as.replace("{t}", w.title)}</h2><p className="text-ink/80">{w.text}</p></div>
            </li>
          ))}
        </ul>
        <JoinForm locale={locale} f={t.ui.form} />
      </div>
    </>
  );
}
