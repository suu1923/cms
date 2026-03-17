import Link from "next/link";
import {
  hero,
  getFeaturedProducts,
  getProductCategories,
  about,
  site,
} from "@/lib/content";
import {
  getHomeHeroFromCMS,
  homeHeroFromCMSFallback,
  getStrapiMediaUrl,
  getHomePageFromCMS,
  getHomePageSections,
} from "@/lib/cmsClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCategories } from "@/components/ProductCategories";
import { ProductStrip } from "@/components/ProductStrip";
import { MarqueeText } from "@/components/MarqueeText";
import { ProductSections, type ProductSection } from "@/components/sections/ProductSections";

export default async function Home() {
  const heroFromCMS = await getHomeHeroFromCMS();
  const heroData = homeHeroFromCMSFallback(hero, heroFromCMS);
  const homePageFromCMS = await getHomePageFromCMS();
  const homeSections = getHomePageSections(homePageFromCMS) as ProductSection[];
  const featured = getFeaturedProducts();
  const categories = getProductCategories();
  const heroVideoUrl =
    heroFromCMS ? getStrapiMediaUrl((heroFromCMS as { attributes?: { video?: unknown }; video?: unknown }).attributes?.video ?? heroFromCMS.video) : null;
  const heroImageUrl =
    heroFromCMS ? getStrapiMediaUrl((heroFromCMS as { attributes?: { image?: unknown }; image?: unknown }).attributes?.image ?? heroFromCMS.image) : null;
  const heroIsVideo = Boolean(heroVideoUrl);
  const marqueeEnabled = Boolean(
    (heroFromCMS?.attributes?.marqueeEnabled ?? heroFromCMS?.marqueeEnabled) &&
      (heroFromCMS?.attributes?.marqueeText ?? heroFromCMS?.marqueeText),
  );
  const marqueeText = (heroFromCMS?.attributes?.marqueeText ?? heroFromCMS?.marqueeText) ?? "";
  const marqueeSpeed = (heroFromCMS?.attributes?.marqueeSpeed ?? heroFromCMS?.marqueeSpeed) ?? 28;

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* 首屏 Hero */}
      <section className="relative flex min-h-[100vh] flex-col items-center justify-end overflow-hidden bg-black pb-24 pt-28 text-white sm:pb-32 sm:pt-36">
        {heroIsVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideoUrl!}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImageUrl || heroData.backgroundImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex w-full max-w-[600px] flex-col items-center text-center">
          <h1 className="text-4xl font-extralight tracking-tight sm:text-5xl md:text-6xl">
            {heroData.title}
          </h1>
          <p className="mt-4 text-lg font-normal text-white/90 sm:text-xl">
            {heroData.subtitle}
          </p>
          {heroData.cta && heroData.cta.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={heroData.cta[0].href}
                className="min-w-[140px] rounded border border-white bg-white px-8 py-2.5 text-center text-[13px] font-medium text-black transition hover:bg-white/90"
              >
                {heroData.cta[0].label}
              </Link>
              {heroData.cta[1] && (
                <Link
                  href={heroData.cta[1].href}
                  className="min-w-[140px] rounded border border-white/80 bg-transparent px-8 py-2.5 text-center text-[13px] font-medium text-white transition hover:bg-white/10"
                >
                  {heroData.cta[1].label}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* 底部滚动字幕（可选） */}
        {marqueeEnabled && (
          <div className="relative z-10 mt-14 w-full max-w-[1200px] px-6 sm:px-8">
            <MarqueeText text={marqueeText} durationSec={marqueeSpeed} />
          </div>
        )}
      </section>

      {/* 主页产品分类（首屏下第一块，非顶部导航） */}
      <section className="border-t border-black/6 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8 lg:py-24">
          <p className="text-[11px] font-medium uppercase tracking-widest text-black/50">
            产品中心
          </p>
          <h2 className="mt-3 text-3xl font-extralight tracking-tight sm:text-4xl">
            产品分类
          </h2>
          <p className="mt-4 max-w-xl text-[15px] text-black/70">
            游艇、客船、帆船、钓鱼艇、工作艇、趸船、仿古画舫船、水陆两栖船、新能源游艇
          </p>
          <ProductCategories
            categories={categories}
            variant="grid"
            className="mt-10"
          />
          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="text-[13px] font-medium text-black/80 hover:text-black"
            >
              进入产品中心 →
            </Link>
          </div>
        </div>
      </section>

      {/* 精选产品 - 全宽交替大图+文案 */}
      <section className="border-t border-black/6">
        {featured.map((product, index) => (
          <ProductStrip
            key={product.id}
            product={product}
            reverse={index % 2 === 1}
            priority={index < 2}
          />
        ))}
        <div className="flex justify-center border-t border-black/6 py-14">
          <Link
            href="/products"
            className="rounded border border-black/20 bg-transparent px-10 py-3 text-[13px] font-medium text-black transition hover:bg-black/5"
          >
            查看更多产品
          </Link>
        </div>
      </section>

      {/* 首页自定义 Sections（来自 Strapi，可拖拽排序） */}
      {homeSections.length > 0 && (
        <section className="border-t border-black/6 py-20">
          <ProductSections sections={homeSections} />
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
