"use client";

import { SectionBackground, getSelectionHeightClass, selectionTitleClass } from "./sectionShared";
import type { SectionRichText as SectionRichTextType } from "./types";

export default function SectionRichText({ section }: { section: SectionRichTextType }) {
  const paras = Array.isArray(section.body) ? (section.body as unknown[]) : [];
  const lines = paras.filter((x) => typeof x === "string") as string[];

  if (!section.title && lines.length === 0) return null;

  return (
    <section className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="py-10">
          {section.title && (
            <h2 className={selectionTitleClass}>{section.title}</h2>
          )}
          {lines.length > 0 && (
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-black/75">
              {lines.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
