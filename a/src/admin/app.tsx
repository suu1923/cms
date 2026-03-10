import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      'en',
      'zh-Hans', // 简体中文，右上角语言下拉里可选
    ],
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
