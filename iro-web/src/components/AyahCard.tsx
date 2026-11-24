import { Card, CardContent } from "@/components/ui/card";

export function AyahCard({
  arabic,
  translation,
  source,
  dark = false,
}: {
  arabic: string;
  translation: string;
  source: string;
  dark?: boolean;
}) {
  return (
    <figure>
      <Card
        className={
          dark
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground"
        }
      >
        <CardContent className="p-7">
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-3xl leading-[2.1] text-center md:text-4xl"
          >
            {arabic}
          </p>
          <figcaption className="mt-4 border-t border-border pt-4">
            <p className="leading-8">{translation}</p>
            <p className="mt-2 text-sm text-gold">{source}</p>
          </figcaption>
        </CardContent>
      </Card>
    </figure>
  );
}
