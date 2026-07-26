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

export function buildProfileText(): string {
  const p = getProfile()

  const skillsByCategory = p.skills.reduce<Record<string, string[]>>((acc, s) => {
    ;(acc[s.category] ??= []).push(`${s.name} (${proficiencyLabel(s.proficiency)})`)
    return acc
  }, {})

  const lines: string[] = [
    `# ${p.name}`,
    '',
    `> ${p.title} — ${p.location}`,
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
      `### ${e.role} — ${e.company} (${e.startDate} – ${e.endDate})`,
      `${e.location}`,
      ...e.description.map(d => `- ${d}`),
      '',
    ]),
    '## Experience',
    ...p.work.flatMap(e => [
      `### ${e.role} — ${e.company} (${e.startDate} – ${e.endDate}, ${e.type})`,
      `${e.location}${e.current ? ' · Current' : ''}`,
      ...e.description.map(d => `- ${d}`),
      '',
    ]),
    '## Projects',
    ...p.projects.flatMap(pr => [
      `### ${pr.title} (${pr.year}) — ${pr.category}`,
      pr.longDescription,
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
      lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug}) — ${post.date}. ${post.excerpt}`)
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

export function buildWebsiteJsonLd() {
  const p = getProfile()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${p.name} — Portfolio`,
    description: p.metaDescription,
    inLanguage: 'en',
    author: { '@id': `${SITE_URL}/#person` },
  }
}
