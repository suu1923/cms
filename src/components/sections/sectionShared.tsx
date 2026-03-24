"use client";

import Image from "next/image";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import type { SelectionBackground } from "./types";

// 对齐参考站点的标题/描述字感：更大标题 + 16px 描述 + 松弛行高
export const selectionTitleClass =
  "text-[30px] font-light leading-[1.2] tracking-[-0.01em] text-black sm:text-[38px] lg:text-[48px]";
export const selectionDescriptionClass =
  "text-[16px] font-normal leading-[1.5] tracking-normal text-black/75";

export function resolveBackgroundColor(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    const candidates = [v.value, v.color, v.backgroundColor];
    for (const c of candidates) {
      if (typeof c === "string" && c.length > 0) return c;
    }
  }
  return null;
}

export function getSelectionHeightClass(background?: SelectionBackground) {
  if (!background) return "";
  const mode = background.heightMode;
  if (mode === "当前屏幕高度" || mode === "viewport" || mode === "100vh") return "h-[100vh]";
  if (mode === "当前屏幕高度的2/3") return "h-[66.667vh]";
  if (mode === "当前屏幕高度的1/2") return "h-[50vh]";
  if (mode === "当前屏幕高度的1/3") return "h-[33.333vh]";
  return "";
}

export function SectionBackground({
  background,
  imageSizes = "100vw",
}: {
  background?: SelectionBackground;
  imageSizes?: string;
}) {
  const videoUrl = getStrapiMediaUrl(background?.backgroundVideo);
  const imageUrl = getStrapiMediaUrl(background?.backgroundImage);
  const color = resolveBackgroundColor(background?.backgroundColor) ?? "rgba(0,0,0,0.04)";

  if (videoUrl) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      />
    );
  }

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt=""
        fill
        className="object-cover"
        sizes={imageSizes}
        unoptimized
        aria-hidden
      />
    );
  }

  return <div className="absolute inset-0" style={{ backgroundColor: color }} aria-hidden />;
}
