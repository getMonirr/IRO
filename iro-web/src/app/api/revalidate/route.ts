import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// ব্যাকএন্ড কন্টেন্ট বদলালে এই এন্ডপয়েন্ট কল করে, ফলে ১ মিনিট অপেক্ষা না করেই সাইট আপডেট হয়
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag("content");
  return NextResponse.json({ ok: true });
}
