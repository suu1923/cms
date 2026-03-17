import type { AboutContent, HomeHero, SiteConfig } from "@/types/content";

/**
 * 简单的 CMS 客户端示例：
 * - 约定后端（如 Strapi）提供 JSON 接口
 * - 通过环境变量 CMS_BASE_URL 配置后端地址
 * - 如果未配置 CMS，则返回 null，前端可以回退到本地 JSON
 */

const CMS_BASE_URL = process.env.CMS_BASE_URL;
const CMS_TOKEN = process.env.CMS_TOKEN;

function getCmsOrigin() {
  const base = CMS_BASE_URL ?? "";
  // 常见配置：CMS_BASE_URL=http://host:1337/api
  // 媒体 URL 多为 /uploads/...，需要拼到 origin（去掉 /api）
  return base.replace(/\/api\/?$/, "");
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
    console.error("[CMS] 请求失败", res.status, res.statusText, url);
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
  return fetchFromCMS<AboutContent>("/about");
}

// ---------------- 站点（site）---------------

export interface SiteFromCMS {
  id: number;
  name?: string;
  code?: string;
  title?: string;
  description?: string;
  icp?: string;
  copyright?: string;
  address?: string;
  i18nEnabled?: boolean;
  attributes?: {
    name?: string;
    code?: string;
    title?: string;
    description?: string;
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
}

export interface HomeHeroAttrs {
  title: string;
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
  return {
    title: a.title || local.title,
    subtitle: a.subtitle || local.subtitle,
    backgroundImage: media || local.backgroundImage,
    cta: a.ctaLabel && a.ctaHref ? [{ label: a.ctaLabel, href: a.ctaHref }] : local.cta,
  };
}

// ---------------- 首页 Sections（home-page）---------------

export interface HomePageFromCMS {
  id: number;
  site?: unknown;
  isActive?: boolean;
  sections?: unknown[];
  attributes?: {
    site?: unknown;
    isActive?: boolean;
    sections?: unknown[];
  };
}

export async function getHomePageFromCMS(siteCode?: string): Promise<HomePageFromCMS | null> {
  const code = siteCode || process.env.CMS_SITE_CODE || "";
  const filters = code ? `&filters[site][code][$eq]=${encodeURIComponent(code)}` : "";
  const list = await fetchFromCMS<HomePageFromCMS[]>(
    `/home-pages?populate=*&filters[isActive][$eq]=true${filters}&pagination[pageSize]=1`,
  );
  if (!list || !Array.isArray(list) || list.length === 0) return null;
  return list[0] ?? null;
}

export function getHomePageSections(home: HomePageFromCMS | null): unknown[] {
  if (!home) return [];
  const a = home.attributes ?? home;
  return (a.sections ?? []) as unknown[];
}

// ---------------- 产品（对接 Strapi collectionType: product）---------------

interface ProductParameter {
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
  attributes: {
    name: string;
    slug: string;
    summary?: string;
    description?: string;
    cover?: unknown;
    hasPanorama360?: boolean;
    isCoverVideo?: boolean;
    parameters?: ProductParameter[];
    modules?: ProductModule[];
    sections?: unknown[];
    seo_title?: string;
    seo_description?: string;
    keywords?: string;
  };
}

/** 根据 slug 从 CMS 里取产品详情（Strapi: GET /products?filters[slug][$eq]=...） */
export async function getProductFromCMSBySlug(slug: string): Promise<ProductFromCMS | null> {
  const list = await fetchFromCMS<ProductFromCMS[]>(
    `/products?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`,
  );

  if (!list || !Array.isArray(list) || list.length === 0) {
    return null;
  }

  return list[0] ?? null;
}

/** 从 CMS 取全部已发布产品列表（用于产品中心列表页） */
export async function getProductsFromCMS(): Promise<ProductFromCMS[]> {
  const list = await fetchFromCMS<ProductFromCMS[]>(
    "/products?populate[cover]=*&publicationState=live",
  );
  return Array.isArray(list) ? list : [];
}

/** 从 Strapi media 字段中解析出可用的 URL（图片或视频） */
export function getStrapiMediaUrl(media: unknown): string | null {
  if (!media) return null;

  // Strapi v4 media: { data: { attributes: { url } } }
  if (typeof media === "object" && "data" in (media as object)) {
    const d = (media as { data?: { attributes?: { url?: string } } }).data;
    const url = d?.attributes?.url;
    if (url) {
      if (url.startsWith("http")) return url;
      const origin = getCmsOrigin();
      return origin ? `${origin}${url}` : url;
    }
  }

  // Strapi v5 populate=* 常见 media：直接是文件对象，带 url
  if (typeof media === "object" && "url" in (media as object)) {
    const url = (media as { url?: unknown }).url;
    if (typeof url === "string" && url.length > 0) {
      if (url.startsWith("http")) return url;
      const origin = getCmsOrigin();
      return origin ? `${origin}${url}` : url;
    }
  }

  // 兜底：字符串
  if (typeof media === "string" && media.length > 0) {
    if (media.startsWith("http")) return media;
    const origin = getCmsOrigin();
    return origin ? `${origin}${media}` : media;
  }

  return null;
}

