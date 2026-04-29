export type Project = {
  id: string
  title: string
  description: string
  longDescription: string
  tech: string[]
  category: 'Web App' | 'Mobile' | 'Design' | 'Tool' | 'Other'
  image: string
  gradient: string
  github?: string
  live?: string
  featured: boolean
  year: number
}

export const projects: Project[] = [
  {
    id: 'kapital-grants',
    title: 'Kapital Grants',
    description: 'A startup platform helping new founders discover and secure non-dilutive grants — won ₹5 Lakhs in a NoDevBuild competition.',
    longDescription:
      'Kapital Grants simplifies the fragmented world of startup grants. Founders can discover government and private grant opportunities, track application deadlines, and get guided through the process. We won 1st place at NoDevBuild and are actively building our MVP with a curated grant database.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Figma'],
    category: 'Web App',
    image: '/projects/kapital-grants.jpg',
    gradient: 'from-emerald-600/20 via-teal-500/10 to-transparent',
    featured: true,
    year: 2026,
  },
  {
    id: 'smallsteps',
    title: 'SmallSteps',
    description: 'An AI screening tool using questionnaires and a RAG model to predict early signs of ADHD and Autism in children.',
    longDescription:
      'SmallSteps monitors child development through structured questionnaires, leveraging a RAG-based model trained on WHO-published documents to extract meaningful developmental insights. The platform supports parents and caregivers in identifying early signs of ADHD and Autism. Currently under active development with core features being iteratively refined.',
    tech: ['Python', 'FastAPI', 'RAG', 'ChromaDB', 'React', 'Next.js'],
    category: 'Web App',
    image: '/projects/smallsteps.jpg',
    gradient: 'from-blue-600/20 via-indigo-500/10 to-transparent',
    featured: true,
    year: 2026,
  },
  {
    id: 'swasthseva',
    title: 'SwasthSeva',
    description: 'A peer-support forum for Indians living with chronic diseases — inspired by PatientsLikeMe, built for the Indian healthcare ecosystem.',
    longDescription:
      'SwasthSeva is a localized Indian equivalent of PatientsLikeMe — a community-driven platform where people managing chronic conditions can share experiences, find support, and learn from peers. The platform is fully built and ready for deployment, pending finalization of a moderation solution.',
    tech: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    category: 'Web App',
    image: '/projects/swasthseva.jpg',
    gradient: 'from-rose-600/20 via-pink-500/10 to-transparent',
    featured: true,
    year: 2025,
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description: 'A Windows XP-themed OS portfolio — built through vibe coding and AI-assisted development to learn AI prompting, showcase work, and ship something genuinely fun.',
    longDescription:
      'Built as a creative side project — part portfolio, part experiment in AI-assisted development. The entire thing runs as a fake Windows XP desktop with a boot sequence, lock screen, draggable windows, and a Clippy-inspired AI assistant powered by Groq. Built through a mix of vibe coding and direct prompting as a way to learn how to work with AI effectively, not just use it. Stack: Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion. Deployed on Vercel.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'MDX'],
    category: 'Web App',
    image: '/projects/portfolio.jpg',
    gradient: 'from-violet-600/20 via-purple-500/10 to-transparent',
    github: 'https://github.com/Hryday-7765',
    featured: false,
    year: 2026,
  },
]
