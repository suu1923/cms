"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { nav } from "@/lib/content";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showLocale, setShowLocale] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // 静态导出下不走服务端渲染读取站点配置，这里用 NEXT_PUBLIC_I18N_ENABLED 控制显示
    // 你可以在 .env.local / 部署环境中设置 NEXT_PUBLIC_I18N_ENABLED=true
    setShowLocale(process.env.NEXT_PUBLIC_I18N_ENABLED === "true");
  }, []);

  const isOverHero = !scrolled;
  const mainNav = nav;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOverHero
          ? "bg-transparent text-white"
          : "bg-white text-black shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
      }`}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      {/* 顶栏 */}
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-[15px] font-medium tracking-tight"
        >
          山东航宇游艇
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex"
          aria-label="主导航"
        >
          {mainNav.map((item) =>
            item.label === "产品中心" ? (
              <Link
                key={item.label}
                href="/products"
                className={`text-[13px] transition ${
                  isOverHero ? "text-white/90 hover:text-white" : "text-black/80 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            ) : item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
              >
                <span
                  className={`cursor-pointer text-[13px] transition ${
                    isOverHero ? "text-white/90 hover:text-white" : "text-black/80 hover:text-black"
                  }`}
                >
                  {item.label}
                </span>
                {/* 非「产品中心」的普通下拉 */}
                {openDropdown === item.label && item.label !== "产品中心" && (
                  <div className="absolute left-0 top-full pt-0.5">
                    <div
                      className={`min-w-[160px] py-1 ${
                        isOverHero
                          ? "border border-white/15 bg-black/90 backdrop-blur"
                          : "border border-black/8 bg-white shadow-lg"
                      }`}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-[13px] transition ${
                            isOverHero
                              ? "text-white/90 hover:bg-white/10 hover:text-white"
                              : "text-black/80 hover:bg-black/5 hover:text-black"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] transition ${
                  isOverHero ? "text-white/90 hover:text-white" : "text-black/80 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-4">
          {showLocale && <LocaleSwitcher />}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          >
            <span className="text-lg font-light">{mobileOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* 产品中心不再使用下拉大菜单，直接跳转到产品页 */}

      {/* 移动端展开菜单 */}
      {mobileOpen && (
        <div
          className={`border-t px-4 py-4 md:hidden ${
            isOverHero ? "border-white/15 bg-black/90" : "border-black/8 bg-white"
          }`}
        >
          {nav.map((item) =>
            item.label === "产品中心" ? (
              <Link
                key={item.label}
                href="/products"
                className={`block py-2.5 text-[13px] ${
                  isOverHero ? "text-white/90" : "text-black/80"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ) : item.children ? (
              <div key={item.label} className="py-2">
                <span
                  className={`text-[13px] font-medium ${
                    isOverHero ? "text-white" : "text-black"
                  }`}
                >
                  {item.label}
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`rounded px-3 py-2 text-[13px] ${
                        isOverHero
                          ? "bg-white/10 text-white/90"
                          : "bg-black/5 text-black/80"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2.5 text-[13px] ${
                  isOverHero ? "text-white/90" : "text-black/80"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
