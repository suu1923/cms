import type { Core } from '@strapi/strapi';

/**
 * 配置 Strapi 上传插件，使用阿里云 OSS 作为存储
 * 插件包：strapi-provider-upload-oss
 *
 * 使用自定义域名（OSS_BASE_URL 填 https://你的自定义域名）可避免浏览器强制下载、实现在线预览：
 * https://help.aliyun.com/zh/oss/how-to-ensure-an-object-is-previewed-when-you-access-the-object
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-oss',
      providerOptions: {
        accessKeyId: env('OSS_ACCESS_KEY_ID'),
        accessKeySecret: env('OSS_ACCESS_KEY_SECRET'),
        region: env('OSS_REGION'),
        bucket: env('OSS_BUCKET'),
        uploadPath: env('OSS_UPLOAD_PATH'),
        // 建议填自定义域名（如 https://cdn.xxx.com），否则用默认域名可能导致图片被强制下载
        baseUrl: env('OSS_BASE_URL'),
        timeout: env.int('OSS_TIMEOUT', 60),
        secure: env.bool('OSS_SECURE', true),
        internal: env.bool('OSS_INTERNAL', false),
        bucketParams: {
          ACL: 'public-read',
        },
      },
    },
  },
});

export default config;
