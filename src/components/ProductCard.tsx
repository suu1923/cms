"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductItem } from "@/types/content";

interface ProductCardProps {
  product: ProductItem;
  priority?: boolean;
  /** Apple 风：圆角、阴影、双 CTA */
  variant?: "default" | "elevated";
}

export function ProductCard({ product, priority, variant = "default" }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const isElevated = variant === "elevated";

  const cardContent = (
    <>
      <div className={`aspect-[4/3] overflow-hidden bg-black/[0.04] ${isElevated ? "rounded-t-2xl" : ""}`}>
        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={600}
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
            priority={priority}
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-black/40 text-[13px]">
            暂无图片
          </div>
        )}
      </div>
      <div className={isElevated ? "p-6" : "py-5"}>
        <p className="text-[11px] font-medium uppercase tracking-widest text-black/50">
          {product.category}
        </p>
        <h3 className="mt-2 text-[17px] font-medium tracking-tight text-black group-hover:opacity-80 sm:text-[18px]">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-black/70">
          {product.summary}
        </p>
        {isElevated && (
          <div className="mt-5 flex flex-wrap gap-5">
            <span className="text-[14px] font-medium text-black group-hover:underline">
              了解更多
            </span>
            <a
              href="tel:13210577152"
              className="text-[14px] font-medium text-black/70 hover:text-black"
              onClick={(e) => e.stopPropagation()}
            >
              咨询订购
            </a>
          </div>
        )}
      </div>
    </>
  );

  if (isElevated) {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group block overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block overflow-hidden bg-white">
      {cardContent}
    </Link>
  );
}
