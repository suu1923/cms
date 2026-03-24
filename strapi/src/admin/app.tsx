import type { StrapiApp } from '@strapi/strapi/admin';
import type React from 'react';
import zhHansTranslations from './i18n/zh-Hans';

export default {
  config: {
    locales: [
      'en',
      'zh-Hans', // 简体中文，右上角语言下拉里可选
    ],
    translations: {
      "zh-Hans": zhHansTranslations,
    },
  },
  register(app: StrapiApp) {
    app.customFields.register({
      name: "selection-background-color",
      type: "string",
      intlLabel: {
        id: "selection-background-color.label",
        defaultMessage: "背景颜色",
      },
      intlDescription: {
        id: "selection-background-color.description",
        defaultMessage: "选择模块背景色（RGBA/颜色值）。",
      },
      components: {
        Input: async () =>
          (import("./components/SelectionBackgroundColorInput") as Promise<{
            default: React.ComponentType;
          }>),
      },
    });
  },
  bootstrap(_app: StrapiApp) {
    // 可在此做 admin 启动时的初始化
  },
};
