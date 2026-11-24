import type { CSSProperties } from "react";

export const DEFAULT_THEME = {
  primary: "#0f4c3a",
  primaryForeground: "#ffffff",
  secondary: "#c9a24b",
  secondaryForeground: "#1d2b25",
  accent: "#e8d9ae",
  accentForeground: "#0a3427",
  background: "#fbf7ee",
  foreground: "#1d2b25",
  muted: "#f2ead7",
  mutedForeground: "#52645b",
  card: "#ffffff",
  cardForeground: "#1d2b25",
  destructive: "#b42318",
  destructiveForeground: "#ffffff",
  border: "#dfd1af",
  ring: "#0f4c3a",
} as const;

export type ThemeTokens = {
  -readonly [K in keyof typeof DEFAULT_THEME]: string;
};

const cssTokenNames: Record<keyof ThemeTokens, string> = {
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  background: "--background",
  foreground: "--foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  border: "--border",
  ring: "--ring",
};

export function resolveTheme(value?: Partial<ThemeTokens> | null): ThemeTokens {
  const resolved: ThemeTokens = { ...DEFAULT_THEME };
  for (const key of Object.keys(DEFAULT_THEME) as (keyof ThemeTokens)[]) {
    const candidate = value?.[key];
    if (typeof candidate === "string" && /^#[\da-fA-F]{6}$/.test(candidate)) {
      resolved[key] = candidate;
    }
  }
  return resolved;
}

export function themeStyle(theme: ThemeTokens): CSSProperties {
  return Object.fromEntries(
    Object.entries(theme).map(([key, value]) => [
      cssTokenNames[key as keyof ThemeTokens],
      value,
    ]),
  ) as CSSProperties;
}
