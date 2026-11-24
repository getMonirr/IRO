"use client";

import type { AnimationItem } from "lottie-web";
import { useEffect, useRef } from "react";

const animationPath = "https://useanimations.com/icons/scroll-down.json";

export function ScrollDownAnimation({ size = 56 }: { size?: number }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: AnimationItem | undefined;
    let loaded = false;
    let disposed = false;

    const syncMotion = () => {
      if (!animation || !loaded) return;
      if (motion.matches) animation.goToAndStop(0, true);
      else animation.play();
    };

    const colorize = () => {
      const svg = container.current?.querySelector("svg");
      svg
        ?.querySelectorAll("[fill]")
        .forEach((element) => element.setAttribute("fill", "currentColor"));
      svg
        ?.querySelectorAll("[stroke]")
        .forEach((element) => element.setAttribute("stroke", "currentColor"));
    };

    motion.addEventListener("change", syncMotion);

    void import("lottie-web").then(({ default: lottie }) => {
      if (disposed || !container.current) return;
      animation = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: animationPath,
      });
      animation.addEventListener("DOMLoaded", () => {
        loaded = true;
        colorize();
        animation?.goToAndStop(0, true);
        syncMotion();
      });
    });

    return () => {
      disposed = true;
      motion.removeEventListener("change", syncMotion);
      animation?.destroy();
    };
  }, []);

  return (
    <span
      ref={container}
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="block text-gold"
    />
  );
}
