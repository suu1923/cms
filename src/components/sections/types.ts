export type SelectionBackground = {
  backgroundVideo?: unknown;
  backgroundImage?: unknown;
  backgroundColor?: unknown;
  heightMode?: string;
};

export type SectionBase = {
  __component: string;
  id?: number;
  background?: SelectionBackground;
};

/** 首页首屏封面（与 ProductSections 分开渲染，仅作类型与 Strapi UID 对齐） */
export type SectionCoverHero = {
  __component: "sections.section-cover-hero";
  id?: number;
  title?: string;
  subtitle?: string;
  image?: unknown;
  video?: unknown;
  coverHeightMode?: "full" | "two_thirds";
  marqueeText?: string;
  marqueeEnabled?: boolean;
  marqueeSpeed?: number;
  ctaLabel?: string;
  ctaHref?: string;
  ctaLabel2?: string;
  ctaHref2?: string;
};

export type CarouselItem = { id?: number; title?: string; caption?: string; image?: unknown; media?: unknown };

export type SectionCarousel = SectionBase & {
  __component: "sections.section-carousel";
  title?: string;
  subtitle?: string;
  enableGsap?: boolean;
  items?: CarouselItem[];
};

export type SectionHorizontalGallery = SectionBase & {
  __component: "sections.section-horizontal-gallery";
  title?: string;
  subtitle?: string;
  enableGsap?: boolean;
  enablePin?: boolean;
  enableSnap?: boolean;
  cardWidthPreset?: "33vw" | "40vw" | "60vw" | "100vw" | "320px";
  cardAspect?: "1/1" | "4/3";
  items?: CarouselItem[];
};

export type SectionLateralPinIndicator = SectionBase & {
  __component: "sections.section-lateral-pin-indicator";
  title?: string;
  subtitle?: string;
  enableGsap?: boolean;
  indicatorPosition?: "左侧" | "下方";
  items?: CarouselItem[];
};

export type GridItem = { id?: number; title?: string; description?: string; image?: unknown };

export type SectionGrid = SectionBase & {
  __component: "sections.section-grid";
  title?: string;
  columns?: "2" | "3";
  rows?: number;
  items?: GridItem[];
  /**
   * 宫格标题展示位置：图外（默认）/ 图内（标题叠加在图片上）
   * Strapi 枚举值：["in-image","out-image"]
   */
  titlePlacement?: "in-image" | "out-image";
};

export type SectionSplit = SectionBase & {
  __component: "sections.section-split";
  eyebrow?: string;
  title?: string;
  body?: string;
  media?: unknown;
  reverse?: boolean;
  layout?: "左文本右图" | "左图右文本";
  ratioPreset?: "50/50" | "40/60" | "60/40" | "custom";
  customTextPercent?: string;
  enableGsap?: boolean;
};

export type FaqItem = { id?: number; question: string; answer: string };

export type SectionFaq = SectionBase & {
  __component: "sections.section-faq";
  title?: string;
  items?: FaqItem[];
};

export type SectionRichText = SectionBase & {
  __component: "sections.section-rich-text";
  title?: string;
  body?: unknown;
};

export type SectionTextOnly = SectionBase & {
  __component: "sections.section-text-only";
  title?: string;
  body?: string;
  textColor?: string;
  textPosition?: "左上" | "左中" | "右上" | "中上" | "居中" | "右中";
};

export type CompareRow = { id?: number; label: string; valueA?: string; valueB?: string };

export type SectionCompare = SectionBase & {
  __component: "sections.section-compare";
  title?: string;
  columnA?: string;
  columnB?: string;
  rows?: CompareRow[];
};

export type TimelineItem = { id?: number; title: string; description?: string; image?: unknown };

export type SectionTimeline = SectionBase & {
  __component: "sections.section-timeline";
  title?: string;
  items?: TimelineItem[];
};

export type StickyStoryStep = { id?: number; title: string; body?: string; media?: unknown };

export type SectionStickyStory = SectionBase & {
  __component: "sections.section-sticky-story";
  title?: string;
  enableGsap?: boolean;
  steps?: StickyStoryStep[];
};

export type ParameterItem = {
  id?: number;
  group?: string;
  isFeatured?: boolean;
  key: string;
  value: string;
};

export type SectionParameters = SectionBase & {
  __component: "sections.section-parameters";
  title?: string;
  isLargeModuleDisplay?: boolean;
  items?: ParameterItem[];
};

export type SectionPanorama360 = SectionBase & {
  __component: "sections.section-panorama360";
  enabled?: boolean;
  title?: string;
  description?: string;
  media?: unknown;
};

export type ProductCategoryCardItem = {
  id?: number | string;
  name: string;
  slug: string;
  summary?: string;
  cover?: unknown;
};

export type SectionProductCategories = SectionBase & {
  __component: "sections.section-product-categories";
  title?: string;
  subtitle?: string;
  titleAlign?: "left" | "center";
  stylePreset?: "nine-grid" | "six-strip";
  maxItems?: number;
  categories?: ProductCategoryCardItem[];
};

export type SectionProductShowcaseProduct = {
  id?: number;
  name?: string;
  slug?: string;
  summary?: string;
  cover?: unknown;
  coverVideo?: unknown;
  category?: unknown;
  attributes?: {
    name?: string;
    slug?: string;
    summary?: string;
    cover?: unknown;
    coverVideo?: unknown;
    category?: unknown;
  };
};

export type SectionProductShowcase = SectionBase & {
  __component: "sections.section-product-showcase";
  title?: string;
  subtitle?: string;
  maxItems?: number;
  /** 第一按钮文案，默认「了解更多」 */
  primaryCtaLabel?: string;
  /** 第二按钮文案，默认「立即购买」 */
  secondaryCtaLabel?: string;
  /** 第二按钮链接；空则用 /about */
  secondaryCtaHref?: string;
  products?: SectionProductShowcaseProduct[];
};

export type SectionSplitGallery = SectionBase & {
  __component: "sections.section-split-gallery";
  title?: string;
  body?: string;
  layoutMode?: "左图右文本" | "右图左文本" | "上文下图";
  enableCarouselInTopBottom?: boolean;
  enableGsap?: boolean;
  imageRounded?: boolean;
  images?: unknown[];
  stats?: Array<{ id?: number; value?: string; label?: string }>;
  actions?: Array<{
    id?: number;
    label?: string;
    href?: string;
    variant?: "solid" | "outline" | "link";
    openInNewTab?: boolean;
  }>;
};

export type ProductSection =
  | SectionCoverHero
  | SectionCarousel
  | SectionHorizontalGallery
  | SectionLateralPinIndicator
  | SectionGrid
  | SectionSplit
  | SectionFaq
  | SectionRichText
  | SectionTextOnly
  | SectionCompare
  | SectionTimeline
  | SectionStickyStory
  | SectionParameters
  | SectionPanorama360
  | SectionProductCategories
  | SectionProductShowcase
  | SectionSplitGallery;
