# 山东航宇游艇官网

Next.js + React + Tailwind，内容由 **JSON 文件** 驱动，构建时静态生成（SSG）。

## 开发

```bash
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## 可选：接入 Strapi（后台驱动内容）

默认情况下，本项目会使用 `src/data/*.json` 的本地内容。像 `tianhai-demo` 这种 **Strapi bootstrap 自动生成的演示产品**，只有在前端配置了 CMS 地址后才能访问到：

- **创建本地环境变量文件**：复制 `.env.local.example` 为 `.env.local`
- **确认 Strapi 在运行**：`cd strapi && npm run develop`

然后访问 `http://localhost:3000/products/tianhai-demo` 应该能命中后台数据。

如果仍然提示未找到：
- **检查 `CMS_BASE_URL`** 是否是 `http://localhost:1337/api`（必须带 `/api`）
- **检查 Strapi 权限**：在后台把 `products` 的 `find/findOne` 对 `Public` 放开，或在 `.env.local` 里配置 `CMS_TOKEN`

首页「产品展示」等 **客户端组件**里的封面图/视频，Strapi 常返回相对路径 `/uploads/...`。服务端能读 `CMS_BASE_URL` 拼完整地址，**浏览器里读不到**，需在 `.env.local` 增加其一（与 `CMS_BASE_URL` 同源、去掉 `/api`）：

- **`NEXT_PUBLIC_CMS_ORIGIN`**（推荐），例如：`http://localhost:1337`
- 或 **`NEXT_PUBLIC_CMS_BASE_URL`**，例如：`http://localhost:1337/api`（会自动去掉 `/api`）

否则封面在浏览器里会请求到 Next 本站域名下的 `/uploads/...`，导致 404、背景不显示。

## 首页封面（Strapi）

- **「首页（Sections）」动态区**可添加 **「首页封面」** 组件（`section-cover-hero`），用于在后台配置首屏大图/视频、标题、按钮、跑马灯及 **封面高度**（`full` 满屏 / `two_thirds` 约屏幕 2/3）。
- 若未添加该组件，前端回退到本地 `src/data/hero.json` 内容。

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
