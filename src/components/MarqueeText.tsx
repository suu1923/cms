 "use client";

 import { useMemo } from "react";

 interface MarqueeTextProps {
   text: string;
   /** 一圈滚动时长（秒），越大越慢 */
   durationSec?: number;
   className?: string;
 }

 export function MarqueeText({ text, durationSec = 24, className }: MarqueeTextProps) {
   // 复制两份文本，保证无缝滚动
   const items = useMemo(() => [text, text], [text]);

   return (
     <div className={`overflow-hidden whitespace-nowrap ${className ?? ""}`}>
       <div
         className="inline-flex min-w-full gap-12 will-change-transform motion-reduce:translate-x-0"
         style={{
           animation: `marquee ${durationSec}s linear infinite`,
         }}
       >
         {items.map((t, idx) => (
           <span
             key={idx}
             className="text-[12px] font-medium uppercase tracking-[0.35em] text-white/75"
           >
             {t}
           </span>
         ))}
       </div>
     </div>
   );
 }

