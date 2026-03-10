import Link from "next/link";
import type { ProductCategory } from "@/types/content";

interface ProductCategoriesProps {
  categories: ProductCategory[];
  variant?: "list" | "grid";
  className?: string;
}

export function ProductCategories({
  categories,
  variant = "list",
  className = "",
}: ProductCategoriesProps) {
  if (variant === "grid") {
    return (
      <div
        className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5 ${className}`}
        role="navigation"
        aria-label="产品分类"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/${cat.slug}`}
            className="flex flex-col items-center justify-center rounded-2xl border border-black/[0.08] bg-white py-10 px-6 text-center transition hover:border-black/[0.12] hover:bg-black/[0.02] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          >
            <span className="text-[16px] font-medium tracking-tight text-black sm:text-[17px]">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <ul className={`space-y-1.5 ${className}`} role="navigation" aria-label="产品分类">
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link
            href={`/products/${cat.slug}`}
            className="block text-[13px] text-black/80 transition hover:text-black"
          >
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
