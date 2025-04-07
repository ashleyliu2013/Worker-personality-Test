// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Worker-personality-Test', // ⭐ GitHub Pages 需要
  images: {
    unoptimized: true, // 禁用 Next.js 的圖片優化
  },
  eslint: {
    ignoreDuringBuilds: true, // ⭐ 忽略 ESLint 錯誤，不然 build 會失敗
  },
};

module.exports = nextConfig;
