import type { AboutContent, SiteConfig } from "@/types/content";

/**
 * 简单的 CMS 客户端示例：
 * - 约定后端（如 Strapi）提供 JSON 接口
 * - 通过环境变量 CMS_BASE_URL 配置后端地址
 * - 如果未配置 CMS，则返回 null，前端可以回退到本地 JSON
 */

const CMS_BASE_URL = process.env.CMS_BASE_URL;

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

async function fetchFromCMS<T>(path: string): Promise<T | null> {
  if (!CMS_BASE_URL) {
    // 未配置后端地址时，直接让调用方使用本地 JSON
    return null;
  }

  const url = joinUrl(CMS_BASE_URL, path);

  const res = await fetch(url, {
    // App Router 下服务端请求，可根据需要改成 no-store / revalidate 等策略
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[CMS] 请求失败", res.status, res.statusText);
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

