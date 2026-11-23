import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { ProgramCard } from "@/components/ProgramCard";
import { getT, type Params } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { t } = await getT(params);
  return { title: t.ui.programs.title };
}

export default async function Programs({ params }: { params: Params }) {
  const { locale, t } = await getT(params);
  return (
    <>
      <PageHead title={t.ui.programs.title} lead={t.ui.programs.lead} />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {t.programs.map((p) => <ProgramCard key={p.id} locale={locale} p={p} label={t.ui.programs.details} />)}
      </div>
    </>
  );
}
