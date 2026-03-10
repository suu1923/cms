"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import type { ProductItem } from "@/types/content";

const SLIDE_DURATION_MS = 450;
const PADDING_PX = 24;
const GAP_PX = 16;

/** 全宽一条连续轨道，所有产品等间距横向排列，可拖动滑动 */
interface ProductCategoryGridProps {
  title: string;
  id: string;
  products: ProductItem[];
}

export function ProductCategoryGrid({
  title,
  id,
  products,
}: ProductCategoryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const didDragRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerWidth(el.offsetWidth);
    });
    ro.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const cardWidth =
    containerWidth > 0
      ? (containerWidth - 2 * PADDING_PX - GAP_PX) / 2
      : 280;
  const trackWidth =
    containerWidth > 0
      ? 2 * PADDING_PX + products.length * cardWidth + (products.length - 1) * GAP_PX
      : products.length * cardWidth + (products.length - 1) * GAP_PX;
  const maxScroll = Math.max(0, trackWidth - containerWidth);
  const canScroll = maxScroll > 0;

  const getPointerX = (e: React.PointerEvent | PointerEvent) =>
    "clientX" in e ? e.clientX : 0;

  const onPointerDown = (e: React.PointerEvent) => {
    if (!canScroll) return;
    startXRef.current = getPointerX(e);
    didDragRef.current = false;
    pointerIdRef.current = e.pointerId;
    setIsDragging(true);
    setDragOffset(0);
    dragOffsetRef.current = 0;
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !canScroll) return;
    const dx = getPointerX(e) - startXRef.current;
    didDragRef.current = didDragRef.current || Math.abs(dx) > 8;
    let offset = dx;
    if (scrollOffset <= 0) offset = Math.min(0, Math.max(dx, -containerWidth * 0.5));
    else if (scrollOffset >= maxScroll) offset = Math.max(0, Math.min(dx, containerWidth * 0.5));
    else offset = Math.max(-containerWidth * 0.8, Math.min(containerWidth * 0.8, dx));
    dragOffsetRef.current = offset;
    setDragOffset(offset);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    if (pointerIdRef.current != null && trackRef.current) {
      try {
        trackRef.current.releasePointerCapture(pointerIdRef.current);
      } catch (_) {}
      pointerIdRef.current = null;
    }
    setIsDragging(false);
    const offset = dragOffsetRef.current;
    const next = Math.max(0, Math.min(maxScroll, scrollOffset - offset));
    setScrollOffset(next);
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const scrollBy = (delta: number) => {
    setScrollOffset((prev) => Math.max(0, Math.min(maxScroll, prev + delta)));
  };

  const translateX = scrollOffset - dragOffset;
  const transformValue = `translate3d(-${translateX}px, 0, 0)`;

  if (products.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24 w-full py-12 sm:py-16">
      <div className="relative w-full overflow-hidden" ref={containerRef}>
        <div
          ref={trackRef}
          className="flex cursor-grab active:cursor-grabbing pb-4 select-none touch-none"
          style={{
            width: `${trackWidth}px`,
            paddingLeft: PADDING_PX,
            paddingRight: PADDING_PX,
            gap: GAP_PX,
            transform: transformValue,
            transition: isDragging
              ? "none"
              : `transform ${SLIDE_DURATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={(e) => {
            if (didDragRef.current) {
              e.preventDefault();
              e.stopPropagation();
              didDragRef.current = false;
            }
          }}
        >
          {products.map((product) => (
            <ProductCardSlide
              key={product.id}
              product={product}
              width={cardWidth}
            />
          ))}
        </div>

        {canScroll && scrollOffset > 0 && (
          <button
            type="button"
            onClick={() => scrollBy(-containerWidth)}
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white shadow-sm transition hover:bg-black/[0.04] sm:left-8"
            aria-label="向左滑动"
          >
            <svg className="h-5 w-5 text-black/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {canScroll && scrollOffset < maxScroll && (
          <button
            type="button"
            onClick={() => scrollBy(containerWidth)}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white shadow-sm transition hover:bg-black/[0.04] sm:right-8"
            aria-label="向右滑动"
          >
            <svg className="h-5 w-5 text-black/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

function ProductCardSlide({ product, width }: { product: ProductItem; width: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group shrink-0"
      style={{ width: `${width}px` }}
    >
      <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-lg bg-black/[0.06]">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {!imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              sizes="50vw"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black/5 text-black/40 text-sm">
              暂无图片
            </div>
          )}
        </div>
      </Link>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-black">
        {product.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-black/70">
        {product.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex rounded border-2 border-black/20 bg-transparent px-4 py-2 text-[13px] font-medium text-black transition hover:bg-black/[0.04]"
        >
          了解更多
        </Link>
      </div>
    </div>
  );
}
