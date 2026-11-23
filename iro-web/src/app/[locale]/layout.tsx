import type { Metadata } from "next";
import { Noto_Serif_Bengali, Hind_Siliguri, Amiri } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { locales, type Locale } from "@/i18n/config";
import { getT, type Params } from "@/i18n/server";

const serif = Noto_Serif_Bengali({ subsets: ["bengali", "latin"], variable: "--font-serif-bn", weight: ["500", "700"] });
const sans = Hind_Siliguri({ subsets: ["bengali", "latin"], variable: "--font-sans-bn", weight: ["400", "500", "600"] });
const amiri = Amiri({ subsets: ["arabic", "latin"], variable: "--font-amiri", weight: ["400", "700"] });

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { t } = await getT(params);
  return { title: { default: t.ui.meta.title, template: "%s | IRO" }, description: t.ui.meta.desc };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  const { locale, t } = await getT(params);
  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable} ${amiri.variable}`}>
      <body>
        <Header locale={locale as Locale} t={t} />
        <main>{children}</main>
        <Footer locale={locale} t={t} />
      </body>
    </html>
  );
}
