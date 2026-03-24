import type { AboutContent, HomeHero, SiteConfig } from "@/types/content";

/**
 * 简单的 CMS 客户端示例：
 * - 约定后端（如 Strapi）提供 JSON 接口
 * - 通过环境变量 CMS_BASE_URL 配置后端地址
 * - 如果未配置 CMS，则返回 null，前端可以回退到本地 JSON
 */

const CMS_BASE_URL = process.env.CMS_BASE_URL;
const CMS_TOKEN = process.env.CMS_TOKEN;
/** 可选：OSS 自定义域名（如 https://cdn.xxx.com），用于把默认 OSS 域名替换成自定义域名，便于浏览器内预览、避免强制下载。见阿里云文档：https://help.aliyun.com/zh/oss/how-to-ensure-an-object-is-previewed-when-you-access-the-object */
const CMS_OSS_CUSTOM_DOMAIN = process.env.CMS_OSS_CUSTOM_DOMAIN;

/**
 * 服务端：来自 CMS_BASE_URL。
 * 浏览器里的客户端组件读不到 CMS_BASE_URL，需配置其一：
 * - NEXT_PUBLIC_CMS_ORIGIN（推荐，如 https://cms.example.com）
 * - NEXT_PUBLIC_CMS_BASE_URL（如 https://cms.example.com/api，会自动去掉 /api）
 */
const CMS_PUBLIC_ORIGIN = (() => {
  const o = process.env.NEXT_PUBLIC_CMS_ORIGIN?.trim();
  if (o) return o.replace(/\/+$/, "");
  const api = process.env.NEXT_PUBLIC_CMS_BASE_URL?.trim();
  if (api) return api.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  return "";
})();

function getCmsOrigin() {
  const base = CMS_BASE_URL ?? "";
  // 常见配置：CMS_BASE_URL=http://host:1337/api
  // 媒体 URL 多为 /uploads/...，需要拼到 origin（去掉 /api）
  return base.replace(/\/api\/?$/, "");
}

/** 解析媒体相对路径时优先用服务端 origin，否则用 NEXT_PUBLIC_*（供客户端组件使用） */
function getMediaOrigin(): string {
  const fromServer = getCmsOrigin().trim();
  if (fromServer) return fromServer;
  return CMS_PUBLIC_ORIGIN;
}

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

async function fetchFromCMS<T>(path: string): Promise<T | null> {
  if (!CMS_BASE_URL) {
    // 未配置后端地址时，直接让调用方使用本地 JSON
    return null;
  }

  const url = joinUrl(CMS_BASE_URL, path);

  let res: Response;
  try {
    res = await fetch(url, {
      // App Router 下服务端请求，可根据需要改成 no-store / revalidate 等策略
      cache: "no-store",
      headers: CMS_TOKEN ? { Authorization: `Bearer ${CMS_TOKEN}` } : undefined,
    });
  } catch (e) {
    console.error("[CMS] fetch 失败", url, e);
    return null;
  }

  if (!res.ok) {
    let body: string | undefined;
    try {
      body = await res.text();
    } catch {
      body = undefined;
    }
    console.error("[CMS] 请求失败", res.status, res.statusText, url, body ? `body=${body}` : "");
    return null;
  }

  const json = (await res.json()) as { data?: unknown } | T;
  // Strapi 返回 { data: { ...attributes } }，解包后与本地 JSON 形状一致
  const data = json && typeof json === "object" && "data" in json ? (json as { data: T }).data : (json as T);
  return data ?? null;
}

/** 从 CMS 读取站点配置（Strapi 单类型 GET /api/site） */
export async function getSiteFromCMS(): Promise<SiteConfig | null> {
  return fetchFromCMS<SiteConfig>("/site");
}

