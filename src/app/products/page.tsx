import Link from "next/link";
import {
  getProductCategories,
  getProductsByCategorySlug,
} from "@/lib/content";
import { getProductsFromCMS, getStrapiMediaUrl } from "@/lib/cmsClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCategoryGrid } from "@/components/ProductCategoryGrid";
import { ProductsCategoryNav } from "@/components/ProductsCategoryNav";
import type { ProductItem } from "@/types/content";

export const metadata = {
  title: "产品中心 | 山东航宇游艇",
  description:
    "游艇、客船、帆船、钓鱼艇、工作艇、趸船、仿古画舫船、水陆两栖船、新能源游艇 — 山东航宇游艇产品中心",
};

function cmsProductToItem(p: Awaited<ReturnType<typeof getProductsFromCMS>>[number]): ProductItem {
  const a = p.attributes;
  return {
    id: String(p.id),
    name: a.name,
    slug: a.slug,
    category: "产品",
    summary: a.summary ?? "",
    description: a.description ?? "",
    image: getStrapiMediaUrl(a.cover) ?? "",
  };
}

export default async function ProductsPage() {
  const categories = getProductCategories();
  const categoriesWithProducts = categories.filter(
    (cat) => getProductsByCategorySlug(cat.slug).length > 0
  );
  const cmsProducts = await getProductsFromCMS();
  const cmsItems: ProductItem[] = cmsProducts.map(cmsProductToItem);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* DJI 风：首屏大标题 + 副标题 */}
      <section className="border-b border-black/[0.06] bg-[#fbfbfb] pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl">
            产品中心
          </h1>
          <p className="mt-5 max-w-[520px] text-lg leading-relaxed text-black/70 sm:text-xl">
            船艇设计 · 制造 · 体验，多系列满足不同场景需求
          </p>
        </div>
      </section>

      {/* DJI 风：系列/分类横向导航，点击锚点到对应区块 */}
      {categoriesWithProducts.length > 0 && (
        <ProductsCategoryNav categories={categoriesWithProducts} />
      )}

      {/* 按系列展示：每块 = 分类名 + 网格产品卡片 */}
      {categories.map((cat) => {
        const products = getProductsByCategorySlug(cat.slug);
        if (products.length === 0) return null;
        return (
          <ProductCategoryGrid
            key={cat.id}
            id={cat.slug}
            title={cat.name}
            products={products}
          />
        );
      })}

      {cmsItems.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-6 py-14 sm:px-8 sm:py-20">
          <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">
            产品列表
          </h2>
          <p className="mt-2 text-[15px] text-black/60">
            以下产品由后台维护，点击进入详情。
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cmsItems.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 3} variant="elevated" />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-black/[0.06] py-12">
        <div className="mx-auto max-w-[1200px] px-6 text-center sm:px-8">
          <Link
            href="/"
            className="inline-block text-[15px] font-medium text-black/80 hover:text-black"
          >
            返回首页
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
