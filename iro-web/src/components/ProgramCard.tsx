import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

type P = { id: string; icon: string; title: string; short: string };

export function ProgramCard({
  locale,
  p,
  label,
  donateLabel,
}: {
  locale: string;
  p: P;
  label: string;
  donateLabel?: string;
}) {
  return (
    <Card className="group h-full transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="m-2 grid h-14 w-14 rotate-45 place-items-center border border-gold bg-sand transition duration-500 group-hover:rotate-[135deg] group-hover:bg-brand">
          <span
            className="-rotate-45 text-2xl transition duration-500 group-hover:-rotate-[135deg]"
            aria-hidden
          >
            {p.icon}
          </span>
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-brand">
          {p.title}
        </h3>
        <p className="mt-2 flex-1 text-ink/80">{p.short}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            render={<Link href={`/${locale}/programs/${p.id}`} />}
            variant="outline"
            size="sm"
          >
            {label} <ArrowRight aria-hidden="true" />
          </Button>
          {donateLabel && (
            <Button
              render={
                <Link
                  href={`/${locale}/donate?program=${encodeURIComponent(p.id)}`}
                />
              }
              size="sm"
            >
              {donateLabel} <ExternalLink aria-hidden="true" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
