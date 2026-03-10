"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductItem } from "@/types/content";

interface ProductStripProps {
  product: ProductItem;
  reverse?: boolean;
  priority?: boolean;
}

export function ProductStrip({ product, reverse, priority }: ProductStripProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      className={`grid min-h-[60vh] grid-cols-1 lg:grid-cols-2 ${
        reverse ? "" : ""
      }`}
    >
      <div
        className={`relative h-[320px] lg:h-full lg:min-h-[55vh] ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
      >
        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 ease-out"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={priority}
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full min-h-[320px] w-full items-center justify-center bg-black/5 text-black/40">
            暂无图片
          </div>
        )}
      </div>
      <div
        className={`flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24 ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <p className="text-[11px] font-medium uppercase tracking-widest text-black/50">
          {product.category}
        </p>
        <h2 className="mt-3 text-3xl font-extralight tracking-tight text-black sm:text-4xl">
          {product.name}
        </h2>
        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-black/70">
          {product.summary}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/products/${product.slug}`}
            className="rounded border border-black/20 bg-transparent px-8 py-2.5 text-[13px] font-medium text-black transition hover:bg-black/5"
          >
            了解更多
          </Link>
          <Link
            href="/contact"
            className="rounded border border-black/20 bg-transparent px-8 py-2.5 text-[13px] font-medium text-black transition hover:bg-black/5"
          >
            订购咨询
          </Link>
        </div>
      </div>
    </section>
  );
}
