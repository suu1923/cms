"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductItem } from "@/types/content";

interface ProductHeroCardProps {
  product: ProductItem;
  priority?: boolean;
}

export function ProductHeroCard({ product, priority }: ProductHeroCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-black/[0.04]">
          {!imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority={priority}
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-black/30 text-[15px]">
              暂无图片
            </div>
          )}
        </div>
      </Link>
      <div className="p-6 sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-black/50">
          {product.category}
        </p>
        <h3 className="mt-2 text-xl font-medium tracking-tight text-black sm:text-2xl">
          {product.name}
        </h3>
        <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-black/70">
          {product.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center text-[14px] font-medium text-black hover:underline"
          >
            了解更多
          </Link>
          <a
            href="tel:13210577152"
            className="inline-flex items-center text-[14px] font-medium text-black/80 hover:text-black"
          >
            咨询订购
          </a>
        </div>
      </div>
    </article>
  );
}
