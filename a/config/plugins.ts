import type { Core } from '@strapi/strapi';

/**
 * 配置 Strapi 上传插件，使用阿里云 OSS 作为存储
 * 插件包：strapi-provider-upload-oss
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    config: {
      // 注意：这里需要写完整包名
      provider: 'strapi-provider-upload-oss',
      providerOptions: {
        accessKeyId: env('OSS_ACCESS_KEY_ID'),
        accessKeySecret: env('OSS_ACCESS_KEY_SECRET'),
        region: env('OSS_REGION'),
        bucket: env('OSS_BUCKET'),
        uploadPath: env('OSS_UPLOAD_PATH'),
        baseUrl: env('OSS_BASE_URL'),
        timeout: env.int('OSS_TIMEOUT', 60),
        secure: env.bool('OSS_SECURE', true),
        internal: env.bool('OSS_INTERNAL', false),
        bucketParams: {
          ACL: 'private',
          signedUrlExpires: 60 * 60,
        },
      },
    },
  },
});

export default config;
