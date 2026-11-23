import { AuthProvider } from "@/lib/admin/auth";
import type { Metadata } from "next";
// Next.js processes this global stylesheet; TypeScript has no declaration for CSS files.
// @ts-ignore
import "../globals.css";

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
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
