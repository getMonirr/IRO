import { AuthProvider } from "@/lib/admin/auth";
import type { Metadata } from "next";
import { Amiri, Hind_Siliguri, Noto_Serif_Bengali } from "next/font/google";
// Next.js processes this global stylesheet; TypeScript has no declaration for CSS files.
// @ts-ignore
import "../globals.css";

const serif = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-serif-bn",
  weight: ["500", "700"],
});
const sans = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  variable: "--font-sans-bn",
  weight: ["400", "500", "600"],
});
const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "IRO Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${amiri.variable}`}
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
