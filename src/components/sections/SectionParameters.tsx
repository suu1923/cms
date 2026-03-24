"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionBackground, getSelectionHeightClass, selectionTitleClass } from "./sectionShared";
import type { SectionParameters as SectionParametersType } from "./types";

export default function SectionParameters({ section }: { section: SectionParametersType }) {
  const items = section.items ?? [];
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  const featuredItems = useMemo(
    () => items.filter((item) => item.isFeatured).slice(0, 6),
    [items],
  );
  const normalItems = useMemo(
    () => items.filter((item) => !item.isFeatured),
    [items],
  );
  const groupedNormalItems = useMemo(() => {
    const result: Array<{ group: string; items: typeof normalItems }> = [];
    const map = new Map<string, typeof normalItems>();

    normalItems.forEach((item) => {
      const groupName = (item.group ?? "").trim();
      if (!map.has(groupName)) {
        map.set(groupName, []);
      }
      map.get(groupName)?.push(item);
    });

    map.forEach((groupItems, group) => {
      result.push({ group, items: groupItems });
    });

    return result;
  }, [normalItems]);
  const groupedAllItems = useMemo(() => {
    const result: Array<{ group: string; items: typeof items }> = [];
    const map = new Map<string, typeof items>();

    items.forEach((item) => {
      const groupName = (item.group ?? "").trim();
      if (!map.has(groupName)) {
        map.set(groupName, []);
      }
      map.get(groupName)?.push(item);
    });

    map.forEach((groupItems, group) => {
      result.push({ group, items: groupItems });
    });

    return result;
  }, [items]);

  const isLarge = section.isLargeModuleDisplay === true;

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const renderRows = (list: typeof items) =>
    list.map((p, i) => (
      <div
        key={p.id ?? i}
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 py-3 text-[15px] leading-relaxed"
      >
        <p className="text-black/62">{p.key}</p>
        <p className="text-right text-[28px] font-light leading-none text-black sm:text-[30px]">{p.value}</p>
      </div>
    ));

  return (
    <section className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="py-12 sm:py-14">
          <div className="max-w-[760px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/45">Specifications</p>
            <h2 className={`${selectionTitleClass} mt-3`}>
              {section.title ?? "产品参数"}
            </h2>
          </div>

          {featuredItems.length > 0 && (
            <div className="mt-8 grid gap-0 border-y border-black/12 sm:grid-cols-2 lg:grid-cols-3">
              {featuredItems.map((item, idx) => (
                <div
                  key={item.id ?? `${item.key}-${idx}`}
                  className="border-b border-black/10 px-2 py-5 sm:px-4 lg:px-5 [&:nth-last-child(-n+1)]:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0 sm:[&:not(:nth-child(2n))]:border-r lg:[&:not(:nth-child(3n))]:border-r border-black/10"
                >
                  <p className="text-[34px] font-light leading-none tracking-tight text-black sm:text-[38px] lg:text-[44px]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[12px] text-black/52">{item.key}</p>
                </div>
              ))}
            </div>
          )}

          {featuredItems.length === 0 && (
            <div className={`mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white/88 ${isLarge ? "px-6 py-4 sm:px-8 sm:py-5" : "px-5 py-3 sm:px-6"}`}>
              <p className="py-4 text-[14px] text-black/55">暂无重点参数，可在后台将参数标记为“单独展示”。</p>
            </div>
          )}

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-md bg-black px-6 py-3 text-[16px] font-medium text-white transition hover:bg-black/90"
            >
              查看所有配置
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <div
            className="absolute inset-0 bg-black/35"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[640px] border-l border-black/10 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="查看所有配置"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-6">
                <h3 className="text-[20px] font-medium tracking-tight text-black">
                  {section.title ?? "产品参数"}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-black/15 bg-white px-3 py-1.5 text-[12px] text-black/70 transition hover:bg-black/[0.04]"
                >
                  关闭
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                {groupedAllItems.map((group, gi) => (
                  <details
                    key={`${group.group || "default"}-drawer-${gi}`}
                    open
                    className="mb-3 overflow-hidden rounded-lg border border-black/12 bg-white"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-black/80 [&::-webkit-details-marker]:hidden">
                      <span>{group.group || "未分组参数"}</span>
                      <span className="text-black/45">+</span>
                    </summary>
                    <div className="border-t border-black/8">
                      <table className="w-full border-collapse text-left text-[12px] sm:text-[13px]">
                        <tbody>
                          {group.items.map((p, i) => (
                            <tr key={p.id ?? i} className="border-b border-black/8 last:border-b-0">
                              <th className="w-[44%] px-4 py-2.5 font-medium text-black/65">{p.key}</th>
                              <td className="px-4 py-2.5 text-black/85">{p.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
