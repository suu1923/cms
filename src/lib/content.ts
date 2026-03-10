/**
 * 从 JSON 文件读取内容（构建时解析，适合 SSG）
 * 修改 JSON 后需重新构建
 */
import type {
  SiteConfig,
  NavItem,
  AboutContent,
  HomeHero,
  ProductsData,
} from "@/types/content";

import siteJson from "@/data/site.json";
import navJson from "@/data/nav.json";
import aboutJson from "@/data/about.json";
import heroJson from "@/data/hero.json";
import productsJson from "@/data/products.json";

export const site = siteJson as SiteConfig;
export const nav = navJson as NavItem[];
export const about = aboutJson as AboutContent;
export const hero = heroJson as HomeHero;
export const productsData = productsJson as ProductsData;

export function getFeaturedProducts() {
  return productsData.featured;
}

export function getProductCategories() {
  return productsData.categories;
}

export function getCategoryBySlug(slug: string) {
  return productsData.categories.find((c) => c.slug === slug) ?? null;
}

/** 按分类 slug 取该分类下的产品（目前用 featured 里 category 匹配） */
export function getProductsByCategorySlug(slug: string) {
  const cat = getCategoryBySlug(slug);
  if (!cat) return [];
  return productsData.featured.filter((p) => p.category === cat.name);
}

export function getProductBySlug(slug: string) {
  return productsData.featured.find((p) => p.slug === slug) ?? null;
}

/** 所有产品 slug 列表（用于 generateStaticParams） */
export function getAllProductSlugs() {
  return productsData.featured.map((p) => p.slug);
}

/** 所有分类 slug 列表 */
export function getAllCategorySlugs() {
  return productsData.categories.map((c) => c.slug);
}
