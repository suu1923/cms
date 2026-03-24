"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

export function ProductBentoCover({
  title,
  summary,
  images,
}: {
  title: string;
  summary?: string;
  images: string[];
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRef = useRef<HTMLDivElement | null>(null);

  const cards = useMemo(() => images.slice(0, 6), [images]);
  const hasEnough = cards.length >= 3;

  useEffect(() => {
    if (!hasEnough) return;
    const root = rootRef.current;
    if (!root) return;
    const titleEl = titleRef.current;
    const els = cardRefs.current.filter((n): n is HTMLDivElement => Boolean(n));
    if (!titleEl || els.length === 0) return;

    let ctx: { revert?: () => void } | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.set(els, { y: 70, opacity: 0, scale: 0.92 });
        gsap.set(titleEl, { y: 0, opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 1.8, root.offsetHeight * 1.15)}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(
          els,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            duration: 0.55,
            ease: "power2.out",
          },
          0,
        )
          .to(
            titleEl,
            {
              y: -24,
              opacity: 0.86,
              duration: 0.4,
              ease: "none",
            },
            0.1,
          )
          .to(
            els,
            {
              scale: 1.08,
              duration: 0.75,
              ease: "none",
            },
            0.55,
          )
          .to(
            els,
            {
              opacity: 0.9,
              duration: 0.35,
              ease: "none",
            },
            1.05,
          );
      }, root);
    })();

    return () => ctx?.revert?.();
  }, [hasEnough, cards.length]);

  if (!hasEnough) return null;

  return (
    <section ref={rootRef} className="relative min-h-[120vh] overflow-hidden bg-black sm:min-h-[130vh]">
      <div className="absolute inset-0 bg-black" />
      <div ref={titleRef} className="absolute inset-x-0 top-28 z-20 mx-auto max-w-[980px] px-6 text-center sm:top-32">
        <h1 className="text-4xl font-light tracking-tight text-white sm:text-6xl">{title}</h1>
        {summary ? (
          <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-relaxed text-white/86 sm:text-[18px]">
            {summary}
          </p>
        ) : null}
      </div>

      <div className="relative z-10 mx-auto grid min-h-[120vh] max-w-[1400px] grid-cols-12 grid-rows-6 gap-3 p-4 sm:min-h-[130vh] sm:gap-4 sm:p-6">
        {cards.map((url, idx) => {
          const pos =
            idx === 0
              ? "col-span-5 row-span-4"
              : idx === 1
                ? "col-span-3 col-start-6 row-span-2"
                : idx === 2
                  ? "col-span-4 col-start-9 row-span-3"
                  : idx === 3
                    ? "col-span-4 row-span-2 row-start-5"
                    : idx === 4
                      ? "col-span-4 col-start-5 row-span-3 row-start-3"
                      : "col-span-4 col-start-9 row-span-2 row-start-4";
          return (
            <div
              key={`${url}-${idx}`}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 ${pos}`}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                unoptimized
                priority={idx < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

