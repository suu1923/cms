"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { getStrapiMediaUrls } from "@/lib/cmsClient";
import {
  SectionBackground,
  getSelectionHeightClass,
  selectionDescriptionClass,
  selectionTitleClass,
} from "./sectionShared";
import type { SectionSplitGallery as SectionSplitGalleryType } from "./types";

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function getActionClass(variant?: "solid" | "outline" | "link") {
  if (variant === "solid") {
    return "rounded border border-black bg-black px-6 py-2.5 text-[13px] font-medium text-white transition hover:bg-black/90";
  }
  if (variant === "link") {
    return "px-1 py-2 text-[14px] font-medium text-black/82 transition hover:text-black";
  }
  return "rounded border border-black/20 bg-transparent px-6 py-2.5 text-[13px] font-medium text-black transition hover:bg-black/5";
}

export default function SectionSplitGallery({ section }: { section: SectionSplitGalleryType }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const images = useMemo(
    () => getStrapiMediaUrls(section.images),
    [section.images],
  );
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  const mode = section.layoutMode ?? "左图右文本";
  const isTopBottom = mode === "上文下图";
  const isRightText = mode === "左图右文本";
  const topBottomCarousel = isTopBottom && section.enableCarouselInTopBottom === true;
  const imageRadiusClass = section.imageRounded === false ? "" : "rounded-2xl";
  const imageRadiusLargeClass = section.imageRounded === false ? "" : "rounded-3xl";
  const stats = (section.stats ?? []).filter((item) => item?.value && item?.label);
  const actions = (section.actions ?? []).filter((item) => item?.label && item?.href);
  const textAlignClass = isTopBottom ? "text-center" : "text-center lg:text-left";

  useEffect(() => {
    if (!section.enableGsap) return;
    const el = wrapRef.current;
    if (!el) return;

    let io: IntersectionObserver | null = null;
    let gsapRef: typeof import("gsap").default | null = null;
    let textEls: HTMLElement[] = [];
    let mediaEls: HTMLElement[] = [];

    const mediaFromX = isTopBottom ? 42 : isRightText ? -42 : 42;
    const textFromX = isTopBottom ? -42 : isRightText ? 42 : -42;

    (async () => {
      const gsap = (await import("gsap")).default;
      gsapRef = gsap;
      textEls = Array.from(el.querySelectorAll<HTMLElement>("[data-anim-sg='text']"));
      mediaEls = Array.from(el.querySelectorAll<HTMLElement>("[data-anim-sg='media']"));

      // 避免首屏未触发 observer 时模块不可见
      gsap.set(textEls, { x: 0, opacity: 1 });
      gsap.set(mediaEls, { x: 0, opacity: 1 });

      const reset = () => {
        if (!gsapRef) return;
        gsapRef.killTweensOf(textEls);
        gsapRef.killTweensOf(mediaEls);
        gsapRef.set(textEls, { x: textFromX, opacity: 0 });
        gsapRef.set(mediaEls, { x: mediaFromX, opacity: 0 });
      };

      const play = () => {
        if (!gsapRef) return;
        gsapRef.killTweensOf(textEls);
        gsapRef.killTweensOf(mediaEls);
        gsapRef.set(textEls, { x: textFromX, opacity: 0 });
        gsapRef.set(mediaEls, { x: mediaFromX, opacity: 0 });
        gsapRef.to(mediaEls, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" });
        gsapRef.to(textEls, { x: 0, opacity: 1, duration: 0.85, ease: "power3.out", delay: 0.08 });
      };

      let visible = false;
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            if (!visible) {
              visible = true;
              play();
            }
          } else if (visible) {
            visible = false;
            reset();
          }
        },
        { threshold: 0.2 },
      );
      io.observe(el);
    })();

    return () => {
      io?.disconnect();
      if (gsapRef) {
        gsapRef.killTweensOf(textEls);
        gsapRef.killTweensOf(mediaEls);
      }
    };
  }, [section.enableGsap, isTopBottom, isRightText]);

  return (
    <section
      ref={wrapRef}
      className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}
    >
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[1300px] px-6 py-12 sm:px-8 sm:py-14">
        {isTopBottom ? (
          <>
            <div className="mx-auto max-w-[860px] text-center" data-anim-sg="text">
              {section.title ? <h2 className={selectionTitleClass}>{section.title}</h2> : null}
              {section.body ? <p className={`mt-5 ${selectionDescriptionClass}`}>{section.body}</p> : null}
            </div>
            {topBottomCarousel ? (
              <div className="mt-9" data-anim-sg="media">
                <div className={`relative mx-auto max-w-[980px] overflow-hidden border border-black/8 bg-white shadow-[0_8px_26px_rgba(0,0,0,0.06)] ${imageRadiusClass}`}>
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={images[active]}
                      alt={section.title ?? "图文图片"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActive((p) => (p - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/35 text-xl leading-none text-white"
                        aria-label="上一张"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => setActive((p) => (p + 1) % images.length)}
                        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/35 text-xl leading-none text-white"
                        aria-label="下一张"
                      >
                        ›
                      </button>
                      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={`tb-dot-${idx}`}
                            type="button"
                            onClick={() => setActive(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === active ? "w-6 bg-white" : "w-2 bg-white/65"
                            }`}
                            aria-label={`切换到第${idx + 1}张`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-anim-sg="media">
                {images.map((url, idx) => (
                  <div key={`${url}-${idx}`} className={`overflow-hidden border border-black/8 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.05)] ${imageRadiusClass}`}>
                    <div className="relative aspect-[4/3]">
                      <Image src={url} alt={section.title ?? "图文图片"} fill className="object-cover" unoptimized />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(stats.length > 0 || actions.length > 0) && (
              <div className="mx-auto max-w-[860px]" data-anim-sg="text">
                {stats.length > 0 && (
                  <div className="mt-10 flex flex-wrap justify-center gap-10">
                    {stats.map((item, idx) => (
                      <div key={`stat-top-${item.value}-${idx}`}>
                        <span className="block text-2xl font-extralight text-black">
                          {item.value}
                        </span>
                        <span className="mt-1 block text-[13px] text-black/60">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {actions.length > 0 && (
                  <div className="mt-10 flex flex-wrap justify-center gap-4">
                    {actions.map((action, idx) => {
                      const external = isExternalUrl(action.href!);
                      return (
                        <Link
                          key={`action-top-${action.href}-${idx}`}
                          href={action.href!}
                          className={getActionClass(action.variant)}
                          target={action.openInNewTab || external ? "_blank" : undefined}
                          rel={action.openInNewTab || external ? "noreferrer noopener" : undefined}
                        >
                          {action.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={`grid items-center gap-8 lg:grid-cols-2 ${isRightText ? "" : "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"}`}>
            <div
              className={`relative overflow-hidden bg-black/[0.04] ${imageRadiusLargeClass}`}
              data-anim-sg="media"
            >
              <div className="relative aspect-[16/10]">
                <Image src={images[active]} alt={section.title ?? "图文图片"} fill className="object-cover" unoptimized />
              </div>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActive((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/30 text-xl leading-none text-white"
                    aria-label="上一张"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setActive((p) => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/30 text-xl leading-none text-white"
                    aria-label="下一张"
                  >
                    ›
                  </button>
                  <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={`dot-${idx}`}
                        type="button"
                        onClick={() => setActive(idx)}
                        className={`h-2 rounded-full transition-all ${idx === active ? "w-6 bg-white" : "w-2 bg-white/60"}`}
                        aria-label={`切换到第${idx + 1}张`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className={textAlignClass} data-anim-sg="text">
              {section.title ? <h2 className={selectionTitleClass}>{section.title}</h2> : null}
              {section.body ? <p className={`mt-5 ${selectionDescriptionClass}`}>{section.body}</p> : null}
              {stats.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-10">
                  {stats.map((item, idx) => (
                    <div key={`stat-split-${item.value}-${idx}`}>
                      <span className="block text-2xl font-extralight text-black">
                        {item.value}
                      </span>
                      <span className="mt-1 block text-[13px] text-black/60">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {actions.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-4">
                  {actions.map((action, idx) => {
                    const external = isExternalUrl(action.href!);
                    return (
                      <Link
                        key={`action-split-${action.href}-${idx}`}
                        href={action.href!}
                        className={getActionClass(action.variant)}
                        target={action.openInNewTab || external ? "_blank" : undefined}
                        rel={action.openInNewTab || external ? "noreferrer noopener" : undefined}
                      >
                        {action.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

