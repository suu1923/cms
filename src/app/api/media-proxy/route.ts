import { NextRequest } from "next/server";

const ALLOWED_HOSTS = new Set([
  "cmsfile.chinahyct.com",
  "yuyi-cms.oss-cn-qingdao.aliyuncs.com",
]);

function getCmsOrigin(): string {
  const base = process.env.CMS_BASE_URL?.trim();
  if (base) return base.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const pubOrigin = process.env.NEXT_PUBLIC_CMS_ORIGIN?.trim();
  if (pubOrigin) return pubOrigin.replace(/\/+$/, "");
  const pubBase = process.env.NEXT_PUBLIC_CMS_BASE_URL?.trim();
  if (pubBase) return pubBase.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  return "";
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  const relativePath = req.nextUrl.searchParams.get("path");
  if (!raw && !relativePath) return new Response("Missing url or path", { status: 400 });

  let target: URL;
  if (relativePath) {
    if (!relativePath.startsWith("/")) {
      return new Response("Invalid path", { status: 400 });
    }
    const origin = getCmsOrigin();
    if (!origin) {
      return new Response("CMS origin not configured", { status: 500 });
    }
    try {
      target = new URL(relativePath, origin);
    } catch {
      return new Response("Invalid path", { status: 400 });
    }
  } else {
    try {
      target = new URL(raw!);
    } catch {
      return new Response("Invalid url", { status: 400 });
    }
  }

  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return new Response("Host not allowed", { status: 403 });
  }

  const upstream = await fetch(target.toString(), { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  headers.set("cache-control", "public, max-age=300");

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}

