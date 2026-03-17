export type Locale = "zh" | "en";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "zh", label: "中文" },
  { code: "en", label: "EN" },
];

export function normalizeLocale(input: unknown): Locale {
  return input === "en" ? "en" : "zh";
}

