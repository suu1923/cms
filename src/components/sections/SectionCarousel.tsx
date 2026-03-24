"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import {
  SectionBackground,
  getSelectionHeightClass,
  selectionDescriptionClass,
  selectionTitleClass,
} from "./sectionShared";
import type { SectionCarousel as SectionCarouselType } from "./types";

export default function SectionCarousel({ section }: { section: SectionCarouselType }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const enableGsap = section.enableGsap === true;

  useEffect(() => {
    if (!enableGsap) return;
    const sec = sectionRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;

    let ctx: { revert?: () => void } | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          track,
          { x: 0 },
          {
            x: () => {
              const max = Math.max(0, track.scrollWidth - track.clientWidth);
              return -max;
            },
            ease: "none",
            scrollTrigger: {
              // 用整块 section 做 trigger，避免 track 太矮导致 scrub 区间怪异
              trigger: sec,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      }, sec);
    })();
    return () => ctx?.revert?.();
  }, [enableGsap, section.items?.length]);

  const items = section.items ?? [];

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}
    >
      <SectionBackground background={section.background} />
      <div className="relative z-10 py-10">
        {(section.title || section.subtitle) && (
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            {section.title && (
              <h2 className={selectionTitleClass}>{section.title}</h2>
            )}
            {section.subtitle && <p className={`mt-3 max-w-2xl ${selectionDescriptionClass}`}>{section.subtitle}</p>}
          </div>
        )}

        {/* GSAP 驱动横移时禁止 overflow-x-auto，否则会与 transform 抢手势/错位 */}
        <div
          className={`mx-auto mt-8 max-w-[1200px] px-6 sm:px-8 ${enableGsap ? "overflow-x-hidden [touch-action:pan-y]" : ""}`}
        >
          <div
            ref={trackRef}
            className={
              enableGsap
                ? "flex w-max min-w-full gap-6 pb-2 will-change-transform"
                : "flex gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            }
          >
            {items.map((it, i) => {
              const url = getStrapiMediaUrl(it.image);
              return (
                <div key={it.id ?? i} className="w-[320px] shrink-0">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-black/[0.06] to-black/[0.02]">
                    {url ? (
                      <Image src={url} alt={it.title ?? ""} fill className="object-cover" sizes="320px" unoptimized />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
                        <span className="text-[11px] font-medium uppercase tracking-widest text-black/35">预览位</span>
                        {it.title ? (
                          <span className="text-[15px] font-medium leading-snug text-black/55">{it.title}</span>
                        ) : (
                          <span className="text-[13px] text-black/40">暂无图片 · 可在后台上传</span>
                        )}
                      </div>
                    )}
                  </div>
                  {(it.title || it.caption) && (
                    <div className="mt-4">
                      {it.title && <p className="text-[13px] font-medium text-black/90">{it.title}</p>}
                      {it.caption && <p className="mt-1 text-[13px] text-black/60">{it.caption}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
