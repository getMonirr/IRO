import { DonationPanel } from "@/components/DonationPanel";
import { PageHead } from "@/components/PageHead";
import { getT, type Params } from "@/i18n/server";
import type { Metadata } from "next";

type SearchParams = Promise<{ program?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { t } = await getT(params);
  return { title: t.ui.donation.button };
}

export default async function DonatePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { t } = await getT(params);
  const query = await searchParams;
  const selectedProgram = t.programs.find(
    (program) => program.id === query.program,
  );
  return (
    <>
      <PageHead title={t.ui.donation.title} lead={t.ui.donation.lead} />
      <section className="mx-auto max-w-6xl px-5 py-16">
        {selectedProgram && (
          <div className="mb-8 border-l-4 border-gold bg-sand px-5 py-4 text-brand">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {t.ui.donation.program}
            </p>
            <p className="mt-1 font-display text-xl font-bold">
              {selectedProgram.title}
            </p>
          </div>
        )}
        <DonationPanel methods={t.donationMethods} labels={t.ui.donation} />
      </section>
    </>
  );
}
