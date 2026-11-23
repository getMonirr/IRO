import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const wantsEn = req.headers.get("accept-language")?.toLowerCase().startsWith("en");
  req.nextUrl.pathname = `/${wantsEn ? "en" : defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(req.nextUrl);
}

export const config = { matcher: ["/((?!_next|api|admin|.*\\..*).*)"] };
