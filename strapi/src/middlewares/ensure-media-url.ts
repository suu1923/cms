import type { Core } from '@strapi/strapi';

/**
 * 仅补全协议：无 http(s) 的 "domain.com/path" -> "https://domain.com/path"，
 * 保持 OSS 域名不变（不替换为自定义域名）。
 */
function normalizeMediaUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  if (!/^https?:\/\//i.test(url) && /^[\w.-]+\.[\w.-]+\/.+/.test(url)) {
    return `https://${url}`;
  }
  return url;
}

function ensureMediaUrl(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === 'string') {
    return normalizeMediaUrl(value);
  }
  if (Array.isArray(value)) {
    return value.map(ensureMediaUrl);
  }
  if (typeof value === 'object') {
    const recordValue = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === 'string' && looksLikeTimestampFieldName(k) && !isValidDateString(v)) {
        out[k] = null;
        continue;
      }

      out[k] = ensureMediaUrl(v);
    }

    // Strapi Admin 首页的 “最近编辑” 小组件会对 `updatedAt` 做 `new Date(document.updatedAt)`，
    // 当字段缺失或为空字符串时会导致 date-fns 抛 RangeError 并让整个后台进入错误页。
    // 这里对“看起来像 recent document”的对象做一次兜底，确保 `updatedAt` 存在且可解析。
    if (looksLikeRecentDocument(recordValue)) {
      const updatedAtValue = out.updatedAt;
      const isUpdatedAtSafe =
        updatedAtValue === null ||
        typeof updatedAtValue === 'number' ||
        (typeof updatedAtValue === 'string' && isValidDateString(updatedAtValue));

      if (!isUpdatedAtSafe) {
        out.updatedAt = null;
      }
    }

    return out;
  }
  return value;
}

function looksLikeTimestampFieldName(fieldName: string): boolean {
  if (!fieldName) return false;

  return (
    fieldName === 'createdAt' ||
    fieldName === 'updatedAt' ||
    fieldName === 'publishedAt' ||
    fieldName === 'startDate' ||
    fieldName === 'endDate'
  );
}

function isValidDateString(value: string): boolean {
  if (!value) return false;

  const parsedMs = Date.parse(value);
  return Number.isFinite(parsedMs);
}

function looksLikeRecentDocument(value: Record<string, unknown>): boolean {
  return (
    typeof value.title === 'string' &&
    typeof value.contentTypeUid === 'string'
  );
}

export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: { body?: unknown; response?: { type?: string } }, next: () => Promise<void>) => {
    await next();
    const body = ctx.body;
    if (body != null && typeof body === 'object' && !Buffer.isBuffer(body) && ctx.response?.type?.includes('application/json')) {
      try {
        ctx.body = ensureMediaUrl(body) as typeof body;
      } catch (_) {
        // 不破坏原有响应
      }
    }
  };
};
