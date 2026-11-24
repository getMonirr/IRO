import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { locales, type Locale } from "@/i18n/config";
import { getT, type Params } from "@/i18n/server";
import type { Metadata } from "next";
import "../globals.css";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { t } = await getT(params);
  return {
    title: { default: t.ui.meta.title, template: "%s | IRO" },
    description: t.ui.meta.desc,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale, t } = await getT(params);
  return (
    <html lang={locale}>
      <body>
        <Header locale={locale as Locale} t={t} />
        <main>{children}</main>
        <Footer locale={locale} t={t} />
        <FloatingActions locale={locale} t={t} />
      </body>
    </html>
  );
}
