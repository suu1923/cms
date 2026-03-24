"use client";

import Image from "next/image";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import { SectionBackground, getSelectionHeightClass, selectionTitleClass } from "./sectionShared";
import type { SectionTimeline as SectionTimelineType } from "./types";

export default function SectionTimeline({ section }: { section: SectionTimelineType }) {
  const items = section.items ?? [];
  return (
    <section className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[900px] px-6 sm:px-8">
        {section.title && (
          <h2 className={selectionTitleClass}>{section.title}</h2>
        )}
        <div className="mt-8 space-y-6">
          {items.map((it, i) => {
            const url = getStrapiMediaUrl(it.image);
            return (
              <div key={it.id ?? i} className="grid gap-6 rounded-2xl border border-black/[0.08] bg-white p-6 sm:grid-cols-[96px_1fr]">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-[13px] text-white">
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
                  {it.description && (
                    <p className="mt-2 text-[13px] leading-relaxed text-black/70">{it.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