/** 从 CMS 读取关于我们内容（Strapi 单类型 GET /api/about） */
export async function getAboutFromCMS(): Promise<AboutContent | null> {
  const populateSections = [
    "populate[sections][on][sections.section-horizontal-gallery][populate]=*",
    "populate[sections][on][sections.section-lateral-pin-indicator][populate]=*",
    "populate[sections][on][sections.section-carousel][populate]=*",
    "populate[sections][on][sections.section-grid][populate]=*",
    "populate[sections][on][sections.section-split][populate]=*",
    "populate[sections][on][sections.section-split-gallery][populate]=*",
    "populate[sections][on][sections.section-faq][populate]=*",
    "populate[sections][on][sections.section-rich-text][populate]=*",
    "populate[sections][on][sections.section-compare][populate]=*",
    "populate[sections][on][sections.section-timeline][populate]=*",
    "populate[sections][on][sections.section-sticky-story][populate]=*",
  ].join("&");
  return fetchFromCMS<AboutContent>(`/about?${populateSections}`);
}

// ---------------- 站点（site）---------------

export interface SiteFromCMS {
  id: number;
  name?: string;
  code?: string;
  title?: string;
  description?: string;
  logo?: unknown;
  logoDark?: unknown;
  favicon?: unknown;
  appleTouchIcon?: unknown;
  icp?: string;
  copyright?: string;
  address?: string;
  i18nEnabled?: boolean;
  attributes?: {
    name?: string;
    code?: string;
    title?: string;
    description?: string;
    logo?: unknown;
    logoDark?: unknown;
    favicon?: unknown;
    appleTouchIcon?: unknown;
    icp?: string;
    copyright?: string;
    address?: string;
    i18nEnabled?: boolean;
  };
}

export async function getSiteFromCMSByCode(siteCode?: string): Promise<SiteFromCMS | null> {
  const code = siteCode || process.env.CMS_SITE_CODE || "";
  if (!code) return null;
  const list = await fetchFromCMS<SiteFromCMS[]>(
    `/sites?filters[code][$eq]=${encodeURIComponent(code)}&pagination[pageSize]=1`,
  );
  if (!list || !Array.isArray(list) || list.length === 0) return null;
  return list[0] ?? null;
}

export function getSiteI18nEnabled(site: SiteFromCMS | null): boolean {
  if (!site) return false;
  const a = site.attributes ?? site;
  return Boolean(a.i18nEnabled);
}

// ---------------- Footer（联系人/友链/第三方联系方式）---------------

export interface ContactInfoFromCMS {
  id: number;
  label?: string;
  value?: string;
  href?: string;
  sortOrder?: number;
  isActive?: boolean;
  attributes?: {
    label?: string;
    value?: string;
    href?: string;
    sortOrder?: number;
    isActive?: boolean;
  };
}

export interface FriendLinkFromCMS {
  id: number;
  name?: string;
  url?: string;
  sortOrder?: number;
  isActive?: boolean;
  attributes?: {
    name?: string;
    url?: string;
    sortOrder?: number;
    isActive?: boolean;
  };
}

export interface ThirdPartyContactFromCMS {
  id: number;
  name?: string;
  url?: string;
  qrcode?: unknown;
  sortOrder?: number;
  isActive?: boolean;
  attributes?: {
    name?: string;
    url?: string;
    qrcode?: unknown;
    sortOrder?: number;
    isActive?: boolean;
  };
}

export async function getContactInfosFromCMS(siteCode?: string): Promise<ContactInfoFromCMS[]> {
  const code = siteCode || process.env.CMS_SITE_CODE || "";
  const filters = code ? `&filters[site][code][$eq]=${encodeURIComponent(code)}` : "";
  const list = await fetchFromCMS<ContactInfoFromCMS[]>(
    `/contact-infos?filters[isActive][$eq]=true${filters}&sort=sortOrder:asc`,
  );
  return Array.isArray(list) ? list : [];
}

export async function getFriendLinksFromCMS(siteCode?: string): Promise<FriendLinkFromCMS[]> {
  const code = siteCode || process.env.CMS_SITE_CODE || "";
  const filters = code ? `&filters[site][code][$eq]=${encodeURIComponent(code)}` : "";
  const list = await fetchFromCMS<FriendLinkFromCMS[]>(
    `/friend-links?filters[isActive][$eq]=true${filters}&sort=sortOrder:asc`,
  );
  return Array.isArray(list) ? list : [];
}

