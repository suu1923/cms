"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import {
  SectionBackground,
  getSelectionHeightClass,
  selectionDescriptionClass,
  selectionTitleClass,
} from "./sectionShared";
import type { SectionLateralPinIndicator as SectionLateralPinIndicatorType } from "./types";

function isVideoUrl(url: string) {
  const u = url.toLowerCase();
  return u.includes(".mp4") || u.includes(".webm") || u.includes(".mov") || u.includes(".m3u8");
}

export default function SectionLateralPinIndicator({ section }: { section: SectionLateralPinIndicatorType }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const items = section.items ?? [];
  const safeIdx = Math.min(Math.max(activeIdx, 0), Math.max(0, items.length - 1));
  const active = items[safeIdx];
  const activeUrl = getStrapiMediaUrl(active?.media) ?? getStrapiMediaUrl(active?.image);
  const activeIsVideo = activeUrl ? isVideoUrl(activeUrl) : false;
  const indicatorAtBottom = section.indicatorPosition === "下方";
  const heightMode = section.background?.heightMode;
  const isViewportHeightMode =
    heightMode === "当前屏幕高度" ||
    heightMode === "当前屏幕高度的2/3" ||
    heightMode === "当前屏幕高度的1/2" ||
    heightMode === "当前屏幕高度的1/3" ||
    heightMode === "viewport" ||
    heightMode === "100vh";

  useEffect(() => {
    if (!section.enableGsap) return;
    if (!wrapRef.current || items.length < 2) return;

    let ctx: { revert?: () => void } | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const trigger = wrapRef.current!;
        ScrollTrigger.create({
          trigger,
          // 不 pin 整块区块，避免“置顶后再切换”的错觉
          start: "top 40%",
          end: () => `+=${Math.max(1, items.length - 1) * 520}`,
          onUpdate: (self) => {
            const idx = Math.min(items.length - 1, Math.floor(self.progress * items.length));
            setActiveIdx(idx);
          },
        });
      }, wrapRef);
    })();

    return () => ctx?.revert?.();
  }, [items.length, section.enableGsap]);

  if (items.length === 0) return null;

  return (
    <section className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div ref={wrapRef} className={`relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8 ${isViewportHeightMode ? "h-full" : ""}`}>
        <div className={isViewportHeightMode ? "flex h-full flex-col py-8" : "py-14"}>
          {(section.title || section.subtitle) && (
            <div>
              {section.title && (
                <h2 className={selectionTitleClass}>{section.title}</h2>
              )}
              {section.subtitle && <p className={`mt-3 ${selectionDescriptionClass}`}>{section.subtitle}</p>}
            </div>
          )}
          <div
            className={
              indicatorAtBottom
                ? `mt-6 flex flex-col-reverse gap-4 ${isViewportHeightMode ? "min-h-0 flex-1" : ""}`
                : `mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start ${isViewportHeightMode ? "min-h-0 flex-1" : ""}`
            }
          >
            <div
              className={
                indicatorAtBottom
                  ? "overflow-x-auto border-b border-black/[0.12] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  : "border-l border-black/[0.12]"
              }
            >
              <div className={indicatorAtBottom ? "flex min-w-max items-center gap-0" : "space-y-1"}>
              {items.map((it, i) => (
                <button
                  key={it.id ?? i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={
                    indicatorAtBottom
                      ? `relative -mb-px px-8 py-3 text-[20px] font-normal whitespace-nowrap transition-colors ${
                          i === safeIdx
                            ? "border-b-2 border-black text-black"
                            : "border-b-2 border-transparent text-black/45 hover:text-black/70"
                        }`
                      : `relative w-full border-l-2 px-4 py-2 text-left text-[16px] transition-colors ${
                          i === safeIdx
                            ? "border-black text-black"
                            : "border-transparent text-black/45 hover:text-black/70"
                        }`
                  }
                >
                  <span>{it.title ?? `Step ${i + 1}`}</span>
                </button>
              ))}
              </div>
            </div>
            <div className={`relative overflow-hidden rounded-2xl bg-black/20 ${isViewportHeightMode ? "min-h-0 flex-1" : ""}`}>
              <div className={`relative w-full ${isViewportHeightMode ? "h-full min-h-[280px]" : "aspect-[16/12]"}`}>
                {activeUrl ? (
                  activeIsVideo ? (
                    <video
                      src={activeUrl}
                      className="h-full w-full object-cover"
                      muted
                      autoPlay
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      src={activeUrl}
                      alt={active?.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 900px"
                      unoptimized
                    />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/20 text-[13px] text-black/40">
                    暂无媒体
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
