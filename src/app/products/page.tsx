import Link from "next/link";
import {
  getProductCategories,
  getProductsByCategorySlug,
} from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCategoryGrid } from "@/components/ProductCategoryGrid";
import { ProductsCategoryNav } from "@/components/ProductsCategoryNav";

export const metadata = {
  title: "产品中心 | 山东航宇游艇",
  description:
    "游艇、客船、帆船、钓鱼艇、工作艇、趸船、仿古画舫船、水陆两栖船、新能源游艇 — 山东航宇游艇产品中心",
};

export default function ProductsPage() {
  const categories = getProductCategories();
  const categoriesWithProducts = categories.filter(
    (cat) => getProductsByCategorySlug(cat.slug).length > 0
  );

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
