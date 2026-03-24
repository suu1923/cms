import Link from "next/link";
import {
  hero,
  getFeaturedProducts,
  getProductCategories,
  about,
  site,
} from "@/lib/content";
import {
  getStrapiMediaUrl,
  getHomePageFromCMS,
  getHomePageCoverHero,
  getHomePageSections,
  getProductCategoriesFromCMS,
} from "@/lib/cmsClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomeCoverHero } from "@/components/HomeCoverHero";
import { ProductSections, type ProductSection } from "@/components/sections";
import type { SectionCoverHero } from "@/components/sections/types";

export default async function Home() {
  const categoryOrder = [
    "游艇",
    "工作艇",
    "客船",
    "趸船",
    "帆船",
    "仿古画舫船",
    "钓鱼艇",
    "水陆两栖船",
    "新能源游艇",
  ];
  const orderIndex = new Map(categoryOrder.map((name, idx) => [name, idx]));
  const heroBase = hero;
  const homePageFromCMS = await getHomePageFromCMS();
  const coverFromPage = getHomePageCoverHero(homePageFromCMS) as SectionCoverHero | null;
  const homeSectionsRaw = getHomePageSections(homePageFromCMS) as ProductSection[];
  const homeSectionsForPage = homeSectionsRaw;

  const featured = getFeaturedProducts();
  const categories = getProductCategories();
  const categoryProductsMap = new Map<string, (typeof featured)[number]>();
  for (const p of featured) {
    if (!categoryProductsMap.has(p.category)) {
      categoryProductsMap.set(p.category, p);
    }
  }
  const cmsCategories = await getProductCategoriesFromCMS();
  const cmsCategoryCards = cmsCategories
    .map((entry) => {
      const a = entry.attributes ?? entry;
      return {
        id: entry.id,
        name: a.name ?? "",
        slug: a.slug ?? "",
        summary: a.summary ?? a.description ?? "",
        cover: a.cover,
      };
    })
    .filter((c) => c.name && c.slug);
  const fallbackCategoryCards = categories.map((cat) => {
    const p = categoryProductsMap.get(cat.name);
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      summary: "",
      cover: cat.image || p?.image || "",
    };
  });
  const sortByOrder = <T extends { name: string }>(list: T[]) =>
    [...list].sort((a, b) => {
      const ia = orderIndex.get(a.name) ?? Number.MAX_SAFE_INTEGER;
      const ib = orderIndex.get(b.name) ?? Number.MAX_SAFE_INTEGER;
      return ia - ib;
    });
  const categoryCards =
    cmsCategoryCards.length > 0 ? sortByOrder(cmsCategoryCards) : sortByOrder(fallbackCategoryCards);
  const homeSectionsWithCategory = homeSectionsForPage.map((section) =>
    section.__component === "sections.section-product-categories"
      ? { ...section, categories: categoryCards }
      : section,
  ) as ProductSection[];
  const hasCategorySection = homeSectionsWithCategory.some(
    (section) => section.__component === "sections.section-product-categories",
  );
  const homeTopSections: ProductSection[] = hasCategorySection
    ? homeSectionsWithCategory.filter(
        (section) => section.__component === "sections.section-product-categories",
      )
    : [
        {
          __component: "sections.section-product-categories",
          title: "产品分类",
          subtitle: "",
          titleAlign: "center",
          stylePreset: "six-strip",
          maxItems: 9,
          categories: categoryCards,
        } as ProductSection,
      ];
  const homeOtherSections = homeSectionsWithCategory.filter(
    (section) => section.__component !== "sections.section-product-categories",
  );

  let heroData = heroBase;
  let heroVideoUrl: string | null = null;
  let heroImageUrl: string | null = null;
  let marqueeEnabled = false;
  let marqueeText = "";
  let marqueeSpeed = 28;
  let coverHeightMode: "full" | "two_thirds" = heroBase.coverHeightMode ?? "full";

  if (coverFromPage) {
    const s = coverFromPage;
    heroVideoUrl = getStrapiMediaUrl(s.video);
    heroImageUrl = getStrapiMediaUrl(s.image);
    const ctas: { label: string; href: string }[] = [];
    if (s.ctaLabel && s.ctaHref) ctas.push({ label: s.ctaLabel, href: s.ctaHref });
    if (s.ctaLabel2 && s.ctaHref2) ctas.push({ label: s.ctaLabel2, href: s.ctaHref2 });
    heroData = {
      ...heroBase,
      title: s.title ?? heroBase.title,
      subtitle: s.subtitle ?? heroBase.subtitle,
      cta: ctas.length > 0 ? ctas : heroBase.cta,
    };
    marqueeEnabled = Boolean(s.marqueeEnabled && s.marqueeText);
    marqueeText = s.marqueeText ?? "";
    marqueeSpeed = s.marqueeSpeed ?? 28;
    coverHeightMode = s.coverHeightMode === "two_thirds" ? "two_thirds" : "full";
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      <HomeCoverHero
        heroData={heroData}
        videoUrl={heroVideoUrl}
        imageUrl={heroImageUrl}
        marqueeEnabled={marqueeEnabled}
        marqueeText={marqueeText}
        marqueeSpeed={marqueeSpeed}
        heightMode={coverHeightMode}
      />

      {/* 主页产品分类模块（支持 Strapi 首页 Sections 配置） */}
      {homeTopSections.length > 0 && (
        <section className="border-t border-black/6">
          <ProductSections sections={homeTopSections} />
        </section>
      )}

      {/* 首页自定义 Sections（来自 Strapi，可拖拽排序） */}
      {homeOtherSections.length > 0 && (
        <section className="border-t border-black/6 py-20">
          <ProductSections sections={homeOtherSections} />
        </section>
      )}

      {/* 关于我们 - 大留白、细字、简洁 */}
      <section className="border-t border-black/8 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-black/50">
                {about.subtitle}
              </p>
              <h2 className="mt-3 text-3xl font-extralight tracking-tight sm:text-4xl">
                {about.title}
              </h2>
              <p className="mt-8 text-[15px] leading-relaxed text-black/80">
                {about.summary}
              </p>
              {about.body?.map((para, i) => (
                <p key={i} className="mt-5 text-[15px] leading-relaxed text-black/70">
                  {para}
                </p>
              ))}
              {about.stats && about.stats.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-10">
                  {about.stats.map((stat) => (
                    <div key={stat.label}>
                      <span className="block text-2xl font-extralight text-black">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-[13px] text-black/60">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="rounded border border-black/20 bg-transparent px-8 py-2.5 text-[13px] font-medium text-black transition hover:bg-black/5"
                >
                  查看更多
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-none border border-black/8 bg-black/[0.02] p-8 lg:p-12">
              <p className="text-[15px] text-black/80">
                <a
                  href={`tel:${site.contact.phone}`}
                  className="font-medium text-black hover:underline"
                >
                  {site.contact.phone}
                </a>
              </p>
              <p className="mt-2 text-[15px] text-black/70">
                {site.contact.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
