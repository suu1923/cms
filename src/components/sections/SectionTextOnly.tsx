"use client";

import {
  SectionBackground,
  getSelectionHeightClass,
  selectionDescriptionClass,
  selectionTitleClass,
} from "./sectionShared";
import type { SectionTextOnly as SectionTextOnlyType } from "./types";

function resolveTextPositionClass(position?: SectionTextOnlyType["textPosition"]) {
  switch (position) {
    case "左上":
      return "items-start justify-start text-left";
    case "左中":
      return "items-center justify-start text-left";
    case "右上":
      return "items-start justify-end text-right";
    case "中上":
      return "items-start justify-center text-center";
    case "右中":
      return "items-center justify-end text-right";
    case "居中":
    default:
      return "items-center justify-center text-center";
  }
}

function resolveTextColor(color?: string) {
  if (typeof color === "string" && color.trim().length > 0) return color;
  return "#ffffff";
}

export default function SectionTextOnly({ section }: { section: SectionTextOnlyType }) {
  const textPositionClass = resolveTextPositionClass(section.textPosition);
  const textColor = resolveTextColor(section.textColor);

  return (
    <section className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto flex h-full min-h-[320px] max-w-[1200px] px-6 py-10 sm:px-8">
        <div className={`flex w-full ${textPositionClass}`}>
          <div className="max-w-3xl">
            {section.title && (
              <h2 className={`mt-0 ${selectionTitleClass}`} style={{ color: textColor }}>
                {section.title}
              </h2>
            )}
            {section.body && (
              <p className={`mt-6 ${selectionDescriptionClass}`} style={{ color: textColor }}>
                {section.body}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
