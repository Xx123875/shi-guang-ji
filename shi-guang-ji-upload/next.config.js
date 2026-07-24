/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除 output: 'export' — Supabase Auth 需要 Node.js 运行时
  // basePath 保留，部署时根据服务器配置调整
  basePath: process.env.NODE_ENV === 'production' ? '/shi-guang-ji' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
