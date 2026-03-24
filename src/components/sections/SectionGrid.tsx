"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import { SectionBackground, getSelectionHeightClass, selectionTitleClass } from "./sectionShared";
import type { SectionGrid as SectionGridType } from "./types";

export default function SectionGrid({ section }: { section: SectionGridType }) {
  const wrapRef = useRef<HTMLElement | null>(null);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    if (!wrapRef.current) return;
    const target = wrapRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setTextVisible(true);
          return;
        }
        setTextVisible(false);
      },
      { threshold: 0.22 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const cols = section.columns ?? "3";
  const className = cols === "2" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  const rows = Math.max(1, Math.floor(section.rows ?? 2));
  const maxItems = rows * Number(cols);
  const items = (section.items ?? []).slice(0, maxItems);
  const titlePlacement = section.titlePlacement ?? "out-image";

  return (
    <section ref={wrapRef} className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-10 sm:px-8">
        {section.title && (
          <h2 className={selectionTitleClass}>{section.title}</h2>
        )}
        <div className={`mt-8 grid gap-5 ${className}`}>
          {items.map((it, i) => {
            const url = getStrapiMediaUrl(it.image);
            return (
              <div key={it.id ?? i} className="overflow-hidden rounded-3xl bg-[#efeff1]">
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-black/[0.07] to-black/[0.02]">
                  {url ? (
                    <Image
                      src={url}
                      alt={it.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 560px"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
                      <span className="text-[11px] font-medium uppercase tracking-widest text-black/35">卡片 {i + 1}</span>
                      {it.title ? (
                        <span className="text-[16px] font-medium leading-snug text-black/55">{it.title}</span>
                      ) : (
                        <span className="text-[13px] text-black/40">暂无图片 · 后台可配图</span>
                      )}
                    </div>
                  )}

                  {titlePlacement === "in-image" && (it.title || it.description) && (
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="rounded-2xl bg-black/35 p-4 backdrop-blur-[2px]">
                        {it.title && (
                          <h3
                            className={`text-[20px] font-semibold tracking-tight text-white transition-all duration-700 ${
                              textVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-35"
                            }`}
                          >
                            {it.title}
                          </h3>
                        )}
                        {it.description && (
                          <p
                            className={`mt-2 text-[14px] leading-relaxed text-white/85 transition-all duration-700 ${
                              textVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-35"
                            }`}
                          >
                            {it.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {titlePlacement === "out-image" && (
                  <div className="px-5 py-5 sm:px-6 sm:py-6">
                    {it.title && (
                      <h3
                        className={`text-[20px] font-semibold tracking-tight text-black transition-all duration-700 ${
                          textVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-35"
                        }`}
                      >
                        {it.title}
                      </h3>
                    )}
                    {it.description && (
                      <p
                        className={`mt-3 text-[16px] leading-relaxed text-black/75 transition-all duration-700 ${
                          textVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-35"
                        }`}
                      >
                        {it.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
