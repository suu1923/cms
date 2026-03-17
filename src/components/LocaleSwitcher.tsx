"use client";

import { LOCALES } from "@/lib/locale";
import { useLocale } from "@/components/LocaleProvider";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1 rounded-full border border-current/20 bg-transparent px-1 py-1">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLocale(l.code)}
          className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition ${
            locale === l.code ? "bg-current/10" : "opacity-80 hover:opacity-100"
          }`}
          aria-pressed={locale === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

