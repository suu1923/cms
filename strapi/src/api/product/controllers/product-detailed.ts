/**
 * product-detailed controller
 *
 * 用 entityService 自行 deep populate dynamic zone 中的组件 media，
 * 避免 Content API URL populate 语法在当前 Strapi 版本里触发 500。
 */
export default {
  async findBySlugDetailed(ctx: import("koa").Context) {
    const slug = (ctx.params as { slug?: string }).slug;
    if (!slug) {
      ctx.status = 400;
      ctx.body = { data: null };
      return;
    }

    const results = await strapi.entityService.findMany("api::product.product", {
      filters: { slug: { $eq: slug } },
      publicationState: "live",
      limit: 1,
      populate: {
        cover: true,
        detailHeroImage: true,
        coverVideo: true,
        coverGallery: true,
        sections: {
          on: {
            "sections.section-split": {
              populate: {
                media: true,
                background: {
                  populate: {
                    backgroundImage: true,
                    backgroundVideo: true,
                  },
                },
              },
            },
            "sections.section-carousel": {
              populate: {
                items: { populate: { image: true, media: true } },
                background: true,
              },
            },
            "sections.section-horizontal-gallery": {
              populate: {
                items: { populate: { image: true, media: true } },
                background: true,
              },
            },
            "sections.section-lateral-pin-indicator": {
              populate: {
                items: { populate: { image: true, media: true } },
                background: true,
              },
            },
            "sections.section-grid": {
              populate: {
                items: { populate: { image: true } },
                background: true,
              },
            },
            "sections.section-faq": {
              populate: {
                items: true,
                background: true,
              },
            },
            "sections.section-rich-text": {
              populate: {
                background: true,
              },
            },
            "sections.section-text-only": {
              populate: {
                background: {
                  populate: {
                    backgroundImage: true,
                    backgroundVideo: true,
                  },
                },
              },
            },
            "sections.section-compare": {
              populate: {
                rows: true,
                background: true,
              },
            },
            "sections.section-timeline": {
              populate: {
                items: { populate: { image: true } },
                background: true,
              },
            },
            "sections.section-sticky-story": {
              populate: {
                steps: { populate: { media: true } },
                background: true,
              },
            },
            "sections.section-parameters": {
              populate: {
                items: true,
                background: true,
              },
            },
            "sections.section-panorama360": {
              populate: {
                media: true,
                background: true,
              },
            },
          },
        },
      },
    });

    const product = Array.isArray(results) ? results[0] : results;

    // 兜底：部分 Strapi 版本在 dynamic zone 的 section-panorama360.media 上可能返回 null，
    // 这里按上传关系表补齐，确保前端可拿到 360 媒体。
    if (product && Array.isArray((product as { sections?: unknown[] }).sections)) {
      const sections = ((product as unknown) as { sections: Array<Record<string, unknown>> }).sections;
      for (const section of sections) {
        if (section.__component !== "sections.section-panorama360") continue;
        if (section.media) continue;
        const relatedId = section.id;
        if (typeof relatedId !== "number") continue;

        const rel = await strapi.db.connection("files_related_mph")
          .where({
            related_type: "sections.section-panorama360",
            related_id: relatedId,
            field: "media",
          })
          .orderBy("order", "asc")
          .first();

        const fileId = rel?.file_id as number | undefined;
        if (!fileId) continue;

        const file = await strapi.entityService.findOne("plugin::upload.file", fileId);
        if (file) section.media = file;
      }
    }

    ctx.body = { data: product ?? null };
  },
};

