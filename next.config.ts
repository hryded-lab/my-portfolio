import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // This project keeps its own AI-agent rules file (CLAUDE.md) out of git;
  // skip Next's auto-generated AGENTS.md to match.
  agentRules: false,
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
