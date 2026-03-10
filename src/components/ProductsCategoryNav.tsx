"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface ProductsCategoryNavProps {
  categories: Category[];
}

export function ProductsCategoryNav({ categories }: ProductsCategoryNavProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const updateActiveFromScroll = () => {
      if (typeof window === "undefined") return;
      let bestSlug: string | null = null;
      let bestDistance = Infinity;

      for (const cat of categories) {
        const el = document.getElementById(cat.slug);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - 140);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestSlug = cat.slug;
        }
      }

      if (bestSlug) {
        setActiveSlug((prev) => (prev === bestSlug ? prev : bestSlug));
      }
    };

    updateActiveFromScroll();
    window.addEventListener("scroll", updateActiveFromScroll);
    window.addEventListener("hashchange", updateActiveFromScroll);
    return () => {
      window.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("hashchange", updateActiveFromScroll);
    };
  }, [categories]);

  return (
    <nav
      className="sticky top-12 z-40 border-b border-black/[0.08] bg-white/95 backdrop-blur-sm"
      aria-label="产品分类"
    >
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="flex gap-1 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const isActive = activeSlug === cat.slug;
            return (
              <a
                key={cat.id}
                href={`#${cat.slug}`}
                onClick={() => setActiveSlug(cat.slug)}
                className={
                  "shrink-0 rounded-full px-5 py-2.5 text-[14px] font-medium transition " +
                  (isActive
                    ? "border border-black bg-black text-white shadow-sm"
                    : "border border-black/10 bg-transparent text-black/80 hover:border-black/20 hover:bg-black/[0.04] hover:text-black")
                }
              >
                {cat.name}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

