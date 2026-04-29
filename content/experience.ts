export type Experience = {
  id: string
  role: string
  company: string
  location: string
  type: string
  startDate: string
  endDate: string
  current: boolean
  description: string[]
  logo: string
  accentColor: string
}

export const experiences: Experience[] = [
  {
    id: 'kapital-grants',
    role: 'Co-Founder & CEO + CFO',
    company: 'Kapital Grants',
    location: 'Remote',
    type: 'Startup',
    startDate: 'Apr 2026',
    endDate: 'Present',
    current: true,
    description: [
      'Co-founded a startup focused on helping new founders discover and secure non-dilutive grants.',
      'Won 1st place at a competitive NoDevBuild competition — ₹5 Lakhs in-kind for MVP development and product acceleration.',
      'Initiated partnership discussions with Invention Engine and led MVP + grant database development end-to-end.',
    ],
    logo: '/logos/kapital.png',
    accentColor: '#10B981',
  },
  {
    id: 'dihadi',
    role: 'Growth Intern',
    company: 'Dihadi — Agentic AI Platform',
    location: 'Remote',
    type: 'Internship',
    startDate: 'Apr 2026',
    endDate: 'May 2026',
    current: false,
    description: [
      'Spearheaded end-to-end SISFS grant acquisition through strategic application development and targeted cold outreach to prospective incubators.',
      'Designed structured onboarding and integration workflows to ensure seamless client transitions and operational consistency.',
    ],
    logo: '/logos/dihadi.png',
    accentColor: '#6366F1',
  },
  {
    id: 'pieds',
    role: 'Associate',
    company: 'PIEDS — BITS Pilani TBI',
    location: 'Pilani, Rajasthan',
    type: 'Extracurricular',
    startDate: 'Feb 2026',
    endDate: 'Present',
    current: true,
    description: [
      'Performed proactive outreach for event guest onboarding and strategic partnerships, connecting with Founders from Metvy, ImpactD, and ALTA School of Technology.',
      'Managed coordination and hospitality for Founders and VCs at the inaugural E-Summit \'26 across 4 days of programming.',
      'Created promotional and marketing collateral using Figma; negotiated with Pilani vendors for the first-ever Dropshipping Event.',
    ],
    logo: '/logos/pieds.png',
    accentColor: '#3B82F6',
  },
  {
    id: 'bits-pilani',
    role: 'B.E. Manufacturing Engineering',
    company: 'BITS Pilani',
    location: 'Rajasthan, India',
    type: 'Education',
    startDate: 'Aug 2025',
    endDate: 'May 2029',
    current: true,
    description: [
      "Pursuing B.E. in Manufacturing Engineering at one of India's premier engineering institutions (NIRF #16), CGPA 7.90.",
      'Coursework spanning quantitative methods, operations research, and systems analysis.',
      'Class XII: 80.20% (CBSE, RIS Mumbai) · Class X: 90.80% (IGCSE, MBIS Mumbai).',
    ],
    logo: '/logos/bits.png',
    accentColor: '#F59E0B',
  },
]
