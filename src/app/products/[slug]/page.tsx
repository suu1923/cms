import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getProductsByCategorySlug,
  getProductBySlug,
  getAllCategorySlugs,
  getAllProductSlugs,
} from "@/lib/content";
import {
  getProductFromCMSBySlug,
  getProductAttrs,
  getStrapiMediaUrl,
  getStrapiMediaUrls,
  type ProductFromCMS,
} from "@/lib/cmsClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductSections, type ProductSection } from "@/components/sections";
import { ProductBentoCover } from "@/components/ProductBentoCover";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 允许 Strapi 动态内容的 slug：即便不在本地 products.json 里，也能按需渲染并从 CMS 拉取
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = getAllCategorySlugs();
  const products = getAllProductSlugs();
  return [...categories.map((slug) => ({ slug })), ...products.map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const productFromCMS = await getProductFromCMSBySlug(slug);
  const product = getProductBySlug(slug);
  if (category) {
    return { title: `${category.name} | 产品中心 | 山东航宇游艇` };
  }
  if (productFromCMS) {
    const attrs = getProductAttrs(productFromCMS);
    return {
      title: attrs.seo_title || `${attrs.name} | 产品中心 | 山东航宇游艇`,
      description: attrs.seo_description || attrs.summary || undefined,
      keywords: attrs.keywords || undefined,
    };
  }
  if (product) {
    return {
      title: `${product.name} | 产品中心 | 山东航宇游艇`,
      description: product.summary,
    };
  }
  return { title: "产品中心 | 山东航宇游艇" };
}