export async function getThirdPartyContactsFromCMS(
  siteCode?: string,
): Promise<ThirdPartyContactFromCMS[]> {
  const code = siteCode || process.env.CMS_SITE_CODE || "";
  const filters = code ? `&filters[site][code][$eq]=${encodeURIComponent(code)}` : "";
  const list = await fetchFromCMS<ThirdPartyContactFromCMS[]>(
    `/third-party-contacts?populate[qrcode]=true&filters[isActive][$eq]=true${filters}&sort=sortOrder:asc`,
  );
  return Array.isArray(list) ? list : [];
}

// ---------------- 首页封面（home-hero）---------------

export interface HomeHeroFromCMS {
  id: number;
  // Strapi v4 常见形状：{ id, attributes: {...} }
  attributes?: HomeHeroAttrs;
  // Strapi v5/不同配置下可能是扁平：{ id, title, ... }
  // 所以这里也允许直接挂字段
  title?: string;
  subtitle?: string;
  image?: unknown;
  video?: unknown;
  isTop?: boolean;
  marqueeText?: string;
  marqueeEnabled?: boolean;
  marqueeSpeed?: number;
  ctaLabel?: string;
  ctaHref?: string;
  sortOrder?: number;
  isActive?: boolean;
  coverHeightMode?: "full" | "two_thirds";
}

export interface HomeHeroAttrs {
  title: string;
  subtitle?: string;
  image?: unknown;
  video?: unknown;
  coverHeightMode?: "full" | "two_thirds";
  isTop?: boolean;
  marqueeText?: string;
  marqueeEnabled?: boolean;
  marqueeSpeed?: number;
  ctaLabel?: string;
  ctaHref?: string;
  sortOrder?: number;
  isActive?: boolean;
}

function getHomeHeroAttrs(entry: HomeHeroFromCMS): HomeHeroAttrs {
  if (entry.attributes && typeof entry.attributes === "object") {
    return entry.attributes as HomeHeroAttrs;
  }
  return {
    title: entry.title ?? "",
    subtitle: entry.subtitle,
    image: entry.image,
    video: entry.video,
    coverHeightMode: entry.coverHeightMode,
    isTop: entry.isTop,
    marqueeText: entry.marqueeText,
    marqueeEnabled: entry.marqueeEnabled,
    marqueeSpeed: entry.marqueeSpeed,
    ctaLabel: entry.ctaLabel,
    ctaHref: entry.ctaHref,
    sortOrder: entry.sortOrder,
    isActive: entry.isActive,
  };
}

/** 按站点 code 取当前启用的首页封面（优先 sortOrder 小） */
export async function getHomeHeroFromCMS(siteCode?: string): Promise<HomeHeroFromCMS | null> {
  const code = siteCode || process.env.CMS_SITE_CODE || "";
  const filters = code
    ? `&filters[site][code][$eq]=${encodeURIComponent(code)}`
    : "";

  const list = await fetchFromCMS<HomeHeroFromCMS[]>(
    `/home-heros?populate=*&filters[isActive][$eq]=true${filters}&sort=isTop:desc,sortOrder:asc&pagination[pageSize]=1`,
  );

  if (!list || !Array.isArray(list) || list.length === 0) return null;
  return list[0] ?? null;
}

export function homeHeroFromCMSFallback(local: HomeHero, cms: HomeHeroFromCMS | null): HomeHero {
  if (!cms) return local;
  const a = getHomeHeroAttrs(cms);
  const media = getStrapiMediaUrl(a.video) || getStrapiMediaUrl(a.image);
  const height: HomeHero["coverHeightMode"] =
    a.coverHeightMode === "two_thirds" ? "two_thirds" : "full";
  return {
    title: a.title || local.title,
    subtitle: a.subtitle || local.subtitle,
    backgroundImage: media || local.backgroundImage,
    cta: a.ctaLabel && a.ctaHref ? [{ label: a.ctaLabel, href: a.ctaHref }] : local.cta,
    coverHeightMode: height,
  };
}

// ---------------- 首页 Sections（home-page）---------------

export interface HomePageFromCMS {
  id: number;
  site?: unknown;
  isActive?: boolean;
  coverHero?: unknown;
  sections?: unknown[];
  attributes?: {
    site?: unknown;
    isActive?: boolean;
    coverHero?: unknown;
    sections?: unknown[];
  };
}

