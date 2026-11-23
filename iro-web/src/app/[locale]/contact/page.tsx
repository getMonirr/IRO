import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { getT, type Params } from "@/i18n/server";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { t } = await getT(params);
  return { title: t.ui.contact.title };
}

export default async function Contact({ params }: { params: Params }) {
  const { t } = await getT(params);
  const c = t.ui.contact;
  return (
    <>
      <PageHead title={c.title} lead={c.lead} />
      <dl className="mx-auto max-w-3xl space-y-5 px-5 py-16">
        {c.items.map((i) => (
          <div key={i.label} className="flex gap-4 border-b border-gold/40 pb-4">
            <dt className="w-32 shrink-0 font-semibold text-brand"><span aria-hidden>{i.icon}</span> {i.label}</dt>
            <dd>{i.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
