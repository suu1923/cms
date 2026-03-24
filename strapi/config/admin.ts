import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET') ?? '',
  },
  apiToken: {
    salt: env('API_TOKEN_SALT') ?? '',
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT') ?? '',
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY') ?? '',
  },
  preview: {
    enabled: true,
    config: {
      handler: async (uid, { documentId }: { documentId?: string }) => {
        // Product 预览：直接跳转到前端产品详情页
        if (uid !== 'api::product.product' || !documentId) return undefined;
        const frontendOrigin = env('FRONTEND_URL', 'http://localhost:3000').replace(/\/$/, '');
        const entity = await strapi.db.query('api::product.product').findOne({
          where: { documentId },
          select: ['slug'],
        });
        const slug = entity?.slug;
        if (!slug) return undefined;
        return `${frontendOrigin}/products/${slug}`;
      },
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});

export default config;
