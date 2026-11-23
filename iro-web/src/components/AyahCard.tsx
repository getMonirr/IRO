export function AyahCard({ arabic, translation, source, dark = false }: { arabic: string; translation: string; source: string; dark?: boolean }) {
  return (
    <figure className={`rounded-sm border-2 border-gold p-7 ${dark ? "bg-brand-dark text-cream" : "bg-cream text-ink"}`}>
      <p lang="ar" dir="rtl" className="font-arabic text-3xl leading-[2.1] text-center md:text-4xl">{arabic}</p>
      <figcaption className="mt-4 border-t border-gold/50 pt-4">
        <p className="leading-8">{translation}</p>
        <p className="mt-2 text-sm text-gold">{source}</p>
      </figcaption>
    </figure>
  );
}
