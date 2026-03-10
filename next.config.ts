import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出，生成纯 HTML + 资源到 out/ 目录
  output: "export",
};

export default nextConfig;
