/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/Worker-personality-Test',         // ✅ 路徑前綴（網址路徑）
  assetPrefix: '/Worker-personality-Test/',     // ✅ 靜態資源前綴（注意結尾要有 /）
  images: {
    unoptimized: true,                          // ✅ 禁用 next/image 最佳化
  },
  eslint: {
    ignoreDuringBuilds: true                    // ✅ 忽略 eslint 錯誤
  }
};

module.exports = nextConfig;
