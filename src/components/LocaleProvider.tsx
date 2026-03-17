"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/locale";
import { normalizeLocale } from "@/lib/locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(normalizeLocale(initialLocale));

  // 静态导出下无法在服务端读取 cookies，这里在客户端启动后同步一次
  useEffect(() => {
    try {
      const m = document.cookie.match(/(?:^|;\s*)LOCALE=([^;]+)/);
      if (m?.[1]) {
        setLocaleState(normalizeLocale(m[1]));
      }
    } catch {}
  }, []);

  const setLocale = useCallback((l: Locale) => {
    const next = normalizeLocale(l);
    setLocaleState(next);
    // 让服务端组件也能读到
    document.cookie = `LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

