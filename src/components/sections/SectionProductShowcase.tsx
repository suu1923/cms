"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import { SectionBackground, getSelectionHeightClass } from "./sectionShared";
import type { SectionProductShowcase as SectionProductShowcaseType } from "./types";

type ShowcaseProductFlat = {
  slug?: string;
  name?: string;
  summary?: string;
  cover?: unknown;
  coverVideo?: unknown;
  category?: unknown;
};

function unwrapCategoryName(category: unknown): string | undefined {
  if (!category || typeof category !== "object") return undefined;
  const o = category as Record<string, unknown>;
  if ("data" in o && o.data && typeof o.data === "object") {
    const d = o.data as Record<string, unknown>;
    const inner = (d.attributes ?? d) as Record<string, unknown>;
    const name = inner.name;
    return typeof name === "string" && name.trim() ? name.trim() : undefined;
  }
  if ("attributes" in o && o.attributes && typeof o.attributes === "object") {
    const a = o.attributes as Record<string, unknown>;
    const name = a.name;
    return typeof name === "string" && name.trim() ? name.trim() : undefined;
  }
  const name = o.name;
  return typeof name === "string" && name.trim() ? name.trim() : undefined;
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/** 在带左右 padding 的页面内撑满视口宽度，便于每格正好 50vw */
function FullViewportBleed({ children }: { children: ReactNode }) {
  return (
    <div className="relative left-1/2 right-auto w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden">
      {children}
    </div>
  );
}

export default function SectionProductShowcase({
  section,
}: {
  section: SectionProductShowcaseType;
}) {
  const max = Math.min(Math.max(section.maxItems ?? 4, 1), 6);
  const primaryLabel = section.primaryCtaLabel?.trim() || "了解更多";
  const secondaryLabel = section.secondaryCtaLabel?.trim() || "立即购买";
  const secondaryHref = section.secondaryCtaHref?.trim() || "/about";
  const secondaryIsExternal = /^https?:\/\//i.test(secondaryHref);

  const rawProducts = (
    Array.isArray(section.products)
      ? section.products
      : section.products && typeof section.products === "object" && "data" in (section.products as object)
        ? (((section.products as { data?: unknown }).data as unknown[]) ?? [])
        : []
  ) as Array<{
    attributes?: ShowcaseProductFlat;
    slug?: string;
    name?: string;
    summary?: string;
    cover?: unknown;
    coverVideo?: unknown;
    category?: unknown;
  }>;

  const items = rawProducts
    .map((entry) => {
      const flat = (entry.attributes ?? entry) as ShowcaseProductFlat;
      return {
        ...flat,
        categoryLine: unwrapCategoryName(flat.category),
      };
    })
    .filter((entry) => entry.slug && entry.name)
    .slice(0, max);

  if (items.length === 0) return null;

  return (
    <section
      className={`relative w-full overflow-hidden bg-[#f5f5f5] ${getSelectionHeightClass(section.background)}`}
    >
      <SectionBackground background={section.background} />

      {/* lg+ 两列（每格约 50vw）；小屏单列满宽。文案叠在图/视频上 */}
      <div className="relative z-10">
        <FullViewportBleed>
          {/* 手机与小屏平板始终单列；仅大屏（lg+）才半屏两列，避免大屏手机横屏误成两列 */}
          <div className="grid grid-cols-1 gap-px bg-black/20 lg:grid-cols-2">
            {items.map((item, idx) => {
              const imageUrl = getStrapiMediaUrl(item.cover);
              const videoUrl = getStrapiMediaUrl(item.coverVideo);
              const showVideo = !imageUrl && Boolean(videoUrl);

              return (
                <div
                  key={`${item.slug}-${idx}`}
                  className="relative min-h-[min(62vh,560px)] min-w-0 overflow-hidden bg-neutral-800 sm:min-h-[min(56vh,520px)]"
                >
                  {/* 底层：优先封面图（img 比 bg-image 更易加载），无图则用封面视频 */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  {showVideo && videoUrl ? (
                    <video
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
                      src={videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-hidden
                    />
                  ) : null}
                  {!imageUrl && !showVideo ? (
                    <div
                      className="absolute inset-0 z-0 bg-gradient-to-br from-neutral-600 via-neutral-700 to-neutral-900"
                      aria-hidden
                    />
                  ) : null}

                  {/* 叠字用渐变遮罩 */}
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/40 to-black/25"
                    aria-hidden
                  />

                  <div className="relative z-10 flex min-h-[min(62vh,560px)] flex-col justify-between px-5 py-7 sm:min-h-[min(56vh,520px)] sm:px-7 sm:py-8 lg:px-8 lg:py-9">
                    <div className="text-center sm:pt-1">
                      {item.categoryLine ? (
                        <p className="text-[13px] font-normal leading-snug text-white/70">{item.categoryLine}</p>
                      ) : null}
                      <h3
                        className={`mt-2 text-[22px] font-semibold tracking-tight text-white sm:text-[26px] lg:text-[30px] ${item.categoryLine ? "" : "mt-0"}`}
                      >
                        {item.name}
                      </h3>
                      {item.summary ? (
                        <p className="mx-auto mt-3 max-w-md text-[15px] font-normal leading-relaxed text-white/88">
                          {item.summary}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 pb-2 sm:pb-4">
                      <Link
                        href={`/products/${item.slug}`}
                        className="inline-flex items-center gap-1 text-[14px] font-medium text-white transition hover:text-white/80"
                      >
                        {primaryLabel}
                        <ChevronRight className="opacity-90" />
                      </Link>
                      {secondaryIsExternal ? (
                        <a
                          href={secondaryHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[14px] font-medium text-white transition hover:text-white/80"
                        >
                          {secondaryLabel}
                          <ChevronRight className="opacity-90" />
                        </a>
                      ) : (
                        <Link
                          href={secondaryHref}
                          className="inline-flex items-center gap-1 text-[14px] font-medium text-white transition hover:text-white/80"
                        >
                          {secondaryLabel}
                          <ChevronRight className="opacity-90" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FullViewportBleed>
      </div>
    </section>
  );
}
