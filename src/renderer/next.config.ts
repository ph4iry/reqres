import { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Remove electron-renderer target - this might be causing issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        process: false,
      };
    }
    return config;
  }
};

module.exports = nextConfig;