"use client";

import { type ReactNode, useEffect, useRef } from "react";
import type { ProductSection } from "./types";
import { ProductSectionRenderer } from "./ProductSectionRenderer";
import { TextOnlyPinnedGroup } from "./TextOnlyPinnedPair";

export type { ProductSection } from "./types";

export function ProductSections({
  sections,
  enableContinuousTextOnlyDisplay = false,
}: {
  sections: ProductSection[];
  enableContinuousTextOnlyDisplay?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rendered: ReactNode[] = [];
  const isViewportHeightMode = (mode?: string) =>
    mode === "当前屏幕高度" ||
    mode === "当前屏幕高度的2/3" ||
    mode === "当前屏幕高度的1/2" ||
    mode === "当前屏幕高度的1/3" ||
    mode === "viewport" ||
    mode === "100vh";

  for (let i = 0; i < sections.length; i += 1) {
    const current = sections[i];

    if (enableContinuousTextOnlyDisplay && current?.__component === "sections.section-text-only") {
      const group: ProductSection[] = [current];
      let j = i + 1;
      while (j < sections.length && sections[j].__component === "sections.section-text-only") {
        group.push(sections[j]);
        j += 1;
      }

      const allUseViewportHeight = group.every((s) => isViewportHeightMode(s.background?.heightMode));

      if (group.length >= 2) {
        if (allUseViewportHeight) {
          rendered.push(
            <TextOnlyPinnedGroup
              key={`text-only-pinned-group-${group.map((s, idx) => s.id ?? i + idx).join("-")}`}
              sections={group}
            />,
          );
        } else {
          group.forEach((s, idx) => {
            rendered.push(
              <ProductSectionRenderer key={`${s.__component}-${s.id ?? i + idx}`} section={s} />,
            );
          });
        }
        i = j - 1;
        continue;
      }

      rendered.push(
        <ProductSectionRenderer key={`${current.__component}-${current.id ?? i}`} section={current} />,
      );
      continue;
    }

    rendered.push(
      <ProductSectionRenderer key={`${current.__component}-${current.id ?? i}`} section={current} />,
    );
  }

  // 与 Strapi selection 顺序无关：布局高度变化则刷新 ScrollTrigger
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let t = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        // 双 rAF：等布局/图片占位稳定后再算 pin spacer，减少「滑一下又跳」
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
              ScrollTrigger.refresh();
            });
          });
        });
      }, 100);
    };

    scheduleRefresh();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => scheduleRefresh());
      ro.observe(el);
    }

    const onLayout = () => scheduleRefresh();
    window.addEventListener("resize", onLayout);
    window.addEventListener("orientationchange", onLayout);

    return () => {
      window.clearTimeout(t);
      ro?.disconnect();
      window.removeEventListener("resize", onLayout);
      window.removeEventListener("orientationchange", onLayout);
    };
  }, []);

  return (
    <div ref={rootRef} className="mt-14">
      {rendered}
    </div>
  );
}
