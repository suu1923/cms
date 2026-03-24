"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import { SectionBackground, getSelectionHeightClass, selectionTitleClass } from "./sectionShared";
import type { SectionStickyStory as SectionStickyStoryType } from "./types";

export default function SectionStickyStory({ section }: { section: SectionStickyStoryType }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const steps = section.steps ?? [];

  useEffect(() => {
    if (!section.enableGsap) return;
    if (!wrapRef.current) return;
    if (steps.length < 2) return;
    let ctx: { revert?: () => void } | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const el = wrapRef.current!;
        const panels = el.querySelectorAll("[data-story-panel]");
        const dots = el.querySelectorAll("[data-story-dot]");

        gsap.set(panels, { autoAlpha: 0 });
        gsap.set(panels[0], { autoAlpha: 1 });
        gsap.set(dots, { opacity: 0.35 });
        gsap.set(dots[0], { opacity: 1 });

        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: () => `+=${Math.max(1, steps.length - 1) * 700}`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            panels.forEach((p, i) => gsap.set(p, { autoAlpha: i === idx ? 1 : 0 }));
            dots.forEach((d, i) => gsap.set(d, { opacity: i === idx ? 1 : 0.35 }));
          },
        });
      }, wrapRef);
    })();

    return () => ctx?.revert?.();
  }, [section.enableGsap, steps.length]);

  return (
    <section ref={wrapRef} className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
        {section.title && (
          <h2 className={selectionTitleClass}>{section.title}</h2>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] lg:items-center">
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={s.id ?? i} className="flex gap-3">
                <div data-story-dot className="mt-1.5 h-2.5 w-2.5 rounded-full bg-black" />
                <div>
                  <h3 className="text-[15px] font-medium text-black">{s.title}</h3>
                  {s.body && <p className="mt-2 text-[13px] leading-relaxed text-black/70">{s.body}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-black/[0.04]">
            <div className="relative aspect-[16/10] w-full">
              {steps.map((s, i) => {
                const url = getStrapiMediaUrl(s.media);
                const isVideo = url ? url.toLowerCase().includes(".mp4") || url.toLowerCase().includes(".webm") : false;
                return (
                  <div key={s.id ?? i} data-story-panel className="absolute inset-0">
                    {url ? (
                      isVideo ? (
                        <video className="h-full w-full object-cover" src={url} controls playsInline />
                      ) : (
                        <Image
                          src={url}
                          alt={s.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 700px"
                          unoptimized
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[13px] text-black/40">
                        暂无媒体
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
