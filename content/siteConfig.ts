function getStudyYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1-indexed

  // Each June 1st advances the year. First transition: June 1 2026 (1st → 2nd).
  const transitions = month >= 6 ? year - 2025 : year - 2026

  if (transitions <= 0) return '1st'
  if (transitions === 1) return '2nd'
  if (transitions === 2) return '3rd'
  if (transitions === 3) return '4th'
  return 'Undergrad Complete'
}

export const siteConfig = {
  name: 'Hryday Nitin Lath',
  shortName: 'Hryday',
  title: 'Builder · Manufacturing Engineering · BITS Pilani',
  description:
    "I study manufacturing engineering at BITS Pilani and I'm an Associate at PIEDS, the campus incubator. I'm building Kapital Grants, which helps founders find non-dilutive grants and get matched with incubators. The rest of my time goes into small tools I actually ship: an ASCII camera that runs entirely in the browser, a personal command centre with an AI agent wired into Telegram, a voice-to-schedule pipeline, and a legal rights assistant for India. I'm interested in entrepreneurship, finance and robotics, and I'm looking for internships in those areas.",
  location: 'India',
  email: 'hryday7765@gmail.com',
  github: 'https://github.com/hryded-lab',
  linkedin: 'https://www.linkedin.com/in/hryday-lath-b30b42302/',
  // Served straight out of /public so updating the resume is just replacing the
  // file and pushing. No env var, no third-party host.
  resume: '/resume.pdf',
  resumeFileName: 'Hryday-Nitin-Lath-Resume.pdf',
  currently: [
    { label: 'Building', value: 'Kapital Grants, the MVP and the grant database' },
    { label: 'Shipping', value: 'Compass, Darkroom and Dayforge' },
    { label: 'Learning', value: 'Computer vision and agentic AI systems' },
    { label: 'Reading', value: 'The Intelligent Investor by Benjamin Graham' },
    { label: 'Open to', value: 'PM, finance and startup internships. Remote, Mumbai or abroad.' },
  ],
  stats: [
    { label: 'CGPA', value: '7.90' },
    { label: 'Year of Study', value: getStudyYear() },
    { label: 'Projects Built', value: '8' },
    { label: 'Startups Founded', value: '1' },
  ],
  metaDescription:
    'Portfolio of Hryday Nitin Lath, a manufacturing engineering student at BITS Pilani building Kapital Grants and shipping small AI tools.',
  ogImage: '/og-image.jpeg',
}
