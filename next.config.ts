import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows dynamic CDN hostnames configured in env
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // In Workers environment, images are served directly from the CDN
    unoptimized: true,
  },
  experimental: {},
};

export default nextConfig;
