import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/admin/auth";
import { fetchContent } from "@/lib/api";
import { resolveTheme, themeStyle } from "@/lib/theme";
import type { Metadata } from "next";
// Next.js processes this global stylesheet; TypeScript has no declaration for CSS files.
// @ts-ignore
import "../globals.css";

export const metadata: Metadata = {
  title: "IRO Admin",
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = resolveTheme((await fetchContent("en"))?.theme);
  return (
    <html lang="en" style={themeStyle(theme)}>
      <body>
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