export async function getHomePageFromCMS(siteCode?: string): Promise<HomePageFromCMS | null> {
  const code = siteCode || process.env.CMS_SITE_CODE || "";
  const filters = code ? `&filters[site][code][$eq]=${encodeURIComponent(code)}` : "";
  /**
   * Strapi 5：根级 `populate=*` 与 dynamic zone 的深层 populate 策略不兼容，
   * 混用会导致 sections 内组件的 relation（如产品展示的 products）进不了响应，
   * 前端 SectionProductShowcase 因 items 为空整段不渲染。
   * 必须为 dynamic zone 里每一种组件单独写 `populate[sections][on][...]`。
   * @see https://docs.strapi.io/cms/api/rest/guides/understanding-populate#populate-dynamic-zones
   */
  const populateSections = [
    "populate[coverHero][populate]=*",
    "populate[sections][on][sections.section-product-categories][populate]=*",
    "populate[sections][on][sections.section-product-showcase][populate]=*",
    "populate[sections][on][sections.section-split-gallery][populate]=*",
    "populate[sections][on][sections.section-carousel][populate]=*",
    "populate[sections][on][sections.section-grid][populate]=*",
    "populate[sections][on][sections.section-split][populate]=*",
    "populate[sections][on][sections.section-faq][populate]=*",
    "populate[sections][on][sections.section-rich-text][populate]=*",
    "populate[sections][on][sections.section-compare][populate]=*",
    "populate[sections][on][sections.section-timeline][populate]=*",
    "populate[sections][on][sections.section-sticky-story][populate]=*",
  ].join("&");

  const list = await fetchFromCMS<HomePageFromCMS[]>(
    `/home-pages?filters[isActive][$eq]=true${filters}&pagination[pageSize]=1&${populateSections}`,
  );
  if (list && Array.isArray(list) && list.length > 0) return list[0] ?? null;

  // 若按站点 code 未命中，兜底取一条启用首页，避免因站点配置不一致导致首页模块空白
  if (filters) {
    const fallbackList = await fetchFromCMS<HomePageFromCMS[]>(
      `/home-pages?filters[isActive][$eq]=true&pagination[pageSize]=1&${populateSections}`,
    );
    if (fallbackList && Array.isArray(fallbackList) && fallbackList.length > 0) {
      return fallbackList[0] ?? null;
    }
  }
  return null;
}

export function getHomePageSections(home: HomePageFromCMS | null): unknown[] {
  if (!home) return [];
  const a = home.attributes ?? home;
  return (a.sections ?? []) as unknown[];
}

export function getHomePageCoverHero(home: HomePageFromCMS | null): unknown | null {
  if (!home) return null;
  const a = home.attributes ?? home;
  return (a.coverHero ?? null) as unknown | null;
}

export interface ProductCategoryFromCMS {
  id: number;
  name?: string;
  slug?: string;
  summary?: string;
  description?: string;
  cover?: unknown;
  attributes?: {
    name?: string;
    slug?: string;
    summary?: string;
    description?: string;
    cover?: unknown;
  };
}

export async function getProductCategoriesFromCMS(
  siteCode?: string,
): Promise<ProductCategoryFromCMS[]> {
  const code = siteCode || process.env.CMS_SITE_CODE || "";
  const filters = code ? `&filters[site][code][$eq]=${encodeURIComponent(code)}` : "";
  const list = await fetchFromCMS<ProductCategoryFromCMS[]>(
    `/product-categories?populate[cover]=true&filters[publishedAt][$notNull]=true${filters}&sort=name:asc`,
  );
  return Array.isArray(list) ? list : [];
}

// ---------------- 产品（对接 Strapi collectionType: product）---------------

interface ProductParameter {
  group?: string;
  isFeatured?: boolean;
  key: string;
  value: string;
}

interface ProductModule {
  name: string;
  code?: string;
  description?: string;
  content?: unknown;
}

