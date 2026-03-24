"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { getStrapiMediaUrl } from "@/lib/cmsClient";
import {
  SectionBackground,
  getSelectionHeightClass,
  selectionDescriptionClass,
  selectionTitleClass,
} from "./sectionShared";
import type { SectionPanorama360 as SectionPanorama360Type } from "./types";

function isVideoUrl(url: string) {
  const u = url.toLowerCase();
  return u.includes(".mp4") || u.includes(".webm") || u.includes(".mov") || u.includes(".m3u8");
}

function getViewerSourceUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `/api/media-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export default function SectionPanorama360({ section }: { section: SectionPanorama360Type }) {
  const viewerRef = useRef<HTMLDivElement>(null);
  if (section.enabled === false) return null;
  const mediaUrl =
    getStrapiMediaUrl(section.media) ??
    getStrapiMediaUrl(section.background?.backgroundImage) ??
    getStrapiMediaUrl(section.background?.backgroundVideo);
  const mediaIsVideo = mediaUrl ? isVideoUrl(mediaUrl) : false;

  useEffect(() => {
    if (!mediaUrl || mediaIsVideo || !viewerRef.current) return;

    let mounted = true;
    let viewer: { destroy: () => void } | null = null;

    void (async () => {
      const { Viewer } = await import("@photo-sphere-viewer/core");
      if (!mounted || !viewerRef.current) return;
      viewer = new Viewer({
        container: viewerRef.current,
        panorama: getViewerSourceUrl(mediaUrl),
        navbar: false,
        // 锁定缩放，避免触控板/滚轮导致持续放大
        minFov: 70,
        maxFov: 70,
        defaultZoomLvl: 0,
        zoomSpeed: 0,
        mousewheel: false,
        mousewheelCtrlKey: false,
        keyboard: false,
        touchmoveTwoFingers: false,
      });
    })();

    return () => {
      mounted = false;
      viewer?.destroy();
    };
  }, [mediaIsVideo, mediaUrl]);

  return (
    <section className={`relative overflow-hidden w-full ${getSelectionHeightClass(section.background)}`}>
      <SectionBackground background={section.background} />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="py-10">
          <div className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-6 sm:p-8">
            <h2 className={selectionTitleClass}>{section.title ?? "360° 全景"}</h2>
            {section.description && (
              <p className={`mt-2 ${selectionDescriptionClass}`}>{section.description}</p>
            )}
            <div className="mt-5 overflow-hidden rounded-xl bg-black/10">
              <div className="relative aspect-[16/9] w-full">
                {mediaUrl ? (
                  mediaIsVideo ? (
                    <video
                      src={mediaUrl}
                      className="h-full w-full object-cover"
                      controls
                      playsInline
                    />
                  ) : (
                    <div className="relative h-full w-full">
                      <Image
                        src={mediaUrl}
                        alt={section.title ?? "360 全景预览"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 1200px"
                        unoptimized
                      />
                      <div ref={viewerRef} className="absolute inset-0 h-full w-full" />
                    </div>
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-black/50">
                    请在后台上传 360 全景图片或视频
                  </div>
                )}
              </div>
            </div>
            {!mediaIsVideo && mediaUrl && (
              <p className="mt-2 text-xs text-black/45">提示：按住拖拽可查看 360 全景</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
