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
  accentColor: string
}

// Derived once here so the lock screens and the boot screen never restate the
// institution or the graduation year as literals.
export function getEducation(): Experience | undefined {
  return experiences.find(e => e.type === 'Education')
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
      'Co-founded a platform that helps new founders find and apply for non-dilutive grants.',
      'Won 1st place at NoDevBuild, which came with ₹5 Lakhs in-kind toward building the MVP.',
      'Opened partnership talks with Invention Engine, and built the MVP and the grant database.',
    ],
    accentColor: '#10B981',
  },
  {
    id: 'dihadi',
    role: 'Growth Intern',
    company: 'Dihadi (Agentic AI Platform)',
    location: 'Remote',
    type: 'Internship',
    startDate: 'Apr 2026',
    endDate: 'May 2026',
    current: false,
    description: [
      'Ran the SISFS grant application from start to finish, including cold outreach to incubators.',
      'Wrote the onboarding and integration workflow the team used to bring on new clients.',
    ],
    accentColor: '#6366F1',
  },
  {
    id: 'pieds',
    role: 'Associate',
    company: 'PIEDS, BITS Pilani TBI',
    location: 'Pilani, Rajasthan',
    type: 'Extracurricular',
    startDate: 'Feb 2026',
    endDate: 'Present',
    current: true,
    description: [
      'Handled outreach and guest onboarding for events, bringing in founders from Metvy, ImpactD and ALTA School of Technology.',
      "Looked after founders and VCs across the four days of the first E-Summit '26.",
      'Made promotional collateral in Figma and negotiated with Pilani vendors for the first Dropshipping Event.',
    ],
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
      'Studying manufacturing engineering at BITS Pilani (NIRF #11), currently at a CGPA of 7.90.',
      'Coursework covers quantitative methods, operations research and systems analysis.',
      'Class XII: 80.20% (CBSE, RIS Mumbai). Class X: 90.80% (IGCSE, MBIS Mumbai).',
    ],
    accentColor: '#F59E0B',
  },
]

const edu = getEducation()

export const institution = edu?.company ?? ''
export const graduationYear = edu?.endDate.split(' ').pop() ?? ''
