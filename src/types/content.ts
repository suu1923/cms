/** 站点级配置与内容类型（与 JSON 文件对应） */

export interface SiteConfig {
  name: string;
  nameEn?: string;
  description: string;
  contact: {
    phone: string;
    address: string;
    wechat?: string;
    douyin?: string;
  };
  footer: {
    copyright: string;
    icp?: string;
    links: { label: string; href: string }[];
  };
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  images?: string[];
  featured?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  products?: ProductItem[];
}

/** products.json 根结构 */
export interface ProductsData {
  featured: ProductItem[];
  categories: ProductCategory[];
}

export interface AboutContent {
  title: string;
  subtitle?: string;
  summary: string;
  body: string[];
  stats?: { label: string; value: string }[];
}

export interface HomeHero {
  title: string;
  subtitle: string;
  backgroundImage: string;
  cta?: { label: string; href: string }[];
}
