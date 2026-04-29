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
  title: 'Entrepreneur · Builder · BITS Pilani',
  description:
    "I am an undergraduate at BITS Pilani (2025–2029) and an Associate at PIEDS, the university's official incubator. Currently, I am building Kapital Grants, a platform designed to streamline grant applications and match founders with active incubators. I'm a \"learning by doing\" builder who experiments with AI across various domains to solve real-world problems. With a deep interest in Entrepreneurship, Finance, and Robotics, I am actively seeking internship opportunities where I can contribute to these sectors while learning more about them!",
  location: 'India',
  email: 'hryday7765@gmail.com',
  github: 'https://github.com/Hryday-7765',
  linkedin: 'https://www.linkedin.com/in/hryday-lath-b30b42302/',
  resume: process.env.NEXT_PUBLIC_RESUME_URL || '/resume.pdf',
  currently: [
    { label: 'Building', value: 'Kapital Grants — MVP & grant database' },
    { label: 'Learning', value: 'RAG pipelines & agentic AI systems' },
    { label: 'Reading', value: 'The Intelligent Investor — Benjamin Graham' },
    { label: 'Open to', value: 'PM, finance & startup internships — remote, Mumbai, or abroad' },
  ],
  stats: [
    { label: 'CGPA', value: '7.90' },
    { label: 'Year of Study', value: getStudyYear() },
    { label: 'Projects Built', value: '5+' },
    { label: 'Startups Founded', value: '1' },
  ],
  metaDescription:
    'Portfolio of Hryday Nitin Lath — entrepreneur and builder at BITS Pilani, interested in finance, capital markets, and business analysis.',
  ogImage: '/og-image.jpeg',
}
