"use client";

import dynamic from "next/dynamic";
import type { ProductSection } from "./types";

/** 每种 Strapi selection 独立 chunk，产品页按实际用到的区块加载 JS */
const SectionCarousel = dynamic(() => import("./SectionCarousel"));
const SectionHorizontalGallery = dynamic(() => import("./SectionHorizontalGallery"));
const SectionLateralPinIndicator = dynamic(() => import("./SectionLateralPinIndicator"));
const SectionGrid = dynamic(() => import("./SectionGrid"));
const SectionSplit = dynamic(() => import("./SectionSplit"));
const SectionFaq = dynamic(() => import("./SectionFaq"));
const SectionRichText = dynamic(() => import("./SectionRichText"));
const SectionTextOnly = dynamic(() => import("./SectionTextOnly"));
const SectionCompare = dynamic(() => import("./SectionCompare"));
const SectionTimeline = dynamic(() => import("./SectionTimeline"));
const SectionStickyStory = dynamic(() => import("./SectionStickyStory"));
const SectionParameters = dynamic(() => import("./SectionParameters"));
const SectionPanorama360 = dynamic(() => import("./SectionPanorama360"));
const SectionProductCategories = dynamic(() => import("./SectionProductCategories"));
const SectionProductShowcase = dynamic(() => import("./SectionProductShowcase"));
const SectionSplitGallery = dynamic(() => import("./SectionSplitGallery"));

export function ProductSectionRenderer({ section }: { section: ProductSection }) {
  switch (section.__component) {
    /** 首页封面在 page.tsx 单独渲染，此处不应出现 */
    case "sections.section-cover-hero":
      return null;
    case "sections.section-carousel":
      return <SectionCarousel section={section} />;
    case "sections.section-horizontal-gallery":
      return <SectionHorizontalGallery section={section} />;
    case "sections.section-lateral-pin-indicator":
      return <SectionLateralPinIndicator section={section} />;
    case "sections.section-grid":
      return <SectionGrid section={section} />;
    case "sections.section-split":
      return <SectionSplit section={section} />;
    case "sections.section-faq":
      return <SectionFaq section={section} />;
    case "sections.section-rich-text":
      return <SectionRichText section={section} />;
    case "sections.section-text-only":
      return <SectionTextOnly section={section} />;
    case "sections.section-compare":
      return <SectionCompare section={section} />;
    case "sections.section-timeline":
      return <SectionTimeline section={section} />;
    case "sections.section-sticky-story":
      return <SectionStickyStory section={section} />;
    case "sections.section-parameters":
      return <SectionParameters section={section} />;
    case "sections.section-panorama360":
      return <SectionPanorama360 section={section} />;
    case "sections.section-product-categories":
      return <SectionProductCategories section={section} />;
    case "sections.section-product-showcase":
      return <SectionProductShowcase section={section} />;
    case "sections.section-split-gallery":
      return <SectionSplitGallery section={section} />;
    default:
      return null;
  }
}
