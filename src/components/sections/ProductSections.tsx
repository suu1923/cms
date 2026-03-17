"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { getStrapiMediaUrl } from "@/lib/cmsClient";

type SectionBase = { __component: string; id?: number };

type CarouselItem = { id?: number; title?: string; caption?: string; image?: unknown };
type SectionCarousel = SectionBase & {
  __component: "sections.section-carousel";
  title?: string;
  subtitle?: string;
  enableGsap?: boolean;
  items?: CarouselItem[];
};

type GridItem = { id?: number; title?: string; description?: string; image?: unknown };
type SectionGrid = SectionBase & {
  __component: "sections.section-grid";
  title?: string;
  columns?: "2" | "3" | "4";
  items?: GridItem[];
};

type SectionSplit = SectionBase & {
  __component: "sections.section-split";
  eyebrow?: string;
  title?: string;
  body?: string;
  media?: unknown;
  reverse?: boolean;
  enableGsap?: boolean;
};

type FaqItem = { id?: number; question: string; answer: string };
type SectionFaq = SectionBase & {
  __component: "sections.section-faq";
  title?: string;
  items?: FaqItem[];
};

type SectionRichText = SectionBase & {
  __component: "sections.section-rich-text";
  title?: string;
  body?: unknown;
};

type CompareRow = { id?: number; label: string; valueA?: string; valueB?: string };
type SectionCompare = SectionBase & {
  __component: "sections.section-compare";
  title?: string;
  columnA?: string;
  columnB?: string;
  rows?: CompareRow[];
};

type TimelineItem = { id?: number; title: string; description?: string; image?: unknown };
type SectionTimeline = SectionBase & {
  __component: "sections.section-timeline";
  title?: string;
  items?: TimelineItem[];
};

type StickyStoryStep = { id?: number; title: string; body?: string; media?: unknown };
type SectionStickyStory = SectionBase & {
  __component: "sections.section-sticky-story";
  title?: string;
  enableGsap?: boolean;
  steps?: StickyStoryStep[];
};

export type ProductSection =
  | SectionCarousel
  | SectionGrid
  | SectionSplit
  | SectionFaq
  | SectionRichText
  | SectionCompare
  | SectionTimeline
  | SectionStickyStory;

export function ProductSections({ sections }: { sections: ProductSection[] }) {
  return (
    <div className="mt-14 space-y-20">
      {sections.map((s, idx) => (
        <SectionRenderer key={`${s.__component}-${s.id ?? idx}`} section={s} />
      ))}
    </div>
  );
}

function SectionRenderer({ section }: { section: ProductSection }) {
  switch (section.__component) {
    case "sections.section-carousel":
      return <SectionCarouselView section={section} />;
    case "sections.section-grid":
      return <SectionGridView section={section} />;
    case "sections.section-split":
      return <SectionSplitView section={section} />;
    case "sections.section-faq":
      return <SectionFaqView section={section} />;
    case "sections.section-rich-text":
      return <SectionRichTextView section={section} />;
    case "sections.section-compare":
      return <SectionCompareView section={section} />;
    case "sections.section-timeline":
      return <SectionTimelineView section={section} />;
    case "sections.section-sticky-story":
      return <SectionStickyStoryView section={section} />;
    default:
      return null;
  }
}

