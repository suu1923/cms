"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import {
  SectionBackground,
  getSelectionHeightClass,
  selectionTitleClass,
} from "./sectionShared";
import type {
  ProductCategoryCardItem,
  SectionProductCategories as SectionProductCategoriesType,
} from "./types";

function getItemImage(item: ProductCategoryCardItem): string {
  const mediaUrl = getStrapiMediaUrl(item.cover);
  return mediaUrl || "";
}

function coveredIndexes(anchorRow: number, anchorCol: number) {
  return new Set([
    anchorRow * 3 + anchorCol,
    anchorRow * 3 + (anchorCol + 1),
    (anchorRow + 1) * 3 + anchorCol,
    (anchorRow + 1) * 3 + (anchorCol + 1),
  ]);
}

export default function SectionProductCategories({
  section,
}: {
  section: SectionProductCategoriesType;
}) {
  const [activeDesktopIndex, setActiveDesktopIndex] = useState<number | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState<number | null>(null);

  const items = useMemo(
    () => (section.categories ?? []).slice(0, section.maxItems ?? 9),
    [section.categories, section.maxItems],
  );
  const isTitleCenter = section.titleAlign !== "left";
  const isSixStrip = section.stylePreset === "six-strip";

  if (items.length === 0) return null;

  const active = activeDesktopIndex != null ? items[activeDesktopIndex] : null;
  const activeRow = activeDesktopIndex != null ? Math.floor(activeDesktopIndex / 3) : 0;
  const activeCol = activeDesktopIndex != null ? activeDesktopIndex % 3 : 0;
  const anchorRow = Math.min(activeRow, 1);
  const anchorCol = Math.min(activeCol, 1);
  const covered = activeDesktopIndex != null ? coveredIndexes(anchorRow, anchorCol) : new Set<number>();

  return (
    <section
      className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}
    >
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-12 sm:px-8 sm:py-14">
        <div className={`max-w-[760px] ${isTitleCenter ? "mx-auto text-center" : ""}`}>
          {/* 不再展示副标题小字（如「产品中心」），避免后台必须单独配置；主标题仍用 title */}
          <h2 className={selectionTitleClass}>{section.title ?? "产品分类"}</h2>
        </div>

        {isSixStrip ? (
          <div
            className="relative left-1/2 right-1/2 mt-8 hidden h-[clamp(340px,42vw,520px)] w-screen -translate-x-1/2 overflow-hidden md:block"
            onMouseLeave={() => setActiveDesktopIndex(null)}
          >
            {items.slice(0, 6).map((item, idx) => {
              const startCol = activeDesktopIndex != null ? Math.min(activeDesktopIndex, 3) : 0;
              const hiddenByExpanded =
                activeDesktopIndex != null &&
                idx >= startCol &&
                idx <= startCol + 2 &&
                idx !== activeDesktopIndex;
              const image = getItemImage(item);
              return (
                <button
                  type="button"
                  key={`strip-${item.slug}-${idx}`}
                  onMouseEnter={() => setActiveDesktopIndex(idx)}
                  onFocus={() => setActiveDesktopIndex(idx)}
                  className={`absolute inset-y-0 overflow-hidden text-left transition-all duration-300 ${
                    hiddenByExpanded ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                  style={{
                    left: `${idx * (100 / 6)}%`,
                    width: `${100 / 6}%`,
                  }}
                >
                  {idx > 0 && (
                    <span
                      className="absolute left-0 top-[-8%] z-20 h-[116%] w-px bg-white/55"
                      style={{ transform: "rotate(12deg)", transformOrigin: "top left" }}
                    />
                  )}
                  {image ? (
                    <img src={image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-black/35 to-black/10" />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[18px] font-medium tracking-tight text-white">{item.name}</p>
                  </div>
                </button>
              );
            })}

            {activeDesktopIndex != null && items[activeDesktopIndex] && (
              <div
                className="absolute inset-y-0 z-30 overflow-hidden shadow-2xl transition-all duration-300"
                style={{
                  left: `${Math.min(activeDesktopIndex, 3) * (100 / 6)}%`,
                  width: "50%",
                }}
              >
                {getItemImage(items[activeDesktopIndex]) ? (
                  <img
                    src={getItemImage(items[activeDesktopIndex])}
                    alt={items[activeDesktopIndex].name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-black/40 to-black/14" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                  <h3 className="text-[34px] font-light tracking-tight text-white sm:text-[40px]">
                    {items[activeDesktopIndex].name}
                  </h3>
                  {items[activeDesktopIndex].summary ? (
                    <p className="mt-3 max-w-[80%] text-[16px] leading-relaxed text-white/88">
                      {items[activeDesktopIndex].summary}
                    </p>
                  ) : null}
                  <Link
                    href={`/products/${items[activeDesktopIndex].slug}`}
                    className="mt-5 inline-flex items-center rounded-md border border-white/60 px-4 py-2 text-[14px] font-medium text-white transition hover:bg-white/12"
                  >
                    点击前往
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="relative mt-8 hidden h-[clamp(520px,62vw,820px)] rounded-2xl bg-transparent p-2 md:block"
            onMouseLeave={() => setActiveDesktopIndex(null)}
          >
            {items.map((item, idx) => {
              const row = Math.floor(idx / 3);
              const col = idx % 3;
              const hiddenByExpanded =
                activeDesktopIndex != null && covered.has(idx) && idx !== activeDesktopIndex;
              const image = getItemImage(item);
              return (
                <button
                  type="button"
                  key={`${item.slug}-${idx}`}
                  onMouseEnter={() => setActiveDesktopIndex(idx)}
                  onFocus={() => setActiveDesktopIndex(idx)}
                  className={`absolute overflow-hidden rounded-xl text-left transition-all duration-300 ${
                    hiddenByExpanded
                      ? "pointer-events-none opacity-0"
                      : "opacity-100 hover:brightness-105"
                  }`}
                  style={{
                    left: `calc(${col * (100 / 3)}% + 4px)`,
                    top: `calc(${row * (100 / 3)}% + 4px)`,
                    width: `calc(${100 / 3}% - 8px)`,
                    height: `calc(${100 / 3}% - 8px)`,
                  }}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-black/30 to-black/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[18px] font-medium tracking-tight text-white">
                      {item.name}
                    </p>
                  </div>
                </button>
              );
            })}

            {active && (
              <div
                className="absolute z-20 overflow-hidden rounded-xl border border-white/25 shadow-2xl transition-all duration-300"
                style={{
                  left: `calc(${anchorCol * (100 / 3)}% + 4px)`,
                  top: `calc(${anchorRow * (100 / 3)}% + 4px)`,
                  width: `calc(${(200 / 3)}% - 8px)`,
                  height: `calc(${(200 / 3)}% - 8px)`,
                }}
              >
                {getItemImage(active) ? (
                  <img
                    src={getItemImage(active)}
                    alt={active.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-black/35 to-black/12" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <h3 className="text-[30px] font-light tracking-tight text-white sm:text-[36px]">
                    {active.name}
                  </h3>
                  {active.summary ? (
                    <p className="mt-3 max-w-[80%] text-[15px] leading-relaxed text-white/88">
                      {active.summary}
                    </p>
                  ) : null}
                  <Link
                    href={`/products/${active.slug}`}
                    className="mt-5 inline-flex items-center rounded-md border border-white/60 px-4 py-2 text-[14px] font-medium text-white transition hover:bg-white/12"
                  >
                    了解更多
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 gap-3 md:hidden">
          {items.map((item, idx) => {
            const image = getItemImage(item);
            const expanded = activeMobileIndex === idx;
            return (
              <div key={`m-${item.slug}-${idx}`} className="overflow-hidden rounded-xl bg-white">
                <button
                  type="button"
                  onClick={() => setActiveMobileIndex(expanded ? null : idx)}
                  className="relative block h-[124px] w-full text-left"
                >
                  {image ? (
                    <img src={image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-black/[0.06]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/20" />
                  <div className="absolute inset-y-0 left-0 flex items-center px-4">
                    <span className="text-[18px] font-medium text-white">{item.name}</span>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 text-white/85">
                    {expanded ? "−" : "+"}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-black/10 bg-white p-4">
                    {item.summary ? (
                      <p className="text-[14px] leading-relaxed text-black/70">{item.summary}</p>
                    ) : (
                      <p className="text-[14px] leading-relaxed text-black/55">点击前往查看该分类产品列表。</p>
                    )}
                    <Link
                      href={`/products/${item.slug}`}
                      className="mt-3 inline-flex items-center rounded-md border border-black/20 px-3.5 py-2 text-[13px] font-medium text-black/85"
                    >
                      点击前往
                    </Link>
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

