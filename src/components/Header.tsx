"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { nav } from "@/lib/content";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showLocale, setShowLocale] = useState(false);
  const pathname = usePathname();

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

  // 仅首页首屏使用透明叠加态，其它页面/状态统一白底深色，避免白灰背景看不清导航
  const isOverHero = pathname === "/" && !scrolled && !mobileOpen;
  const mainNav = nav;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOverHero
          ? "bg-gradient-to-b from-black/45 via-black/15 to-transparent text-white"
          : "bg-white text-black shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
      }`}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      {/* 顶栏 */}
      <div className="mx-auto flex h-14 max-w-[1560px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="text-[17px] font-medium tracking-tight"
        >
          山东航宇游艇
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex"
          aria-label="主导航"
        >
          {mainNav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
              >
                <span
                  className={`cursor-pointer text-[15px] transition ${
                    isOverHero ? "text-white/90 hover:text-white" : "text-black/80 hover:text-black"
                  }`}
                >
                  {item.label}
                </span>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-0.5">
                    <div
                      className={`min-w-[200px] py-1 ${
                        isOverHero
                          ? "border border-white/15 bg-black/90 backdrop-blur"
                          : "border border-black/8 bg-white shadow-lg"
                      }`}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-[14px] transition ${
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
                className={`text-[15px] transition ${
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

      {/* 移动端展开菜单 */}
      {mobileOpen && (
        <div
          className={`border-t px-4 py-4 md:hidden ${
            isOverHero ? "border-white/15 bg-black/90" : "border-black/8 bg-white"
          }`}
        >
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="py-2">
                <span
                  className={`text-[15px] font-medium ${
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
                      className={`rounded px-3 py-2 text-[14px] ${
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
                className={`block py-2.5 text-[14px] ${
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
