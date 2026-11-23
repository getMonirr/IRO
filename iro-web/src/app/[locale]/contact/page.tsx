import { ContactIcon } from "@/components/ContactIcon";
import { ContactValue } from "@/components/ContactValue";
import { PageHead } from "@/components/PageHead";
import { getT, type Params } from "@/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
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
          <div
            key={i.label}
            className="flex gap-4 border-b border-gold/40 pb-4"
          >
            <dt className="flex w-32 shrink-0 items-center gap-2 font-semibold text-brand">
              <ContactIcon icon={i.icon} value={i.value} /> {i.label}
            </dt>
            <dd>
              <ContactValue
                value={i.value}
                copyLabel={c.copy}
                copiedLabel={c.copied}
              />
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
