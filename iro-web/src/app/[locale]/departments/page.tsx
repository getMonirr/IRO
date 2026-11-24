import { PageHead } from "@/components/PageHead";
import { getT, type Params } from "@/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { t } = await getT(params);
  return { title: t.nav.find((item) => item.href === "/departments")?.label };
}

export default async function Departments({ params }: { params: Params }) {
  const { t } = await getT(params);
  const d = t.ui.departments;
  return (
    <>
      <PageHead title={d.title} lead={d.lead} />
      <ul className="mx-auto grid max-w-6xl gap-4 px-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {t.departments.map((x) => (
          <li
            key={x}
            className="border-l-4 border-gold bg-card px-5 py-4 font-display font-bold text-brand shadow-sm"
          >
            {d.suffix.replace("{d}", x)}
          </li>
        ))}
      </ul>
    </>
  );
}