export interface ProductFromCMS {
  id: number;
  // Strapi v4 常见形状：{ id, attributes: {...} }
  attributes?: ProductAttrs;
  // Strapi v5/不同返回设置下可能是扁平：{ id, name, slug, ... }
  name?: string;
  slug?: string;
  summary?: string;
  description?: string;
  cover?: unknown;
  detailHeroImage?: unknown;
  coverVideo?: unknown;
  enableSpecialCover?: boolean;
  coverGallery?: unknown;
  coverHeightMode?: "h_2_3" | "h_full";
  coverTextPosition?: "pos_left_center" | "pos_center" | "pos_left_bottom";
  coverTextSize?: "size_s" | "size_m" | "size_l";
  coverTextColor?: string;
  enableContinuousTextOnlyDisplay?: boolean;
  panorama360?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    background?: {
      backgroundVideo?: unknown;
      backgroundImage?: unknown;
      backgroundColor?: string;
      heightMode?:
        | "跟随内容"
        | "当前屏幕高度"
        | "当前屏幕高度的2/3"
        | "当前屏幕高度的1/2"
        | "当前屏幕高度的1/3";
    };
  };
  parameters?: ProductParameter[];
  modules?: ProductModule[];
  sections?: unknown[];
  seo_title?: string;
  seo_description?: string;
  keywords?: string;
}

export interface ProductAttrs {
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  cover?: unknown;
  detailHeroImage?: unknown;
  coverVideo?: unknown;
  enableSpecialCover?: boolean;
  coverGallery?: unknown;
  coverHeightMode?: "h_2_3" | "h_full";
  coverTextPosition?: "pos_left_center" | "pos_center" | "pos_left_bottom";
  coverTextSize?: "size_s" | "size_m" | "size_l";
  coverTextColor?: string;
  enableContinuousTextOnlyDisplay?: boolean;
  panorama360?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    background?: {
      backgroundVideo?: unknown;
      backgroundImage?: unknown;
      backgroundColor?: string;
      heightMode?:
        | "跟随内容"
        | "当前屏幕高度"
        | "当前屏幕高度的2/3"
        | "当前屏幕高度的1/2"
        | "当前屏幕高度的1/3";
    };
  };
  parameters?: ProductParameter[];
  modules?: ProductModule[];
  sections?: unknown[];
  seo_title?: string;
  seo_description?: string;
  keywords?: string;
}

export function getProductAttrs(entry: ProductFromCMS): ProductAttrs {
  if (entry.attributes && typeof entry.attributes === "object") {
    return entry.attributes as ProductAttrs;
  }
  return {
    name: entry.name ?? "",
    slug: entry.slug ?? "",
    summary: entry.summary,
    description: entry.description,
    cover: entry.cover,
    detailHeroImage: entry.detailHeroImage,
    coverVideo: entry.coverVideo,
    enableSpecialCover: entry.enableSpecialCover,
    coverGallery: entry.coverGallery,
    coverHeightMode: entry.coverHeightMode,
    coverTextPosition: entry.coverTextPosition,
    coverTextSize: entry.coverTextSize,
    coverTextColor: entry.coverTextColor,
    enableContinuousTextOnlyDisplay: entry.enableContinuousTextOnlyDisplay,
    panorama360: entry.panorama360,
    parameters: entry.parameters,
    modules: entry.modules,
    sections: entry.sections,
    seo_title: entry.seo_title,
    seo_description: entry.seo_description,
    keywords: entry.keywords,
  };
}

/** 根据 slug 从 CMS 里取产品详情（Strapi: GET /products?filters[slug][$eq]=...） */
export async function getProductFromCMSBySlug(slug: string): Promise<ProductFromCMS | null> {
  // 使用自定义接口：避免 Content API URL populate 在 dynamiczone 深层 media populate 时触发 500
  return fetchFromCMS<ProductFromCMS>(`/products/detailed/${encodeURIComponent(slug)}`);
}

/** 从 CMS 取全部已发布产品列表（用于产品中心列表页） */
export async function getProductsFromCMS(): Promise<ProductFromCMS[]> {
  const list = await fetchFromCMS<ProductFromCMS[]>(
    "/products?populate[cover]=true&publicationState=live",
  );
  return Array.isArray(list) ? list : [];
}

