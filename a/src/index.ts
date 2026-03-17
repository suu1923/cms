import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 仅用于本地演示：如果不存在示例数据，就创建一条产品 + 分类（以及绑定站点）
    try {
      const siteCode = process.env.CMS_SITE_CODE || "HYYT";
      const sites = await strapi.entityService.findMany("api::site.site", {
        filters: { code: { $eq: siteCode } },
        limit: 1,
      });
      const site = Array.isArray(sites) ? sites[0] : (sites as any);
      if (!site) return;

      const existing = await strapi.entityService.findMany("api::product.product", {
        filters: { slug: { $eq: "tianhai-demo" } },
        limit: 1,
      });
      if (Array.isArray(existing) && existing.length > 0) return;

      // 分类（如果没有就建一个）
      const cats = await strapi.entityService.findMany("api::product-category.product-category", {
        filters: { slug: { $eq: "youting-demo" }, site: { id: { $eq: site.id } } } as any,
        limit: 1,
      });
      let category = Array.isArray(cats) ? cats[0] : (cats as any);
      if (!category) {
        category = await strapi.entityService.create("api::product-category.product-category", {
          data: {
            name: "游艇（演示）",
            slug: "youting-demo",
            summary: "演示分类：用于展示模块化 Sections。",
            site: site.id,
            publishedAt: new Date(),
          } as any,
        });
      }

      // 创建示例产品（不包含图片，避免依赖上传；你可在后台补 cover）
      await strapi.entityService.create("api::product.product", {
        data: {
          name: "天海（演示产品）",
          slug: "tianhai-demo",
          summary: "用于演示 Apple 式模块化 Sections：轮播、分屏图文、九宫格、FAQ、富文本。",
          description: "这是自动生成的演示数据，你可以在后台任意编辑/删除。",
          site: site.id,
          category: category.id,
          parameters: [
            { __component: "product.product-parameter", key: "船长", value: "20m" },
            { __component: "product.product-parameter", key: "船宽", value: "5.2m" },
            { __component: "product.product-parameter", key: "载客", value: "12人" },
          ],
          sections: [
            {
              __component: "sections.section-split",
              eyebrow: "天海 · 亮点",
              title: "分屏图文（可动效）",
              body: "该模块支持图片/视频，左右分屏展示。可开启 GSAP 滚动入场动效。",
              reverse: false,
              enableGsap: true,
            },
            {
              __component: "sections.section-carousel",
              title: "横向滑动轮播",
              subtitle: "横滑浏览多张展示图（可选 GSAP 滚动驱动）。",
              enableGsap: true,
              items: [
                { title: "外观设计", caption: "流线型船体，稳定舒适。" },
                { title: "室内空间", caption: "宽敞客舱，细节考究。" },
                { title: "动力系统", caption: "高效可靠，操控灵敏。" }
              ],
            },
            {
              __component: "sections.section-grid",
              title: "九宫格模块",
              columns: "3",
              items: [
                { title: "室内环境", description: "材料、灯光、通风与舒适体验。" },
                { title: "发动机模块", description: "动力配置、维护与可靠性。" },
                { title: "电子系统", description: "导航、通讯与智能控制。" },
                { title: "安全配置", description: "救生、消防与应急方案。" },
                { title: "甲板空间", description: "社交、观景与活动区域。" },
                { title: "定制选项", description: "布局、风格与功能按需定制。" }
              ],
            },
            {
              __component: "sections.section-faq",
              title: "常见问题",
              items: [
                { question: "是否支持定制？", answer: "支持，可按用途、预算与空间布局定制。" },
                { question: "交付周期多久？", answer: "根据配置不同，一般为 60-120 天。" }
              ],
            },
            {
              __component: "sections.section-rich-text",
              title: "富文本（简版）",
              body: [
                "这块目前用简版渲染：数组字符串会以段落展示。",
                "后续如果你要更像 Apple 的复杂排版，我们可以换成 Strapi 的 Rich Text / Blocks 并做渲染器。"
              ]
            }
          ],
          publishedAt: new Date(),
        } as any,
      });
    } catch (e) {
      strapi.log.error(e);
    }
  },
};
