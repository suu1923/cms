# 山东航宇游艇官网

Next.js + React + Tailwind，内容由 **JSON 文件** 驱动，构建时静态生成（SSG）。

## 开发

```bash
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## 内容编辑（JSON）

所有可编辑文案与配置在 `src/data/` 下，改完保存即可，无需后端：

| 文件 | 说明 |
|------|------|
| `site.json` | 站点名称、描述、联系方式、页脚版权与友情链接 |
| `nav.json` | 主导航菜单（含产品中心下拉） |
| `hero.json` | 首页首屏标题、副标题、背景图路径、按钮 |
| `about.json` | 关于我们标题、摘要、正文、数据项 |
| `products.json` | 首页精选产品 `featured`、产品分类 `categories` |

修改后重新运行 `npm run dev` 或部署前执行 `npm run build` 即可生效。

## 图片资源

- **首屏大图**：将图片放到 `public/hero.jpg`，首屏会自动使用；不放则仅显示深色渐变。
- **产品图**：将产品图片放到 `public/products/`，并在 `src/data/products.json` 的 `featured[].image` 里填写路径，如 `/products/liangqi-12m.jpg`。图片缺失时卡片会显示「暂无图片」。

### 从原站获取图片

当前项目**无法自动抓取** [山东航宇游艇原站](https://www.chinahyct.com/) 的图片（受限于运行环境与合规）。请手动操作：

1. 打开 https://www.chinahyct.com/ ，在产品中心等页面找到需要的图片。
2. 右键图片 →「另存为」保存到本项目的 `public/` 或 `public/products/`。
3. 首屏大图可截取或下载原站 Banner，重命名为 `hero.jpg` 放入 `public/`。
4. 产品图按 `products.json` 里填写的文件名保存到 `public/products/`（如 `liangqi-12m.jpg`）。

若原站图片较多，可用浏览器扩展批量下载，或联系原站获取素材包。

## 构建与部署

```bash
npm run build
npm run start
```

可部署到 Vercel、Netlify 或任意支持 Node 的静态/SSG 托管。
