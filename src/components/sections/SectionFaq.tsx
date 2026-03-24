"use client";

import { SectionBackground, getSelectionHeightClass, selectionTitleClass } from "./sectionShared";
import type { SectionFaq as SectionFaqType } from "./types";

export default function SectionFaq({ section }: { section: SectionFaqType }) {
  const items = section.items ?? [];
  return (
    <section className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="py-10">
          {section.title && (
            <h2 className={selectionTitleClass}>{section.title}</h2>
          )}
          <div className="mt-6 divide-y divide-black/[0.06] rounded-2xl border border-black/[0.08] bg-white">
            {items.map((it, i) => (
              <details key={it.id ?? i} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-[15px] font-medium text-black/85">
                  <span className="min-w-0 flex-1">{it.question}</span>
                  <span className="shrink-0 text-black/40 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-black/70">{it.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
