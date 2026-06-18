import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  turbopack: {
    root: projectRoot
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'media.llcargentina.us',
      },
      {
        protocol: 'https',
        hostname: 'startcompanies.io',
      },
      {
        protocol: 'https',
        hostname: 'www.startcompanies.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog/noticias/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/blog/categoria/llc',
        destination: '/blog/categoria/abrir-llc',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/brand/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/img/partners/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/(robots.txt|llm.txt|sitemap.xml)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' }]
      }
    ];
  }
};

export default nextConfig;
