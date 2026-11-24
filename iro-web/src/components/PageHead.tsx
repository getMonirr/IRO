import { Arabesque } from "./Arabesque";
import { Reveal } from "./Reveal";

export function PageHead({ title, lead }: { title: string; lead?: string }) {
  return (
    <section className="relative overflow-hidden bg-brand text-primary-foreground">
      <Arabesque className="absolute inset-0 text-gold opacity-15" />
      <Reveal className="relative mx-auto max-w-6xl px-5 py-14 md:py-20">
        <h1 className="font-display text-3xl font-bold md:text-5xl">{title}</h1>
        {lead && (
          <p className="mt-4 max-w-2xl text-lg text-gold-soft">{lead}</p>
        )}
      </Reveal>
      <div className="h-1 bg-gold" />
    </section>
  );
}
