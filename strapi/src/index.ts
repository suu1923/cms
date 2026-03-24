import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // 全局自定义字段：用于 selection-background 的调色盘输入
    strapi.customFields.register({
      name: "selection-background-color",
      type: "string",
      inputSize: { default: 6, isResizable: true },
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 仅用于本地演示：初始化基础分类 + 示例产品（以及绑定站点）
    try {
      const siteCode = process.env.CMS_SITE_CODE || "HYYT";
      const sitesByCode = await strapi.entityService.findMany("api::site.site", {
        filters: { code: { $eq: siteCode } },
        limit: 1,
      });
      const siteByCode = Array.isArray(sitesByCode) ? sitesByCode[0] : (sitesByCode as any);
      const sitesByTitle = await strapi.entityService.findMany("api::site.site", {
        filters: {
          $or: [{ title: { $eq: "航宇游艇官网" } }, { name: { $eq: "航宇游艇官网" } }],
        } as any,
        limit: 1,
      });
      const siteByTitle = Array.isArray(sitesByTitle) ? sitesByTitle[0] : (sitesByTitle as any);
      const site = siteByTitle || siteByCode;
      if (!site) return;

      const defaultCategories = [
        { name: "游艇", slug: "youting", summary: "豪华休闲与商务接待并重，兼顾舒适与性能。" },
        { name: "工作艇", slug: "gongzuoting", summary: "面向工程作业与巡检任务，可靠耐用。" },
        { name: "客船", slug: "kechuan", summary: "景区观光及公共接驳场景的客运船型。" },
        { name: "趸船", slug: "dunchuan", summary: "水上平台与服务载体，稳定性与可定制性兼具。" },
        { name: "帆船", slug: "fanchuan", summary: "风帆运动与海上体验船型，兼具操控与美感。" },
        { name: "仿古画舫船", slug: "huafang", summary: "古风造型船型，适配景区文旅与特色运营。" },
        { name: "钓鱼艇", slug: "diaoyuting", summary: "面向海钓与休闲出行，空间布局实用高效。" },
        { name: "水陆两栖船", slug: "liangqi", summary: "陆地与水面无缝切换，适用景区观光与应急场景。" },
        { name: "新能源游艇", slug: "xinnengyuan", summary: "绿色动力与低噪出行，面向未来水上体验。" },
      ];

      for (const cat of defaultCategories) {
        const exists = await strapi.entityService.findMany("api::product-category.product-category", {
          filters: { slug: { $eq: cat.slug }, site: { id: { $eq: site.id } } } as any,
          limit: 1,
        });
        if (Array.isArray(exists) && exists.length > 0) continue;
        await strapi.entityService.create("api::product-category.product-category", {
          data: {
            name: cat.name,
            slug: cat.slug,
            summary: cat.summary,
            site: site.id,
            publishedAt: new Date(),
          } as any,
        });
      }

      // 友情链接测试数据（如果当前站点还没有友链则初始化）
      const friendLinks = await strapi.entityService.findMany("api::friend-link.friend-link", {
        filters: { site: { id: { $eq: site.id } } } as any,
        limit: 1,
      });
      if (!Array.isArray(friendLinks) || friendLinks.length === 0) {
        const defaultFriendLinks = [
          { name: "山东宇易科技股份有限公司", url: "https://www.yuyigufen.com/" },
          { name: "中国船舶工业行业协会", url: "https://www.cansi.org.cn/" },
          { name: "中国交通运输部", url: "https://www.mot.gov.cn/" },
          { name: "中国海事局", url: "https://www.msa.gov.cn/" },
          { name: "山东省工业和信息化厅", url: "http://gxt.shandong.gov.cn/" },
          { name: "济宁市人民政府", url: "http://www.jining.gov.cn/" },
        ];
        for (let i = 0; i < defaultFriendLinks.length; i += 1) {
          const link = defaultFriendLinks[i];
          await strapi.entityService.create("api::friend-link.friend-link", {
            data: {
              site: site.id,
              name: link.name,
              url: link.url,
              sortOrder: i + 1,
              isActive: true,
              publishedAt: new Date(),
            } as any,
          });
        }
      }

      const imageFiles = await strapi.entityService.findMany("plugin::upload.file", {
        filters: { mime: { $startsWith: "image/" } } as any,
        sort: { createdAt: "desc" } as any,
        limit: 60,
      });
      const imageIds = (Array.isArray(imageFiles) ? imageFiles : [])
        .map((f) => (f as { id?: number }).id)
        .filter((id): id is number => typeof id === "number");
      const pickImageId = (index: number) => (imageIds.length > 0 ? imageIds[index % imageIds.length] : undefined);

      // 站点图标/Logo测试数据（仅在为空时补）
      const siteAttrs = (site as any).attributes ?? site;
      const sitePatch: Record<string, unknown> = {};
      if (!siteAttrs.logo && pickImageId(0)) sitePatch.logo = pickImageId(0);
      if (!siteAttrs.logoDark && pickImageId(1)) sitePatch.logoDark = pickImageId(1);
      if (!siteAttrs.favicon && pickImageId(2)) sitePatch.favicon = pickImageId(2);
      if (!siteAttrs.appleTouchIcon && pickImageId(3)) sitePatch.appleTouchIcon = pickImageId(3);
      if (Object.keys(sitePatch).length > 0) {
        await strapi.entityService.update("api::site.site", site.id, { data: sitePatch as any });
      }

      // 为分类补封面图（仅空值补）
      const allCategories = await strapi.entityService.findMany("api::product-category.product-category", {
        filters: { site: { id: { $eq: site.id } } } as any,
        sort: { slug: "asc" } as any,
        limit: 100,
      });
      if (Array.isArray(allCategories) && imageIds.length > 0) {
        for (let i = 0; i < allCategories.length; i += 1) {
          const cat = allCategories[i] as any;
          const attrs = cat.attributes ?? cat;
          if (attrs.cover) continue;
          const coverId = pickImageId(i + 4);
          if (!coverId) continue;
          await strapi.entityService.update("api::product-category.product-category", cat.id, {
            data: { cover: coverId } as any,
          });
        }
      }

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

      // 创建或更新示例产品（优先补全测试图片）
      const existing = await strapi.entityService.findMany("api::product.product", {
        filters: { slug: { $eq: "tianhai-demo" } },
        limit: 1,
      });
      const demoExists = Array.isArray(existing) && existing.length > 0 ? (existing[0] as any) : null;
      const coverGalleryIds = imageIds.slice(0, 6);
      if (!demoExists) {
        await strapi.entityService.create("api::product.product", {
          data: {
            name: "天海（演示产品）",
            slug: "tianhai-demo",
            summary: "用于演示 Apple 式模块化 Sections：轮播、分屏图文、九宫格、FAQ、富文本。",
            description: "这是自动生成的演示数据，你可以在后台任意编辑/删除。",
            site: site.id,
            category: category.id,
            cover: pickImageId(0),
            enableSpecialCover: coverGalleryIds.length >= 3,
            coverGallery: coverGalleryIds,
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
              }
            ],
            publishedAt: new Date(),
          } as any,
        });
      } else {
        const demoAttrs = demoExists.attributes ?? demoExists;
        const demoPatch: Record<string, unknown> = {};
        if (!demoAttrs.cover && pickImageId(0)) demoPatch.cover = pickImageId(0);
        if (!demoAttrs.coverGallery && coverGalleryIds.length >= 3) demoPatch.coverGallery = coverGalleryIds;
        if (coverGalleryIds.length >= 3) demoPatch.enableSpecialCover = true;
        if (Object.keys(demoPatch).length > 0) {
          await strapi.entityService.update("api::product.product", demoExists.id, {
            data: demoPatch as any,
          });
        }
      }

      // 首页模块测试数据（仅在未配置时追加，不覆盖用户已有配置）
      const homePages = await strapi.entityService.findMany("api::home-page.home-page", {
        filters: { site: { id: { $eq: site.id } }, isActive: { $eq: true } } as any,
        sort: { id: "asc" } as any,
        limit: 1,
      });
      const home = Array.isArray(homePages) && homePages.length > 0 ? (homePages[0] as any) : null;
      if (home) {
        const homeAttrs = home.attributes ?? home;
        const sections = Array.isArray(homeAttrs.sections) ? [...homeAttrs.sections] : [];

        const hasProductShowcase = sections.some((s: any) => s?.__component === "sections.section-product-showcase");
        const hasSplitGallery = sections.some((s: any) => s?.__component === "sections.section-split-gallery");

        const productsForShowcase = await strapi.entityService.findMany("api::product.product", {
          filters: { site: { id: { $eq: site.id } } } as any,
          sort: { createdAt: "desc" } as any,
          limit: 6,
        });
        const productIds = (Array.isArray(productsForShowcase) ? productsForShowcase : [])
          .map((p: any) => p.id)
          .filter((id: unknown): id is number => typeof id === "number")
          .slice(0, 6);

        if (!hasProductShowcase && productIds.length > 0) {
          sections.push({
            __component: "sections.section-product-showcase",
            title: "精选产品",
            subtitle: "来自后台配置",
            maxItems: 6,
            products: productIds,
          });
        }

        if (!hasSplitGallery && imageIds.length >= 3) {
          sections.push({
            __component: "sections.section-split-gallery",
            title: "品牌实力与交付能力",
            body: "多图文展示模块测试数据：支持左右分屏轮播与上文下图布局。",
            layoutMode: "上文下图",
            enableCarouselInTopBottom: true,
            images: imageIds.slice(0, 6),
          });
        }

        if (sections.length !== (Array.isArray(homeAttrs.sections) ? homeAttrs.sections.length : 0)) {
          await strapi.entityService.update("api::home-page.home-page", home.id, {
            data: { sections } as any,
          });
        }
      }
    } catch (e) {
      strapi.log.error(e);
    }
  },
};
