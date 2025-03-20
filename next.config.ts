import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for better Docker support
  swcMinify: true,
  experimental: {
    // Any experimental features you want to enable
  },
};

export default nextConfig;
