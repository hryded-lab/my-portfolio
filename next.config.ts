import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
    ],
  },
  outputFileTracingIncludes: {
    '/api/posts': ['./content/blog/**/*.mdx'],
    '/api/posts/[slug]': ['./content/blog/**/*.mdx'],
  },
}

export default nextConfig
