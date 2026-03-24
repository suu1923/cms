import Link from "next/link";
import type { HomeHero } from "@/types/content";
import { MarqueeText } from "@/components/MarqueeText";

export type HomeCoverHeroHeightMode = "full" | "two_thirds";

export type HomeCoverHeroProps = {
  heroData: HomeHero;
  videoUrl: string | null;
  imageUrl: string | null;
  marqueeEnabled: boolean;
  marqueeText: string;
  marqueeSpeed: number;
  /** 满屏或约屏幕高度 2/3 */
  heightMode: HomeCoverHeroHeightMode;
};

function sectionMinHeightClass(mode: HomeCoverHeroHeightMode): string {
  return mode === "two_thirds" ? "min-h-[66.667vh]" : "min-h-[100vh]";
}

/**
 * 首页首屏封面：视频/大图背景 + 遮罩 + 标题/副标题/CTA + 可选跑马灯。
 * 可由 Strapi「首页（Sections）」中的「首页封面」模块驱动，或沿用「首页封面」单表 + 本地 JSON。
 */
export function HomeCoverHero({
  heroData,
  videoUrl,
  imageUrl,
  marqueeEnabled,
  marqueeText,
  marqueeSpeed,
  heightMode,
}: HomeCoverHeroProps) {
  const heroIsVideo = Boolean(videoUrl);
  const bgUrl = imageUrl || heroData.backgroundImage;

  return (
    <section
      className={`relative flex ${sectionMinHeightClass(heightMode)} flex-col items-center justify-end overflow-hidden bg-black pb-24 pt-28 text-white sm:pb-32 sm:pt-36`}
    >
      {heroIsVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl!}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${!bgUrl ? "bg-black" : ""}`}
          style={
            bgUrl
              ? {
                  backgroundImage: `url(${JSON.stringify(bgUrl)})`,
                }
              : undefined
          }
        />
      )}
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 flex w-full max-w-[600px] flex-col items-center text-center">
        <h1 className="text-4xl font-extralight tracking-tight sm:text-5xl md:text-6xl">{heroData.title}</h1>
        <p className="mt-4 text-lg font-normal text-white/90 sm:text-xl">{heroData.subtitle}</p>
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

      {marqueeEnabled && marqueeText ? (
        <div className="relative z-10 mt-14 w-full max-w-[1200px] px-6 sm:px-8">
          <MarqueeText text={marqueeText} durationSec={marqueeSpeed} />
        </div>
      ) : null}
    </section>
  );
}
