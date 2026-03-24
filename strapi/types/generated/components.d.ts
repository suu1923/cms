import type { Schema, Struct } from '@strapi/strapi';

export interface ProductProductModule extends Struct.ComponentSchema {
  collectionName: 'components_product_modules';
  info: {
    displayName: '\u4EA7\u54C1\u6A21\u5757';
  };
  attributes: {
    code: Schema.Attribute.String;
    content: Schema.Attribute.JSON;
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductProductPanorama360 extends Struct.ComponentSchema {
  collectionName: 'components_product_panorama360s';
  info: {
    displayName: '360\u00B0 \u5168\u666F\uFF08\u6A21\u5757\uFF09';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    description: Schema.Attribute.Text;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'360\u00B0 \u5168\u666F'>;
  };
}

export interface ProductProductParameter extends Struct.ComponentSchema {
  collectionName: 'components_product_parameters';
  info: {
    displayName: '\u4EA7\u54C1\u53C2\u6570';
  };
  attributes: {
    group: Schema.Attribute.String;
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    key: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsSectionCarousel extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_carousels';
  info: {
    displayName: '\u6A2A\u5411\u6ED1\u52A8\u8F6E\u64AD';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    enableGsap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    items: Schema.Attribute.Component<'sections.section-carousel-item', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionCarouselItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_carousel_items';
  info: {
    displayName: '\u8F6E\u64AD\u9879';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionCompare extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_compares';
  info: {
    displayName: '\u5BF9\u6BD4\u8868';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    columnA: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u65B9\u6848 A'>;
    columnB: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u65B9\u6848 B'>;
    rows: Schema.Attribute.Component<'sections.section-compare-row', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionCompareRow extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_compare_rows';
  info: {
    displayName: '\u5BF9\u6BD4\u884C';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    valueA: Schema.Attribute.String;
    valueB: Schema.Attribute.String;
  };
}

export interface SectionsSectionCoverHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_cover_heros';
  info: {
    displayName: '\u9996\u9875\u5C01\u9762';
  };
  attributes: {
    coverHeightMode: Schema.Attribute.Enumeration<['full', 'two_thirds']> &
      Schema.Attribute.DefaultTo<'full'>;
    ctaHref: Schema.Attribute.String;
    ctaHref2: Schema.Attribute.String;
    ctaLabel: Schema.Attribute.String;
    ctaLabel2: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    marqueeEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    marqueeSpeed: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<28>;
    marqueeText: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface SectionsSectionFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    items: Schema.Attribute.Component<'sections.section-faq-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_faq_items';
  info: {
    displayName: 'FAQ\u9879';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsSectionGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_grids';
  info: {
    displayName: '\u5BAB\u683C\u6A21\u5757';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    columns: Schema.Attribute.Enumeration<['2', '3']> &
      Schema.Attribute.DefaultTo<'3'>;
    items: Schema.Attribute.Component<'sections.section-grid-item', true>;
    rows: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<2>;
    title: Schema.Attribute.String;
    titlePlacement: Schema.Attribute.Enumeration<['in-image', 'out-image']> &
      Schema.Attribute.DefaultTo<'out-image'>;
  };
}

export interface SectionsSectionGridItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_grid_items';
  info: {
    displayName: '\u4E5D\u5BAB\u683C\u9879';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionHorizontalGallery
  extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_horizontal_galleries';
  info: {
    displayName: '\u6A2A\u5411\u5E7B\u706F\u7247\u56FE\u5E93\uFF08ScrollTrigger\uFF09';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    cardAspect: Schema.Attribute.Enumeration<['1/1', '4/3']> &
      Schema.Attribute.DefaultTo<'1/1'>;
    cardWidthPreset: Schema.Attribute.Enumeration<
      ['33vw', '40vw', '60vw', '100vw', '320px']
    > &
      Schema.Attribute.DefaultTo<'60vw'>;
    enableGsap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    enablePin: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    enableSnap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    items: Schema.Attribute.Component<'sections.section-carousel-item', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionLateralPinIndicator
  extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_lateral_pin_indicators';
  info: {
    displayName: 'Lateral Pin Indicator\uFF08\u6A2A\u5411\u6307\u793A\u6EDA\u52A8\uFF09';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    enableGsap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    indicatorPosition: Schema.Attribute.Enumeration<
      ['\u5DE6\u4FA7', '\u4E0B\u65B9']
    > &
      Schema.Attribute.DefaultTo<'\u5DE6\u4FA7'>;
    items: Schema.Attribute.Component<'sections.section-carousel-item', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionPanorama360 extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_panorama360s';
  info: {
    displayName: '360\u00B0 \u5168\u666F\uFF08Selection\uFF09';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    description: Schema.Attribute.Text;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'360\u00B0 \u5168\u666F'>;
  };
}

export interface SectionsSectionParameters extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_parameters';
  info: {
    displayName: '\u4EA7\u54C1\u53C2\u6570\uFF08Selection\uFF09';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    isLargeModuleDisplay: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    items: Schema.Attribute.Component<'product.product-parameter', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u4EA7\u54C1\u53C2\u6570'>;
  };
}

export interface SectionsSectionProductCategories
  extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_product_categories';
  info: {
    displayName: '\u4EA7\u54C1\u5206\u7C7B';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    maxItems: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<9>;
    stylePreset: Schema.Attribute.Enumeration<['nine-grid', 'six-strip']> &
      Schema.Attribute.DefaultTo<'nine-grid'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u4EA7\u54C1\u5206\u7C7B'>;
    titleAlign: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.DefaultTo<'center'>;
  };
}

export interface SectionsSectionProductShowcase extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_product_showcases';
  info: {
    displayName: '\u4EA7\u54C1\u5C55\u793A';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    maxItems: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4>;
    primaryCtaLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u4E86\u89E3\u66F4\u591A'>;
    products: Schema.Attribute.Relation<'manyToMany', 'api::product.product'>;
    secondaryCtaHref: Schema.Attribute.String;
    secondaryCtaLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u7ACB\u5373\u8D2D\u4E70'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u4EA7\u54C1\u5C55\u793A'>;
  };
}

export interface SectionsSectionRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_rich_texts';
  info: {
    displayName: '\u5BCC\u6587\u672C\uFF08\u7B80\u7248\uFF09';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    body: Schema.Attribute.JSON;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionSplit extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_splits';
  info: {
    displayName: '\u5206\u5C4F\u56FE\u6587';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    body: Schema.Attribute.Text;
    customTextPercent: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'50'>;
    enableGsap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    eyebrow: Schema.Attribute.String;
    layout: Schema.Attribute.Enumeration<
      ['\u5DE6\u6587\u672C\u53F3\u56FE', '\u5DE6\u56FE\u53F3\u6587\u672C']
    >;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    ratioPreset: Schema.Attribute.Enumeration<
      ['50/50', '40/60', '60/40', 'custom']
    > &
      Schema.Attribute.DefaultTo<'50/50'>;
    reverse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionSplitGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_split_galleries';
  info: {
    displayName: '\u5206\u5C4F\u56FE\u6587\u589E\u5F3A';
  };
  attributes: {
    actions: Schema.Attribute.Component<'shared.link-action', true>;
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    body: Schema.Attribute.Text;
    enableCarouselInTopBottom: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    enableGsap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    imageRounded: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    images: Schema.Attribute.Media<'images', true>;
    layoutMode: Schema.Attribute.Enumeration<
      [
        '\u5DE6\u56FE\u53F3\u6587\u672C',
        '\u53F3\u56FE\u5DE6\u6587\u672C',
        '\u4E0A\u6587\u4E0B\u56FE',
      ]
    > &
      Schema.Attribute.DefaultTo<'\u5DE6\u56FE\u53F3\u6587\u672C'>;
    stats: Schema.Attribute.Component<'shared.key-figure', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionStickyStory extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_sticky_stories';
  info: {
    displayName: 'Sticky\u6EDA\u52A8\u8BB2\u6545\u4E8B\uFF08GSAP\uFF09';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    enableGsap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    steps: Schema.Attribute.Component<
      'sections.section-sticky-story-step',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionStickyStoryStep extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_sticky_story_steps';
  info: {
    displayName: 'Sticky\u6545\u4E8B\u6B65\u9AA4';
  };
  attributes: {
    body: Schema.Attribute.Text;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsSectionTextOnly extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_text_onlies';
  info: {
    displayName: '\u7EAF\u6587\u672C';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    body: Schema.Attribute.Text;
    textColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#ffffff'>;
    textPosition: Schema.Attribute.Enumeration<
      [
        '\u5DE6\u4E0A',
        '\u5DE6\u4E2D',
        '\u53F3\u4E0A',
        '\u4E2D\u4E0A',
        '\u5C45\u4E2D',
        '\u53F3\u4E2D',
      ]
    > &
      Schema.Attribute.DefaultTo<'\u5C45\u4E2D'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionTimeline extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_timelines';
  info: {
    displayName: '\u65F6\u95F4\u7EBF/\u6B65\u9AA4';
  };
  attributes: {
    background: Schema.Attribute.Component<
      'shared.selection-background',
      false
    >;
    items: Schema.Attribute.Component<'sections.section-timeline-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_timeline_items';
  info: {
    displayName: '\u65F6\u95F4\u7EBF\u9879';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedKeyFigure extends Struct.ComponentSchema {
  collectionName: 'components_shared_key_figures';
  info: {
    displayName: '\u5173\u952E\u6570\u636E\u9879';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLinkAction extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_actions';
  info: {
    displayName: '\u6309\u94AE\u914D\u7F6E';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    variant: Schema.Attribute.Enumeration<['solid', 'outline', 'link']> &
      Schema.Attribute.DefaultTo<'outline'>;
  };
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_open_graphs';
  info: {
    displayName: 'openGraph';
    icon: 'project-diagram';
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SharedSelectionBackground extends Struct.ComponentSchema {
  collectionName: 'components_shared_selection_backgrounds';
  info: {
    displayName: 'Selection \u80CC\u666F\uFF08\u89C6\u9891 / \u56FE\u7247 / \u989C\u8272\uFF09';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::selection-background-color'> &
      Schema.Attribute.DefaultTo<'rgba(0,0,0,0.04)'>;
    backgroundImage: Schema.Attribute.Media<'images'>;
    backgroundVideo: Schema.Attribute.Media<'videos'>;
    heightMode: Schema.Attribute.Enumeration<
      [
        '\u8DDF\u968F\u5185\u5BB9',
        '\u5F53\u524D\u5C4F\u5E55\u9AD8\u5EA6',
        '\u5F53\u524D\u5C4F\u5E55\u9AD8\u5EA6\u76842/3',
        '\u5F53\u524D\u5C4F\u5E55\u9AD8\u5EA6\u76841/2',
        '\u5F53\u524D\u5C4F\u5E55\u9AD8\u5EA6\u76841/3',
      ]
    > &
      Schema.Attribute.DefaultTo<'\u8DDF\u968F\u5185\u5BB9'>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<'shared.open-graph', false>;
    structuredData: Schema.Attribute.JSON;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.product-module': ProductProductModule;
      'product.product-panorama360': ProductProductPanorama360;
      'product.product-parameter': ProductProductParameter;
      'sections.section-carousel': SectionsSectionCarousel;
      'sections.section-carousel-item': SectionsSectionCarouselItem;
      'sections.section-compare': SectionsSectionCompare;
      'sections.section-compare-row': SectionsSectionCompareRow;
      'sections.section-cover-hero': SectionsSectionCoverHero;
      'sections.section-faq': SectionsSectionFaq;
      'sections.section-faq-item': SectionsSectionFaqItem;
      'sections.section-grid': SectionsSectionGrid;
      'sections.section-grid-item': SectionsSectionGridItem;
      'sections.section-horizontal-gallery': SectionsSectionHorizontalGallery;
      'sections.section-lateral-pin-indicator': SectionsSectionLateralPinIndicator;
      'sections.section-panorama360': SectionsSectionPanorama360;
      'sections.section-parameters': SectionsSectionParameters;
      'sections.section-product-categories': SectionsSectionProductCategories;
      'sections.section-product-showcase': SectionsSectionProductShowcase;
      'sections.section-rich-text': SectionsSectionRichText;
      'sections.section-split': SectionsSectionSplit;
      'sections.section-split-gallery': SectionsSectionSplitGallery;
      'sections.section-sticky-story': SectionsSectionStickyStory;
      'sections.section-sticky-story-step': SectionsSectionStickyStoryStep;
      'sections.section-text-only': SectionsSectionTextOnly;
      'sections.section-timeline': SectionsSectionTimeline;
      'sections.section-timeline-item': SectionsSectionTimelineItem;
      'shared.key-figure': SharedKeyFigure;
      'shared.link-action': SharedLinkAction;
      'shared.open-graph': SharedOpenGraph;
      'shared.selection-background': SharedSelectionBackground;
      'shared.seo': SharedSeo;
    }
  }
}
