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

export interface ProductProductParameter extends Struct.ComponentSchema {
  collectionName: 'components_product_parameters';
  info: {
    displayName: '\u4EA7\u54C1\u53C2\u6570';
  };
  attributes: {
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
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionCompare extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_compares';
  info: {
    displayName: '\u5BF9\u6BD4\u8868';
  };
  attributes: {
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

export interface SectionsSectionFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
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
    displayName: '\u4E5D\u5BAB\u683C';
  };
  attributes: {
    columns: Schema.Attribute.Enumeration<['2', '3', '4']> &
      Schema.Attribute.DefaultTo<'3'>;
    items: Schema.Attribute.Component<'sections.section-grid-item', true>;
    title: Schema.Attribute.String;
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

export interface SectionsSectionRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_rich_texts';
  info: {
    displayName: '\u5BCC\u6587\u672C\uFF08\u7B80\u7248\uFF09';
  };
  attributes: {
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
    body: Schema.Attribute.Text;
    enableGsap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    eyebrow: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    reverse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionStickyStory extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_sticky_stories';
  info: {
    displayName: 'Sticky\u6EDA\u52A8\u8BB2\u6545\u4E8B\uFF08GSAP\uFF09';
  };
  attributes: {
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

export interface SectionsSectionTimeline extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_timelines';
  info: {
    displayName: '\u65F6\u95F4\u7EBF/\u6B65\u9AA4';
  };
  attributes: {
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
      'product.product-parameter': ProductProductParameter;
      'sections.section-carousel': SectionsSectionCarousel;
      'sections.section-carousel-item': SectionsSectionCarouselItem;
      'sections.section-compare': SectionsSectionCompare;
      'sections.section-compare-row': SectionsSectionCompareRow;
      'sections.section-faq': SectionsSectionFaq;
      'sections.section-faq-item': SectionsSectionFaqItem;
      'sections.section-grid': SectionsSectionGrid;
      'sections.section-grid-item': SectionsSectionGridItem;
      'sections.section-rich-text': SectionsSectionRichText;
      'sections.section-split': SectionsSectionSplit;
      'sections.section-sticky-story': SectionsSectionStickyStory;
      'sections.section-sticky-story-step': SectionsSectionStickyStoryStep;
      'sections.section-timeline': SectionsSectionTimeline;
      'sections.section-timeline-item': SectionsSectionTimelineItem;
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
    }
  }
}
