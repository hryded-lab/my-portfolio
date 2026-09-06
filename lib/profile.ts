import { siteConfig } from '@/content/siteConfig'
import { projects } from '@/content/projects'
import { experiences } from '@/content/experience'
import { skills } from '@/content/skills'
import { getAllPosts } from '@/lib/posts'

// Server-only. Single canonical projection of everything in /content, consumed by
// the JSON-LD block, the no-JS/screen-reader markup, /llms.txt and the assistant's
// system prompt — so editing /content updates every machine-readable surface at once.

export const SITE_URL = 'https://hrydaylath.vercel.app'

const PROFICIENCY = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'] as const

export function proficiencyLabel(level: number): string {
  return PROFICIENCY[level] ?? 'Beginner'
}

export type Profile = ReturnType<typeof getProfile>

export function getProfile() {
  const education = experiences.filter(e => e.type === 'Education')
  const work = experiences.filter(e => e.type !== 'Education')

  return {
    name: siteConfig.name,
    shortName: siteConfig.shortName,
    title: siteConfig.title,
    location: siteConfig.location,
    email: siteConfig.email,
    github: siteConfig.github,
    linkedin: siteConfig.linkedin,
    description: siteConfig.description,
    metaDescription: siteConfig.metaDescription,
    currently: siteConfig.currently,
    stats: siteConfig.stats,
    education,
    work,
    experiences,
    projects,
    skills,
    posts: getAllPosts(),
  }
}

// ── Plain-text rendering ──────────────────────────────────────────────────────
// Used by /llms.txt and by the assistant system prompt. One representation means
// the assistant can never describe Hryday differently than a crawler reads him.

// `compact` drops per-project prose and post excerpts, roughly halving the token
// count. It is a strict subset of the full text, never a different set of facts, so
// the assistant still cannot contradict what a crawler reads. Used by the chat route,
// which pays for the whole prompt on every single message against an 8k/min budget.
export function buildProfileText({ compact = false } = {}): string {
  const p = getProfile()

  const skillsByCategory = p.skills.reduce<Record<string, string[]>>((acc, s) => {
    ;(acc[s.category] ??= []).push(`${s.name} (${proficiencyLabel(s.proficiency)})`)
    return acc
  }, {})

  const lines: string[] = [
    `# ${p.name}`,
    '',
    `> ${p.title}, ${p.location}`,
    '',
    p.description,
    '',
    '## Contact',
    `- Email: ${p.email}`,
    `- GitHub: ${p.github}`,
    `- LinkedIn: ${p.linkedin}`,
    `- Website: ${SITE_URL}`,
    '',
    '## At a glance',
    ...p.stats.map(s => `- ${s.label}: ${s.value}`),
    '',
    '## Currently',
    ...p.currently.map(c => `- ${c.label}: ${c.value}`),
    '',
    '## Education',
    ...p.education.flatMap(e => [
      `### ${e.role}, ${e.company} (${e.startDate} to ${e.endDate})`,
      `${e.location}`,
      ...e.description.map(d => `- ${d}`),
      '',
    ]),
    '## Experience',
    ...p.work.flatMap(e => [
      `### ${e.role}, ${e.company} (${e.startDate} to ${e.endDate}, ${e.type})`,
      `${e.location}${e.current ? ' · Current' : ''}`,
      ...e.description.map(d => `- ${d}`),
      '',
    ]),
    '## Projects',
    ...p.projects.flatMap(pr => [
      `### ${pr.title} (${pr.year}), ${pr.category}`,
      compact ? pr.description : pr.longDescription,
      `Tech: ${pr.tech.join(', ')}`,
      ...(pr.github ? [`Source: ${pr.github}`] : []),
      ...(pr.live ? [`Live: ${pr.live}`] : []),
      '',
    ]),
    '## Skills',
    ...Object.entries(skillsByCategory).map(([cat, list]) => `- ${cat}: ${list.join(', ')}`),
  ]

  if (p.posts.length) {
    lines.push('', '## Writing')
    for (const post of p.posts) {
      lines.push(
        compact
          ? `- ${post.title} (${post.date}), /blog/${post.slug}`
          : `- [${post.title}](${SITE_URL}/blog/${post.slug}), ${post.date}. ${post.excerpt}`
      )
    }
  }

  return lines.join('\n')
}

// ── schema.org ────────────────────────────────────────────────────────────────

export function buildPersonJsonLd() {
  const p = getProfile()
  const alumni = p.education[0]

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: p.name,
    givenName: p.shortName,
    url: SITE_URL,
    image: `${SITE_URL}/me.jpg`,
    email: `mailto:${p.email}`,
    jobTitle: p.work.filter(e => e.current).map(e => e.role),
    description: p.description,
    address: { '@type': 'PostalAddress', addressCountry: p.location },
    sameAs: [p.github, p.linkedin],
    knowsAbout: p.skills.map(s => s.name),
    ...(alumni && {
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: alumni.company,
        address: { '@type': 'PostalAddress', addressLocality: alumni.location },
      },
    }),
    worksFor: p.work
      .filter(e => e.current)
      .map(e => ({ '@type': 'Organization', name: e.company })),
    hasOccupation: p.work.map(e => ({
      '@type': 'Occupation',
      name: e.role,
      occupationLocation: { '@type': 'Place', name: e.location },
      description: e.description.join(' '),
    })),
    subjectOf: p.projects.map(pr => ({
      '@type': 'CreativeWork',
      name: pr.title,
      description: pr.description,
      dateCreated: String(pr.year),
      keywords: pr.tech.join(', '),
      ...(pr.github && { codeRepository: pr.github }),
    })),
  }
}

// Article structured data. Without this a post is just a page to a crawler; with
// it, it is eligible for article treatment and carries an author and a date.
export function buildArticleJsonLd(post: {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  readingTime: string
}) {
  const p = getProfile()
  const url = `${SITE_URL}/blog/${post.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    inLanguage: 'en',
    author: { '@type': 'Person', name: p.name, url: SITE_URL },
    publisher: { '@type': 'Person', name: p.name, url: SITE_URL },
    image: `${SITE_URL}${siteConfig.ogImage}`,
  }
}

export function buildBreadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: `${SITE_URL}${step.path}`,
    })),
  }
}

export function buildBlogJsonLd() {
  const p = getProfile()
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: `${p.name}: Writing`,
    description: siteConfig.blogTagline,
    inLanguage: 'en',
    author: { '@id': `${SITE_URL}/#person` },
    blogPost: p.posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      description: post.excerpt,
    })),
  }
}

export function buildWebsiteJsonLd() {
  const p = getProfile()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${p.name}: Portfolio`,
    description: p.metaDescription,
    inLanguage: 'en',
    author: { '@id': `${SITE_URL}/#person` },
  }
}
