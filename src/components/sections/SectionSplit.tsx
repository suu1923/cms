"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import {
  SectionBackground,
  getSelectionHeightClass,
  selectionDescriptionClass,
  selectionTitleClass,
} from "./sectionShared";
import type { SectionSplit as SectionSplitType } from "./types";

export default function SectionSplit({ section }: { section: SectionSplitType }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!section.enableGsap) return;
    const el = wrapRef.current;
    if (!el) return;
    let io: IntersectionObserver | null = null;
    let gsapRef: typeof import("gsap").default | null = null;
    let tEls: HTMLElement[] = [];
    let mEls: HTMLElement[] = [];

    (async () => {
      const gsap = (await import("gsap")).default;
      gsapRef = gsap;

      tEls = Array.from(el.querySelectorAll<HTMLElement>("[data-anim='text']"));
      mEls = Array.from(el.querySelectorAll<HTMLElement>("[data-anim='media']"));

      // 初始必须保持可见：否则 IntersectionObserver 在首次进入阶段没触发时，
      // 整段 section 虽然占高度但文本/媒体会一直 opacity=0，看起来像“后面的 section 没显示出来”。
      gsap.set(tEls, { y: 0, opacity: 1 });
      gsap.set(mEls, { y: 0, opacity: 1 });

      const reset = () => {
        if (!gsapRef) return;
        gsapRef.killTweensOf(tEls);
        gsapRef.killTweensOf(mEls);
        gsapRef.set(tEls, { y: 18, opacity: 0 });
        gsapRef.set(mEls, { y: 28, opacity: 0 });
      };

      const play = () => {
        if (!gsapRef) return;
        gsapRef.killTweensOf(tEls);
        gsapRef.killTweensOf(mEls);
        gsapRef.set(tEls, { y: 18, opacity: 0 });
        gsapRef.set(mEls, { y: 28, opacity: 0 });

        gsapRef.fromTo(tEls, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.08 });
        gsapRef.fromTo(mEls, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: "power2.out" });
      };

      let isVisible = false;
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              play();
            }
          } else if (isVisible) {
            isVisible = false;
            reset();
          }
        },
        { threshold: 0.15 },
      );

      io.observe(el);
    })();

    return () => {
      io?.disconnect();
      io = null;
      if (gsapRef) {
        gsapRef.killTweensOf(tEls);
        gsapRef.killTweensOf(mEls);
      }
    };
  }, [section.enableGsap]);

  const coverUrl = getStrapiMediaUrl(section.media);
  const hasMedia = Boolean(coverUrl);

  const heightMode = section.background?.heightMode;
  const noMediaHeightClass =
    heightMode === "当前屏幕高度的2/3"
      ? "h-[66.667vh]"
      : heightMode === "当前屏幕高度的1/2"
      ? "h-[50vh]"
      : heightMode === "当前屏幕高度的1/3"
        ? "h-[33.333vh]"
        : getSelectionHeightClass(section.background);

  const wrapperHeightClass = hasMedia ? getSelectionHeightClass(section.background) : noMediaHeightClass;

  // 背景的选择不影响媒体属性；只有当 media 为空时才隐藏 media 并居中文本。
  const isVideo = useMemo(() => {
    if (!hasMedia || !coverUrl) return false;
    const lower = coverUrl.toLowerCase();
    return lower.includes(".mp4") || lower.includes(".webm");
  }, [hasMedia, coverUrl]);

  if (!hasMedia) {
    const textPadClass = wrapperHeightClass ? "py-0" : "py-10";
    const innerHeightClass = wrapperHeightClass ? "h-full" : "";

    return (
      <section ref={wrapRef} className={`relative overflow-hidden w-full ${wrapperHeightClass}`}>
        <SectionBackground background={section.background} />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
          <div className={`flex ${innerHeightClass} items-center justify-center ${textPadClass} text-center`}>
            <div className="w-full">
              {section.eyebrow && (
                <p data-anim="text" className="text-[11px] font-medium uppercase tracking-widest text-black/50">
                  {section.eyebrow}
                </p>
              )}
              {section.title && (
                <h2 data-anim="text" className={`mt-3 ${selectionTitleClass}`}>
                  {section.title}
                </h2>
              )}
              {section.body && (
                <p data-anim="text" className={`mt-6 ${selectionDescriptionClass}`}>
                  {section.body}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
  const reverse = Boolean(section.reverse);
  const layout = section.layout ?? (reverse ? "左图右文本" : "左文本右图");
  const textFirst = layout === "左文本右图";

  const ratioPreset = section.ratioPreset ?? "50/50";
  const parseCustomTextPercent = () => {
    const raw = section.customTextPercent;
    const n = raw == null ? 50 : Number(raw);
    return Math.max(0, Math.min(100, Number.isFinite(n) ? n : 50));
  };

  const textPercent =
    ratioPreset === "40/60" ? 40 : ratioPreset === "60/40" ? 60 : ratioPreset === "custom" ? parseCustomTextPercent() : 50;
  const mediaPercent = 100 - textPercent;

  const isViewportHeightMode =
    section.background?.heightMode === "当前屏幕高度" ||
    section.background?.heightMode === "viewport" ||
    section.background?.heightMode === "100vh";
  const splitMediaFrameClass = isViewportHeightMode ? "h-[52vh]" : "aspect-[16/10]";

  return (
    <section ref={wrapRef} className={`relative overflow-hidden w-full ${wrapperHeightClass}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
        {isVideo ? (
          <div className="flex flex-col gap-10 py-10">
            <div className="text-center">
              {section.eyebrow && (
                <p data-anim="text" className="text-[11px] font-medium uppercase tracking-widest text-black/50">
                  {section.eyebrow}
                </p>
              )}
              {section.title && (
                <h2 data-anim="text" className={`mt-3 ${selectionTitleClass}`}>
                  {section.title}
                </h2>
              )}
              {section.body && (
                <p data-anim="text" className={`mt-6 ${selectionDescriptionClass}`}>
                  {section.body}
                </p>
              )}
            </div>

            <div data-anim="media" className="relative overflow-hidden rounded-3xl bg-black/[0.04]">
              <div className={`relative w-full ${splitMediaFrameClass}`}>
                {coverUrl ? (
                  <video className="h-full w-full object-cover" src={coverUrl} autoPlay muted playsInline loop />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[13px] text-black/40">暂无媒体</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="grid items-center gap-10 py-10 lg:grid-cols-[var(--split-text)_var(--split-media)]"
            style={
              {
                "--split-text": `${textPercent}%`,
                "--split-media": `${mediaPercent}%`,
              } as CSSProperties
            }
          >
            {textFirst ? (
              <>
                <div className="text-center lg:text-left">
                  {section.eyebrow && (
                    <p data-anim="text" className="text-[11px] font-medium uppercase tracking-widest text-black/50">
                      {section.eyebrow}
                    </p>
                  )}
                  {section.title && (
                    <h2 data-anim="text" className={`mt-3 ${selectionTitleClass}`}>
                      {section.title}
                    </h2>
                  )}
                  {section.body && (
                    <p data-anim="text" className={`mt-6 ${selectionDescriptionClass}`}>
                      {section.body}
                    </p>
                  )}
                </div>
                <div data-anim="media" className="relative overflow-hidden rounded-3xl bg-black/[0.04]">
                  <div className={`relative w-full ${splitMediaFrameClass}`}>
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={section.title ?? ""}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 600px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[13px] text-black/40">暂无媒体</div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div data-anim="media" className="relative overflow-hidden rounded-3xl bg-black/[0.04]">
                  <div className={`relative w-full ${splitMediaFrameClass}`}>
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={section.title ?? ""}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 600px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[13px] text-black/40">暂无媒体</div>
                    )}
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  {section.eyebrow && (
                    <p data-anim="text" className="text-[11px] font-medium uppercase tracking-widest text-black/50">
                      {section.eyebrow}
                    </p>
                  )}
                  {section.title && (
                    <h2 data-anim="text" className={`mt-3 ${selectionTitleClass}`}>
                      {section.title}
                    </h2>
                  )}
                  {section.body && (
                    <p data-anim="text" className={`mt-6 ${selectionDescriptionClass}`}>
                      {section.body}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
