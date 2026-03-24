"use client";

import { useEffect, useRef } from "react";
import type { ProductSection } from "./types";
import { ProductSectionRenderer } from "./ProductSectionRenderer";

export function TextOnlyPinnedGroup({ sections }: { sections: ProductSection[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let ctx: { revert?: () => void } | undefined;
    let cancelled = false;
    const marginsToReset: HTMLDivElement[] = [];

    void (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      ctx = gsap.context(() => {
        const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];
        const animPanels = panels.slice(0, -1);

        animPanels.forEach((panel) => {
          const innerPanel = panel.querySelector<HTMLElement>("[data-pinned-inner]");
          if (!innerPanel) return;

          const panelHeight = innerPanel.offsetHeight;
          const windowHeight = window.innerHeight;
          const difference = panelHeight - windowHeight;
          const fakeScrollRatio =
            difference > 0 ? difference / (difference + windowHeight) : 0;

          if (fakeScrollRatio) {
            panel.style.marginBottom = `${panelHeight * fakeScrollRatio}px`;
            marginsToReset.push(panel);
          }

          if (fakeScrollRatio) {
            gsap.to(innerPanel, {
              yPercent: -100,
              y: window.innerHeight,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "bottom bottom",
                end: () => `+=${innerPanel.offsetHeight}`,
                pinSpacing: false,
                pin: true,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            return;
          }

          ScrollTrigger.create({
            trigger: panel,
            start: "bottom bottom",
            end: "bottom top",
            pinSpacing: false,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          });
        });
      }, wrap);
    })();

    return () => {
      cancelled = true;
      marginsToReset.forEach((el) => {
        el.style.marginBottom = "";
      });
      ctx?.revert?.();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      {sections.map((section, idx) => (
        <div
          key={`text-pinned-panel-${section.id ?? idx}`}
          ref={(el) => {
            panelRefs.current[idx] = el;
          }}
          className="relative origin-center"
        >
          <div data-pinned-inner>
            <ProductSectionRenderer section={section} />
          </div>
        </div>
      ))}
    </div>
  );
}
