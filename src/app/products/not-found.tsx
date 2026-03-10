import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ProductsNotFound() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-28">
        <h1 className="text-2xl font-extralight tracking-tight">
          未找到该产品或分类
        </h1>
        <Link
          href="/products"
          className="mt-6 text-[14px] font-medium text-black/80 hover:text-black"
        >
          返回产品中心
        </Link>
      </main>
      <Footer />
    </div>
  );
}
