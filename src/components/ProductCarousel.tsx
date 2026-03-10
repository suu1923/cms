"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import type { ProductItem } from "@/types/content";

const CARDS_PER_PAGE = 2;

interface ProductCarouselProps {
  title: string;
  products: ProductItem[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalPages = Math.max(1, Math.ceil(products.length / CARDS_PER_PAGE));

  const scrollToPage = (page: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const pageWidth = el.offsetWidth;
    el.scrollTo({ left: page * pageWidth, behavior: "smooth" });
    setActiveIndex(Math.min(page, totalPages - 1));
  };

  const goNext = () => scrollToPage(activeIndex + 1);
  const goPrev = () => scrollToPage(activeIndex - 1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const pageWidth = el.offsetWidth;
      const index = Math.round(el.scrollLeft / pageWidth);
      setActiveIndex(Math.min(Math.max(0, index), totalPages - 1));
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [totalPages]);

  if (products.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-black sm:text-3xl">
          {title}
        </h2>

        <div className="relative w-full">
          <div
            ref={scrollRef}
            className="flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => {
              const pageProducts = products.slice(
                pageIndex * CARDS_PER_PAGE,
                pageIndex * CARDS_PER_PAGE + CARDS_PER_PAGE
              );
              return (
                <div
                  key={pageIndex}
                  className="flex min-w-full shrink-0 snap-center gap-4 sm:gap-6"
                >
                  {[0, 1].map((slot) => {
                    const product = pageProducts[slot];
                    if (!product) {
                      return (
                        <div
                          key={`empty-${slot}`}
                          className="w-[calc((100%-1rem)/2)] shrink-0 sm:w-[calc((100%-1.5rem)/2)]"
                          aria-hidden
                        />
                      );
                    }
                    return (
                      <ProductCarouselCard key={product.id} product={product} />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Tesla 风：右侧下一页箭头 */}
          {totalPages > 1 && activeIndex < totalPages - 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white shadow-sm transition hover:bg-black/[0.04] sm:right-2"
              aria-label="下一页"
            >
              <svg className="h-5 w-5 text-black/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* 底部圆点 */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPage(i)}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex
                  ? "w-6 bg-black"
                  : "w-2 bg-black/20 hover:bg-black/35"
              }`}
              aria-label={`第 ${i + 1} 页`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Tesla 风卡片：大图在上，产品名 + 双按钮在下方（黑字、蓝主按钮、白描边次按钮） */
function ProductCarouselCard({ product }: { product: ProductItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group w-[calc((100%-1rem)/2)] shrink-0 sm:w-[calc((100%-1.5rem)/2)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="overflow-hidden rounded-lg bg-black/[0.06]">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            {!imgError ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 50vw, 600px"
                unoptimized
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black/5 text-black/40 text-[14px]">
                暂无图片
              </div>
            )}
          </div>
        </div>
      </Link>
      {/* 产品名：大号黑体，在图片下方 */}
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-black sm:text-xl">
        {product.name}
      </h3>
      {/* Tesla 风双按钮：主蓝、次白描边 */}
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href="tel:13210577152"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex rounded border-2 border-[#3182ce] bg-[#3182ce] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#2c6cb0] hover:border-[#2c6cb0]"
        >
          立即订购
        </a>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex rounded border-2 border-black/25 bg-transparent px-5 py-2.5 text-[13px] font-medium text-black transition hover:bg-black/[0.04]"
        >
          了解更多
        </Link>
      </div>
    </div>
  );
}
