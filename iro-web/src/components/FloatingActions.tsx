import { Button } from "@/components/ui/button";
import type { Dict } from "@/lib/content/bn";
import { HeartHandshake, MessageCircle } from "lucide-react";
import Link from "next/link";

export function FloatingActions({ locale, t }: { locale: string; t: Dict }) {
  return (
    <div className="motion-float fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <Button
        render={<Link href={`/${locale}/donate`} />}
        className="shadow-lg"
      >
        <HeartHandshake aria-hidden="true" /> {t.ui.floating.donate}
      </Button>
      <Button
        render={<Link href={`/${locale}/contact`} />}
        variant="secondary"
        className="shadow-lg"
      >
        <MessageCircle aria-hidden="true" /> {t.ui.floating.chat}
      </Button>
    </div>
  );
}