export default async function ProductsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const productFromCMS = await getProductFromCMSBySlug(slug);
  const product = getProductBySlug(slug);

  if (category) {
    const products = getProductsByCategorySlug(slug);
    return (
      <div className="min-h-screen bg-white text-black">
        <Header />
        <main className="pt-28 pb-24 sm:pt-36">
          {/* Apple Mac 风：居中大标题 + 副标题 */}
          <section className="border-b border-black/[0.06] bg-[#fbfbfb] pb-12 pt-4 sm:pb-16">
            <div className="mx-auto max-w-[1200px] px-6 text-center sm:px-8">
              <nav className="mb-8 text-[13px] text-black/50" aria-label="面包屑">
                <Link href="/" className="hover:text-black">首页</Link>
                <span className="mx-2">/</span>
                <Link href="/products" className="hover:text-black">产品中心</Link>
                <span className="mx-2">/</span>
                <span className="text-black/80">{category.name}</span>
              </nav>
              <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
                {category.name}
              </h1>
              <p className="mx-auto mt-4 max-w-md text-[15px] text-black/60">
                {products.length > 0
                  ? `该分类下共 ${products.length} 款产品，点击了解详情或咨询订购。`
                  : "该分类暂无产品展示，欢迎来电咨询。"}
              </p>
            </div>
          </section>

          {/* 产品网格 - Apple 风卡片 */}
          <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-8 sm:py-20">
            {products.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 3} variant="elevated" />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-black/[0.08] bg-black/[0.02] py-16 text-center">
                <p className="text-[15px] text-black/70">
                  该分类暂无产品展示，欢迎{" "}
                  <a href="tel:13210577152" className="font-medium text-black underline hover:no-underline">
                    来电咨询
                  </a>
                  。
                </p>
              </div>
            )}
            <div className="mt-14 text-center">
              <Link
                href="/products"
                className="inline-block text-[15px] font-medium text-black/80 hover:text-black"
              >
                ← 返回产品中心
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (productFromCMS) {
    return <ProductDetailCMS product={productFromCMS} />;
  }

  if (product) {
    if (product.slug === "66ft-luxury") {
      return <Luxury66Page />;
    }
    return (
      <div className="min-h-screen bg-white text-black">
        <Header />
        <main className="pt-28 pb-24 sm:pt-36">
          <div className="mx-auto max-w-[900px] px-6 sm:px-8">
            <nav className="mb-8 text-[13px] text-black/50" aria-label="面包屑">
              <Link href="/" className="hover:text-black">首页</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-black">产品中心</Link>
              <span className="mx-2">/</span>
              <span className="text-black/80">{product.name}</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-black/50">
              {product.category}
            </p>
            <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-6 text-[17px] leading-relaxed text-black/80">
              {product.summary}
            </p>
            <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl bg-black/[0.04]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 900px"
                unoptimized
              />
            </div>
            <div className="mt-10 text-[15px] leading-relaxed text-black/80">
              <p>{product.description}</p>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <a
                href="tel:13210577152"
                className="rounded-full border border-black/20 bg-black px-8 py-3 text-[14px] font-medium text-white transition hover:bg-black/90"
              >
                咨询订购
              </a>
              <Link
                href="/products"
                className="rounded-full border border-black/20 bg-transparent px-8 py-3 text-[14px] font-medium text-black transition hover:bg-black/[0.04]"
              >
                返回产品中心
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  notFound();
}

function ProductDetailCMS({ product }: { product: ProductFromCMS }) {
  const attrs = getProductAttrs(product);
  const coverImageUrl = getStrapiMediaUrl(attrs.cover);
  const detailHeroImageUrl = getStrapiMediaUrl(attrs.detailHeroImage);
  const coverVideoUrl = getStrapiMediaUrl(attrs.coverVideo);
  const coverGalleryUrls = getStrapiMediaUrls(attrs.coverGallery);
  const enableSpecialCover = attrs.enableSpecialCover === true && coverGalleryUrls.length >= 3;
  // 覆盖展示级别：
  // 1) 若设置「产品详情页大图」则详情页优先用它（图片）
  // 2) 否则沿用原规则：视频 > 图片
  const coverUrl = detailHeroImageUrl || coverVideoUrl || coverImageUrl;
  const isVideo = !detailHeroImageUrl && Boolean(coverVideoUrl);
  const coverHeightClass =
    attrs.coverHeightMode === "h_full"
      ? "h-[100vh] min-h-[560px]"
      : "h-[66.667vh] min-h-[420px] sm:min-h-[520px]";
  const coverTextPosition = attrs.coverTextPosition ?? "pos_left_center";
  const coverTextColor = attrs.coverTextColor?.trim() ? attrs.coverTextColor : "#ffffff";
  const coverTextSize = attrs.coverTextSize ?? "size_m";
  const coverTitleClass =
    coverTextSize === "size_l"
      ? "text-5xl font-light tracking-tight sm:text-6xl"
      : coverTextSize === "size_s"
        ? "text-3xl font-light tracking-tight sm:text-4xl"
        : "text-4xl font-light tracking-tight sm:text-5xl";
  const coverSummaryClass =
    coverTextSize === "size_l"
      ? "mt-5 text-[19px] leading-relaxed"
      : coverTextSize === "size_s"
        ? "mt-4 text-[15px] leading-relaxed"
        : "mt-5 text-[17px] leading-relaxed";
  const coverOverlayAlignClass =
    coverTextPosition === "pos_center"
      ? "items-center justify-center text-center"
      : coverTextPosition === "pos_left_bottom"
        ? "items-end justify-start pb-12 sm:pb-16"
        : "items-center justify-start";
  const parameters = attrs.parameters ?? [];
  const modules = attrs.modules ?? [];
  const sections = (attrs.sections ?? []) as ProductSection[];
  const enableContinuousTextOnlyDisplay = attrs.enableContinuousTextOnlyDisplay === true;
  const panorama360 = attrs.panorama360;
  const hasParametersSelectionWithItems = (sections as unknown[]).some((s) => {
    const section = s as { __component?: string; items?: unknown[] };
    return section.__component === "sections.section-parameters" && Array.isArray(section.items) && section.items.length > 0;
  });
  const mergedSections: ProductSection[] =
    !hasParametersSelectionWithItems && parameters.length > 0
      ? [
          {
            __component: "sections.section-parameters",
            title: "产品参数",
            items: parameters.map((p, i) => ({
              id: i + 1,
              group: p.group,
              isFeatured: p.isFeatured,
              key: p.key,
              value: p.value,
            })),
          } as ProductSection,
          ...sections,
        ]
      : sections;
  const hasPanoramaSelection = (sections as unknown[]).some((s) => (s as { __component?: string }).__component === "sections.section-panorama360");

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      {/* Hero 需要贴顶展示，不能被 main 的 padding-top 顶下去 */}
      <main className="pb-24">
        {/* 全宽 Hero（封面图/视频 + 标题/摘要叠加） */}
        {enableSpecialCover ? (
          <ProductBentoCover
            title={attrs.name}
            summary={attrs.summary}
            images={coverGalleryUrls}
          />
        ) : (
          <section className="relative">
            {coverUrl ? (
              <div className={`relative w-full overflow-hidden bg-black/[0.04] ${coverHeightClass}`}>
                {isVideo ? (
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={coverUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={coverUrl}
                    alt={attrs.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/0" />
              </div>
            ) : (
              <div className="h-[40vh] min-h-[320px] w-full bg-black/[0.04]" />
            )}

            <div className="pointer-events-none absolute inset-0">
              <div className={`mx-auto flex h-full w-full max-w-[1400px] px-6 sm:px-10 ${coverOverlayAlignClass}`}>
                <div className="pointer-events-auto max-w-2xl">
                  <h1 className={coverTitleClass} style={{ color: coverTextColor }}>
                    {attrs.name}
                  </h1>
                  {attrs.summary && (
                    <p className={coverSummaryClass} style={{ color: coverTextColor, opacity: 0.9 }}>
                      {attrs.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 正文内容区（保持可读宽度） */}
        {/* 注意：不要在这里加 px，否则会和 ProductSections 内部的 px 叠加导致不对齐 */}
        <div className="w-full">

          {!hasPanoramaSelection && panorama360 && panorama360.enabled !== false && (
            <section className="mt-10 px-6 sm:px-8">
              {/* selection 背景（视频 > 图片 > 颜色） */}
              {(() => {
                const bgVideoUrl = getStrapiMediaUrl(panorama360.background?.backgroundVideo);
                const bgImageUrl = getStrapiMediaUrl(panorama360.background?.backgroundImage);
                const bgColor = panorama360.background?.backgroundColor ?? "rgba(0,0,0,0.04)";

                if (bgVideoUrl) {
                  return (
                    <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.02] p-6">
                      <video className="absolute inset-0 h-full w-full object-cover" src={bgVideoUrl} autoPlay loop muted playsInline aria-hidden />
                      <div className="relative">
                        <h2 className="text-lg font-medium text-black/80">{panorama360.title ?? "360° 全景"}</h2>
                        {panorama360.description && (
                          <p className="mt-2 text-[15px] text-black/60">{panorama360.description}</p>
                        )}
                      </div>
                    </div>
                  );
                }

                if (bgImageUrl) {
                  return (
                    <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.02] p-6">
                      <Image src={bgImageUrl} alt="" fill className="object-cover" unoptimized aria-hidden />
                      <div className="relative">
                        <h2 className="text-lg font-medium text-black/80">{panorama360.title ?? "360° 全景"}</h2>
                        {panorama360.description && (
                          <p className="mt-2 text-[15px] text-black/60">{panorama360.description}</p>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.02] p-6" style={{ backgroundColor: bgColor }}>
                    <h2 className="text-lg font-medium text-black/80">{panorama360.title ?? "360° 全景"}</h2>
                    {panorama360.description && (
                      <p className="mt-2 text-[15px] text-black/60">{panorama360.description}</p>
                    )}
                  </div>
                );
              })()}
            </section>
          )}

          {modules.length > 0 && (
            <div className="mt-12 space-y-12">
              {modules.map((mod, i) => (
                <section key={i} className="border-t border-black/[0.06] px-6 pt-10 sm:px-8">
                  <h2 className="text-2xl font-extralight tracking-tight text-black sm:text-3xl">{mod.name}</h2>
                  {mod.description && (
                    <p className="mt-4 text-[15px] leading-relaxed text-black/80">
                      {mod.description}
                    </p>
                  )}
                  {mod.content != null && typeof mod.content === "string" && (
                    <div className="mt-4 text-[15px] leading-relaxed text-black/80">
                      {mod.content as string}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {mergedSections.length > 0 && (
            <ProductSections
              sections={mergedSections}
              enableContinuousTextOnlyDisplay={enableContinuousTextOnlyDisplay}
            />
          )}

          {attrs.description && (
            <div className="mt-10 px-6 text-[15px] leading-relaxed text-black/80 sm:px-8">
              <p>{attrs.description}</p>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-4 px-6 sm:px-8">
            <a
              href="tel:13210577152"
              className="rounded-full border border-black/20 bg-black px-8 py-3 text-[14px] font-medium text-white transition hover:bg-black/90"
            >
              咨询订购
            </a>
            <Link
              href="/products"
              className="rounded-full border border-black/20 bg-transparent px-8 py-3 text-[14px] font-medium text-black transition hover:bg-black/[0.04]"
            >
              返回产品中心
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Luxury66Page() {
  const intro =
    "66英尺豪华游艇是奢华与精湛工艺的完美结合。每一寸的设计都反映了制造商的用心和技艺。从独特的外观到精心设计的内饰，这艘游艇散发出令人陶醉的奢华氛围。";
  const body =
    "舒适的休息区、高档的家具、精致的装饰和现代化的设备，无不突显出这艘游艇的非凡品质。从高档的实木饰面到精致的皮革沙发，每一个细节都展现着舒适和优雅。游艇的布局设计采用了先进的技术和舒适性标准，确保乘客在航行中尽情享受。宽敞的甲板空间供您与亲朋好友一同尽情畅谈，同时舒适的卧室、设施齐全的浴室则为您提供舒适的私人空间。";
  const body2 =
    "无论是您想要进行浪漫的海上度假，举办私人派对还是商务会议，这艘游艇都能满足您的个性化需求。这款66英尺的私人定制豪华游艇不仅是一种乐趣，更是一种生活方式的象征。其独特的设计、无限的个性化选择以及卓越的商务功能，使其成为成功人士和富豪们追求的选择。无论是作为私人度假场所，还是商务洽谈的场地，这艘游艇都是奢华体验的象征。";

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        {/* 宽屏视频背景 Hero */}
        <section className="relative min-h-[80vh] overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="https://hangyuchuanye.oss-cn-beijing.aliyuncs.com/66/demo.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-[1200px] flex-col justify-center px-6 sm:px-8">
            <nav className="mb-6 text-[13px] text-white/60" aria-label="面包屑">
              <Link href="/" className="hover:text-white">
                首页
              </Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-white">
                产品中心
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white/90">66英尺豪华游艇</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/60">
              Luxury Yacht · 66ft
            </p>
            <h1 className="mt-3 text-4xl font-extralight tracking-tight sm:text-5xl md:text-6xl">
              66英尺豪华游艇
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/85">
              {intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="tel:13210577152"
                className="rounded-full border border-white bg-white px-8 py-3 text-[14px] font-medium text-black transition hover:bg-white/90"
              >
                咨询订购
              </a>
              <Link
                href="/products"
                className="rounded-full border border-white/30 bg-transparent px-8 py-3 text-[14px] font-medium text-white transition hover:bg-white/10"
              >
                返回产品中心
              </Link>
            </div>
          </div>
        </section>

        {/* 宽屏主展示图 + 文案 */}
        <section className="bg-white py-20 text-black sm:py-24">
          <div className="px-6 sm:px-8">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
              <div className="relative overflow-hidden rounded-3xl bg-black/[0.06]">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src="https://hangyuchuanye.oss-cn-beijing.aliyuncs.com/66/main.jpg"
                    alt="66英尺豪华游艇外观主图"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 740px"
                    unoptimized
                  />
                </div>
              </div>
              <div className="max-w-[560px] lg:ml-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-black/50">
                  Design · Craftsmanship
                </p>
                <h2 className="mt-4 text-2xl font-light tracking-tight sm:text-3xl">
                  奢华空间 · 精湛工艺
                </h2>
                <p className="mt-6 text-[15px] leading-relaxed text-black/80">
                  {body}
                </p>
                <p className="mt-6 text-[15px] leading-relaxed text-black/80">
                  {body2}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 展示图排布 */}
        <section className="bg-[#f7f7f7] py-20 sm:py-24">
          <div className="px-6 sm:px-8">
            <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">
              宽屏视角 · 空间布局
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] text-black/70">
              通过多视角展示，感受船体线条与内部布局的协调统一，从甲板到船舱，每一处都为舒适与私密而设计。
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-black/[0.04]">
                <Image
                  src="https://hangyuchuanye.oss-cn-beijing.aliyuncs.com/66/1.PNG"
                  alt="66英尺豪华游艇展示图一"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 720px"
                  unoptimized
                />
              </div>
              <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-black/[0.04]">
                <Image
                  src="https://hangyuchuanye.oss-cn-beijing.aliyuncs.com/66/2.PNG"
                  alt="66英尺豪华游艇展示图二"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* 细节说明大图 */}
        <section className="bg-white py-20 sm:py-24">
          <div className="px-6 sm:px-8">
            <h2 className="text-2xl font-light tracking-tight text-black sm:text-3xl">
              细节布局一览
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] text-black/70">
              通过平面布局图直观展示舱室分布与功能区划，让您更清晰地了解这艘66英尺豪华游艇的空间规划。
            </p>
          </div>
          <div className="mt-10">
            <Image
              src="https://hangyuchuanye.oss-cn-beijing.aliyuncs.com/66/detail.png"
              alt="66英尺豪华游艇细节布局图"
              width={1920}
              height={1080}
              className="w-full h-auto"
              sizes="100vw"
              unoptimized
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

