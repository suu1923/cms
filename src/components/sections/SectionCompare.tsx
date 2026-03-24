"use client";

import { SectionBackground, getSelectionHeightClass, selectionTitleClass } from "./sectionShared";
import type { SectionCompare as SectionCompareType } from "./types";

export default function SectionCompare({ section }: { section: SectionCompareType }) {
  const rows = section.rows ?? [];
  const colA = section.columnA ?? "方案 A";
  const colB = section.columnB ?? "方案 B";

  return (
    <section className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[900px] px-6 sm:px-8">
        {section.title && (
          <h2 className={selectionTitleClass}>{section.title}</h2>
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
      </div>
    </section>
  );
}
