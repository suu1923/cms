import type { Core } from '@strapi/strapi';

const extraImgSrc = [
  process.env.OSS_BASE_URL,
  process.env.CMS_MEDIA_ORIGIN,
  // 兼容你当前后台里出现的资源域名（避免媒体库缩略图被 CSP 拦截）
  'https://cmsfile.chinahyct.com',
].filter(Boolean) as string[];
const extraFrameSrc = ['http://localhost:3000'];

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'", ...extraFrameSrc],
          'frame-src': ["'self'", ...extraFrameSrc],
          'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', ...extraImgSrc],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // 将 API 返回中无协议的媒体 url（如 OSS 域名）补全为 https://，便于后台与前端正确显示
  'global::ensure-media-url',
];

export default config;