/** 把解析出的 URL 若为默认 OSS 域名则替换为自定义域名，便于预览（见阿里云文档：自定义域名可避免强制下载） */
function applyOssCustomDomain(url: string): string {
  if (!url || !CMS_OSS_CUSTOM_DOMAIN) return url;
  const customOrigin = CMS_OSS_CUSTOM_DOMAIN.replace(/\/$/, "");
  // 默认 OSS 域名（当前项目 bucket）
  const defaultOssHost = "yuyi-cms.oss-cn-qingdao.aliyuncs.com";
  if (url.includes(defaultOssHost)) {
    return url.replace(new RegExp(`https?://${defaultOssHost.replace(/\./g, "\\.")}`), customOrigin);
  }
  return url;
}

/** 从 Strapi media 字段中解析出可用的 URL（图片或视频） */
export function getStrapiMediaUrl(media: unknown): string | null {
  if (!media) return null;

  // 兼容数组媒体（某些接口/版本可能返回数组，即便字段是 single）
  if (Array.isArray(media)) {
    for (const item of media) {
      const url = getStrapiMediaUrl(item);
      if (url) return url;
    }
    return null;
  }

  let resolved: string | null = null;
  const withOrigin = (urlLike: string): string => {
    if (urlLike.startsWith("http://") || urlLike.startsWith("https://")) return urlLike;
    if (/^[\w.-]+\.[\w.-]+\/.+/.test(urlLike)) return `https://${urlLike}`;
    const origin = getMediaOrigin();
    if (origin) return `${origin}${urlLike}`;
    // 浏览器端无 CMS origin 时，走服务端 proxy（由 CMS_BASE_URL 拼接真实源站）
    if (urlLike.startsWith("/")) {
      return `/api/media-proxy?path=${encodeURIComponent(urlLike)}`;
    }
    return urlLike;
  };

  // Strapi v4：{ data: { attributes: { url } } }；Strapi v5 常见：{ data: { url } }（无 attributes）
  if (typeof media === "object" && "data" in (media as object)) {
    const d = (media as { data?: unknown }).data;
    const origin = getMediaOrigin();

    const pickUrlFromEntry = (entry: unknown): string | undefined => {
      if (!entry || typeof entry !== "object") return undefined;
      const e = entry as Record<string, unknown>;
      const fromAttrs =
        e.attributes && typeof e.attributes === "object"
          ? (e.attributes as { url?: string }).url
          : undefined;
      const direct = typeof e.url === "string" ? e.url : undefined;
      return fromAttrs ?? direct;
    };

    if (Array.isArray(d)) {
      for (const item of d) {
        const url = pickUrlFromEntry(item);
        if (url) {
          resolved = url.startsWith("http") ? url : origin ? `${origin}${url}` : withOrigin(url);
          break;
        }
      }
    } else if (d && typeof d === "object") {
      const url = pickUrlFromEntry(d);
      if (url) {
        resolved = url.startsWith("http") ? url : origin ? `${origin}${url}` : withOrigin(url);
      }
    }
  }
  // Strapi v5 populate=* 常见 media：直接是文件对象，带 url
  else if (typeof media === "object" && "url" in (media as object)) {
    const url = (media as { url?: unknown }).url;
    if (typeof url === "string" && url.length > 0) {
      resolved = withOrigin(url);
    }
  }
  // 兜底：字符串
  else if (typeof media === "string" && media.length > 0) {
    resolved = withOrigin(media);
  }

  return resolved ? applyOssCustomDomain(resolved) : null;
}

export function getStrapiMediaUrls(media: unknown): string[] {
  if (!media) return [];
  if (Array.isArray(media)) {
    return media
      .map((item) => getStrapiMediaUrl(item))
      .filter((u): u is string => Boolean(u));
  }

  if (typeof media === "object" && media && "data" in media) {
    const d = (media as { data?: unknown }).data;
    if (Array.isArray(d)) {
      return d
        .map((item) => getStrapiMediaUrl(item))
        .filter((u): u is string => Boolean(u));
    }
  }

  const single = getStrapiMediaUrl(media);
  return single ? [single] : [];
}

