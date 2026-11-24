"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type Slide = { src: string; alt: string };

const defaultSlides: Slide[] = [
  {
    src: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=85",
    alt: "Open Quran beside prayer beads",
  },
  {
    src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=85",
    alt: "Mosque illuminated at dusk",
  },
  {
    src: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=85",
    alt: "Books arranged for study",
  },
];

export function HeroCarousel({
  slides = defaultSlides,
  arabic,
  translation,
  source,
  previousLabel,
  nextLabel,
}: {
  slides?: Slide[];
  arabic: string;
  translation: string;
  source: string;
  previousLabel: string;
  nextLabel: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const move = (direction: number) => {
    setActive(
      (current) => (current + direction + slides.length) % slides.length,
    );
  };

  return (
    <div className="box-motion motion-float relative h-[clamp(390px,68svh,680px)] overflow-hidden rounded-sm border-2 border-gold/70 bg-brand-dark shadow-xl">
      {slides.map((slide, index) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`}
          aria-hidden={index !== active}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-black/35" />
      <div className="absolute inset-x-5 top-5 rounded-sm border border-gold/70 bg-black/70 p-4 text-primary-foreground shadow-[0_4px_24px_rgba(0,0,0,0.85)] backdrop-blur-sm md:inset-x-8 md:top-8 md:p-5">
        <p
          lang="ar"
          dir="rtl"
          className="font-arabic text-2xl leading-loose text-center drop-shadow-[0_2px_6px_rgba(0,0,0,1)] md:text-3xl"
        >
          {arabic}
        </p>
        <p className="mt-2 border-t border-gold/50 pt-2 text-center text-sm leading-6 text-primary-foreground/95 drop-shadow-[0_2px_5px_rgba(0,0,0,1)] md:text-base">
          {translation}
        </p>
        <p className="mt-1 text-center text-xs text-gold-soft drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
          {source}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-primary-foreground">
        <p className="font-display text-lg font-semibold drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">
          {slides[active].alt}
        </p>
        <div className="flex shrink-0 gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label={previousLabel}
                  variant="outline"
                  size="icon"
                />
              }
            >
              <ChevronLeft aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>{previousLabel}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  onClick={() => move(1)}
                  aria-label={nextLabel}
                  variant="outline"
                  size="icon"
                />
              }
            >
              <ChevronRight aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>{nextLabel}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="absolute bottom-2 left-5 flex gap-1.5" aria-hidden>
        {slides.map((slide, index) => (
          <span
            key={slide.src}
            className={`h-1 w-6 ${index === active ? "bg-gold" : "bg-background/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
