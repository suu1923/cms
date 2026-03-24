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
import type { SectionHorizontalGallery as SectionHorizontalGalleryType } from "./types";

export default function SectionHorizontalGallery({ section }: { section: SectionHorizontalGalleryType }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const items = section.items ?? [];

  useEffect(() => {
    if (!section.enableGsap) return;
    const sec = sectionRef.current;
    const strip = stripRef.current;
    if (!sec || !strip) return;

    let cancelled = false;
    let ctx: { revert?: () => void } | undefined;

    void (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const cardCount = Math.max(1, items.length);
      const snapStep = cardCount > 1 ? 1 / (cardCount - 1) : 1;
      let horizontalScrollLength = 0;

      const refresh = () => {
        horizontalScrollLength = Math.max(0, strip.scrollWidth - strip.clientWidth);
      };
      refresh();

      const getEndDistance = () => {
        const heightMode = section.background?.heightMode;
        const isVH =
          heightMode === "当前屏幕高度" || heightMode === "viewport" || heightMode === "100vh";
        if (!isVH) return horizontalScrollLength;
        return Math.max(0, Math.min(horizontalScrollLength, window.innerHeight * 0.6));
      };

      if (cancelled) return;
      ctx = gsap.context(() => {
        const end = () => {
          const dist = getEndDistance();
          // 只留少量最小滚动长度，避免一滑就直接穿过去；过大会撑出明显空白
          const minDist = window.innerHeight * 0.25;
          return `+=${Math.max(dist, minDist)}`;
        };
        // pin 必须从顶部开始，避免视口上方出现“越来越大的空白”
        const pinTriggerStart = "top top";
        const animStart = "top 40%";

        if (section.enablePin) {
          ScrollTrigger.create({
            trigger: sec,
            pin: sec,
            start: pinTriggerStart,
            end,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 0,
            onRefresh: () => {
              refresh();
            },
          });
        }

        gsap.to(strip, {
          x: () => -horizontalScrollLength,
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: animStart,
            end,
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: () => {
              refresh();
            },
            anticipatePin: 0,
            snap: section.enableSnap
              ? {
                  snapTo: snapStep,
                  duration: 0.3,
                  ease: "power1.inOut",
                }
              : undefined,
          },
        });
      }, sec);
    })();

    return () => {
      cancelled = true;
      ctx?.revert?.();
    };
  }, [section.enableGsap, section.enablePin, section.enableSnap, items.length, section.background?.heightMode]);

  const cardWidthPreset = section.cardWidthPreset ?? "60vw";
  const cardAspect = section.cardAspect ?? "1/1";
  const textFirstTitle = section.title || section.subtitle;
  const isViewportHeight =
    section.background?.heightMode === "当前屏幕高度" ||
    section.background?.heightMode === "viewport" ||
    section.background?.heightMode === "100vh";

  // “大气”展示：恢复之前 cardWidthPreset 映射逻辑
  const cardWidthClass =
    cardWidthPreset === "320px"
      ? "w-[320px]"
      : cardWidthPreset === "100vw"
        ? "w-[100vw]"
        : cardWidthPreset === "60vw"
          ? "w-[65vw]"
          : cardWidthPreset === "40vw"
            ? "w-[48vw]"
            : "w-[40vw]";
  const cardAspectClass = cardAspect === "4/3" ? "aspect-[4/3]" : "aspect-square";
  const stripGapClass = cardWidthPreset === "100vw" ? "gap-0" : "gap-6";
  // 这个模块是横向 pin 幻灯片：不依赖 background.heightMode，直接按你的要求固定半屏高度
  const useHalfHeight = section.enablePin !== false;

  return (
    <section ref={sectionRef} className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className={`relative z-10 ${isViewportHeight ? "h-full" : ""}`}>
        <div className={`mx-auto max-w-[1200px] px-6 sm:px-8 ${isViewportHeight ? "h-full" : ""}`}>
          <div className={isViewportHeight ? "flex h-full flex-col py-14" : "py-14"}>
            {textFirstTitle && (section.title || section.subtitle) && (
              <div className="text-left">
                {section.title && (
                  <h2 className={selectionTitleClass}>
                    {section.title}
                  </h2>
                )}
                {section.subtitle && (
                  <p className={`mt-3 max-w-2xl ${selectionDescriptionClass}`}>{section.subtitle}</p>
                )}
              </div>
            )}

            <div
              ref={stripRef}
              className={`${isViewportHeight ? "mt-6 flex-1 items-start" : "mt-6"} flex flex-nowrap ${stripGapClass} will-change-transform`}
            >
              {items.map((it, i) => {
                const url = getStrapiMediaUrl(it.image);
                return (
                  <div
                    key={it.id ?? i}
                    className={`${cardWidthClass} shrink-0 ${isViewportHeight ? "self-center" : ""}`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-2xl bg-black/[0.04] ${
                        useHalfHeight ? "h-[50vh]" : cardAspectClass
                      }`}
                    >
                      {url ? (
                        <Image
                          src={url}
                          alt={it.title ?? ""}
                          fill
                          className="object-cover"
                          
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[13px] text-black/40">
                          暂无图片
                        </div>
                      )}
                    </div>

                    {(it.title || it.caption) && (
                      <div className={isViewportHeight ? "mt-2" : "mt-4"}>
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
      </div>
    </section>
  );
}

