import type { Core } from "@strapi/strapi";

/**
 * 自定义 Content API 路由（避免 Content API URL populate 语法在 dynamiczone+media 深 populate 下触发 500）
 */
const config: Core.RouterConfig = {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/products/detailed/:slug",
      handler: "api::product.product-detailed.findBySlugDetailed",
      config: {
        auth: false,
      },
    },
  ],
};

export default config;

