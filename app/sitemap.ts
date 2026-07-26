import type { MetadataRoute } from 'next'
import { getProfile, SITE_URL } from '@/lib/profile'

// Replaces the old hand-maintained public/sitemap.xml, whose lastmod dates had to be
// edited by hand and silently went stale.
export default function sitemap(): MetadataRoute.Sitemap {
  const { posts } = getProfile()
  const latestPost = posts[0]?.date

  return [
    { url: `${SITE_URL}/`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/profile`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPost ? new Date(latestPost) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map(post => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
