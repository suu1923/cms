"use client";

type Channel = {
  name: string;
  href: string;
  qrcode?: string;
};

export function FloatingCornerWidget({ channels }: { channels: Channel[] }) {
  void channels;

  return (
    <div className="fixed right-5 bottom-8 z-50 hidden md:flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5"
        aria-label="回到顶部"
      >
        <span className="text-2xl leading-none">⌃</span>
      </button>

    </div>
  );
}