function SectionCarouselView({ section }: { section: SectionCarousel }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!section.enableGsap) return;
    if (!trackRef.current) return;
    let ctx: any;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          trackRef.current,
          { x: 0 },
          {
            x: () => {
              const el = trackRef.current!;
              return -(el.scrollWidth - el.clientWidth);
            },
            ease: "none",
            scrollTrigger: {
              trigger: trackRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      }, trackRef);
    })();
    return () => ctx?.revert?.();
  }, [section.enableGsap]);

  const items = section.items ?? [];

  return (
    <section>
      {(section.title || section.subtitle) && (
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          {section.title && <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">{section.title}</h2>}
          {section.subtitle && <p className="mt-3 max-w-2xl text-[15px] text-black/70">{section.subtitle}</p>}
        </div>
      )}

      <div className="mx-auto mt-8 max-w-[1200px] px-6 sm:px-8">
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((it, i) => {
            const url = getStrapiMediaUrl(it.image);
            return (
              <div key={it.id ?? i} className="w-[320px] shrink-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/[0.04]">
                  {url ? (
                    <Image src={url} alt={it.title ?? ""} fill className="object-cover" sizes="320px" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[13px] text-black/40">暂无图片</div>
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
    </section>
  );
}

function SectionGridView({ section }: { section: SectionGrid }) {
  const cols = section.columns ?? "3";
  const className =
    cols === "2"
      ? "sm:grid-cols-2"
      : cols === "4"
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  const items = section.items ?? [];

  return (
    <section className="mx-auto max-w-[1200px] px-6 sm:px-8">
      {section.title && <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">{section.title}</h2>}
      <div className={`mt-8 grid gap-6 ${className}`}>
        {items.map((it, i) => {
          const url = getStrapiMediaUrl(it.image);
          return (
            <div key={it.id ?? i} className="rounded-2xl border border-black/[0.08] bg-white p-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/[0.04]">
                {url ? (
                  <Image src={url} alt={it.title ?? ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 360px" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[13px] text-black/40">暂无图片</div>
                )}
              </div>
              {it.title && <h3 className="mt-4 text-[15px] font-medium text-black">{it.title}</h3>}
              {it.description && <p className="mt-2 text-[13px] leading-relaxed text-black/70">{it.description}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionSplitView({ section }: { section: SectionSplit }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!section.enableGsap) return;
    if (!wrapRef.current) return;
    let ctx: any;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const el = wrapRef.current!;
        const t = el.querySelectorAll("[data-anim='text']");
        const m = el.querySelectorAll("[data-anim='media']");
        gsap.fromTo(
          t,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 80%" },
          },
        );
        gsap.fromTo(
          m,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      }, wrapRef);
    })();
    return () => ctx?.revert?.();
  }, [section.enableGsap]);

  const url = getStrapiMediaUrl(section.media);
  const isVideo = useMemo(() => (url ? url.toLowerCase().includes(".mp4") || url.toLowerCase().includes(".webm") : false), [url]);
  const reverse = Boolean(section.reverse);

  return (
    <section ref={wrapRef} className="mx-auto max-w-[1200px] px-6 sm:px-8">
      <div className={`grid gap-10 lg:grid-cols-2 lg:items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          {section.eyebrow && (
            <p data-anim="text" className="text-[11px] font-medium uppercase tracking-widest text-black/50">
              {section.eyebrow}
            </p>
          )}
          {section.title && (
            <h2 data-anim="text" className="mt-3 text-3xl font-extralight tracking-tight text-black sm:text-4xl">
              {section.title}
            </h2>
          )}
          {section.body && (
            <p data-anim="text" className="mt-6 text-[15px] leading-relaxed text-black/75">
              {section.body}
            </p>
          )}
        </div>
        <div data-anim="media" className="relative overflow-hidden rounded-3xl bg-black/[0.04]">
          <div className="relative aspect-[16/10] w-full">
            {url ? (
              isVideo ? (
                <video className="h-full w-full object-cover" src={url} controls playsInline />
              ) : (
                <Image src={url} alt={section.title ?? ""} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 600px" unoptimized />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[13px] text-black/40">暂无媒体</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionFaqView({ section }: { section: SectionFaq }) {
  const items = section.items ?? [];
  return (
    <section className="mx-auto max-w-[900px] px-6 sm:px-8">
      {section.title && <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">{section.title}</h2>}
      <div className="mt-6 divide-y divide-black/[0.06] rounded-2xl border border-black/[0.08] bg-white">
        {items.map((it, i) => (
          <details key={it.id ?? i} className="group px-5 py-4">
            <summary className="cursor-pointer list-none text-[15px] font-medium text-black/85">
              {it.question}
              <span className="float-right text-black/40 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-black/70">{it.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function SectionRichTextView({ section }: { section: SectionRichText }) {
  // 先做“简版”：如果 body 是字符串数组就渲染段落；其它结构先跳过
  const paras = Array.isArray(section.body) ? (section.body as unknown[]) : [];
  const lines = paras.filter((x) => typeof x === "string") as string[];

  if (!section.title && lines.length === 0) return null;

  return (
    <section className="mx-auto max-w-[900px] px-6 sm:px-8">
      {section.title && <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">{section.title}</h2>}
      {lines.length > 0 && (
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-black/75">
          {lines.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      )}
    </section>
  );
}

function SectionCompareView({ section }: { section: SectionCompare }) {
  const rows = section.rows ?? [];
  const colA = section.columnA ?? "方案 A";
  const colB = section.columnB ?? "方案 B";

  return (
    <section className="mx-auto max-w-[900px] px-6 sm:px-8">
      {section.title && (
        <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">
          {section.title}
        </h2>
      )}
      <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
        <div className="grid grid-cols-[minmax(140px,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-black/[0.06] bg-black/[0.02] px-5 py-3 text-[12px] font-medium text-black/70">
          <div>对比项</div>
          <div>{colA}</div>
          <div>{colB}</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.id ?? i}
            className="grid grid-cols-[minmax(140px,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b border-black/[0.06] px-5 py-4 last:border-b-0"
          >
            <div className="text-[13px] font-medium text-black/80">{r.label}</div>
            <div className="text-[13px] text-black/70">{r.valueA ?? "-"}</div>
            <div className="text-[13px] text-black/70">{r.valueB ?? "-"}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTimelineView({ section }: { section: SectionTimeline }) {
  const items = section.items ?? [];
  return (
    <section className="mx-auto max-w-[900px] px-6 sm:px-8">
      {section.title && (
        <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">
          {section.title}
        </h2>
      )}
      <div className="mt-8 space-y-6">
        {items.map((it, i) => {
          const url = getStrapiMediaUrl(it.image);
          return (
            <div key={it.id ?? i} className="grid gap-6 rounded-2xl border border-black/[0.08] bg-white p-6 sm:grid-cols-[96px_1fr]">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-[13px]">
                  {i + 1}
                </div>
                {url && (
                  <div className="relative hidden h-10 w-10 overflow-hidden rounded-lg bg-black/[0.06] sm:block">
                    <Image src={url} alt={it.title} fill className="object-cover" sizes="40px" unoptimized />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-[15px] font-medium text-black">{it.title}</h3>
                {it.description && <p className="mt-2 text-[13px] leading-relaxed text-black/70">{it.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionStickyStoryView({ section }: { section: SectionStickyStory }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const steps = section.steps ?? [];

  useEffect(() => {
    if (!section.enableGsap) return;
    if (!wrapRef.current) return;
    if (steps.length < 2) return;
    let ctx: any;

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
    <section ref={wrapRef} className="mx-auto max-w-[1200px] px-6 sm:px-8">
      {section.title && (
        <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">
          {section.title}
        </h2>
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
                      <Image src={url} alt={s.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 700px" unoptimized />
                    )
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[13px] text-black/40">暂无媒体</div>
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

