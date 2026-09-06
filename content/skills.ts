export type Skill = {
  name: string
  icon: string
  category: 'Engineering' | 'Programming' | 'Design' | 'Finance' | 'AI'
  proficiency: number // 1-5
  color: string
}

export const skills: Skill[] = [
  // Engineering
  { name: 'Fusion 360',                  icon: 'autodesk',    category: 'Engineering', proficiency: 3, color: '#E8720C' },
  { name: 'LTspice',                     icon: 'ltspice',     category: 'Engineering', proficiency: 2, color: '#CC0000' },
  { name: 'KiCad',                       icon: 'kicad',       category: 'Engineering', proficiency: 1, color: '#314CB0' },
  { name: 'MATLAB',                      icon: 'matlab',      category: 'Engineering', proficiency: 2, color: '#E16737' },
  { name: 'OrcaSlicer',                  icon: 'orcaslicer',  category: 'Engineering', proficiency: 2, color: '#FF6D00' },
  // Programming
  { name: 'TypeScript',                  icon: 'typescript',  category: 'Programming', proficiency: 3, color: '#3178C6' },
  { name: 'JavaScript',                  icon: 'javascript',  category: 'Programming', proficiency: 3, color: '#F7DF1E' },
  { name: 'React',                       icon: 'react',       category: 'Programming', proficiency: 3, color: '#61DAFB' },
  { name: 'Next.js',                     icon: 'nextdotjs',   category: 'Programming', proficiency: 3, color: '#7C7C7C' },
  { name: 'Python',                      icon: 'python',      category: 'Programming', proficiency: 2, color: '#3776AB' },
  { name: 'C',                           icon: 'c',           category: 'Programming', proficiency: 3, color: '#A8B9CC' },
  { name: 'Postgres / Supabase',         icon: 'supabase',    category: 'Programming', proficiency: 2, color: '#3FCF8E' },
  // Design
  { name: 'Figma',                       icon: 'figma',       category: 'Design',      proficiency: 2, color: '#F24E1E' },
  { name: 'Tailwind CSS',                icon: 'tailwindcss', category: 'Design',      proficiency: 3, color: '#06B6D4' },
  // AI
  { name: 'RAG / LLMs',                  icon: 'openai',      category: 'AI',          proficiency: 3, color: '#10A37F' },
  { name: 'Prompt Engineering',          icon: 'anthropic',   category: 'AI',          proficiency: 3, color: '#D97757' },
  { name: 'Computer Vision',             icon: 'mediapipe',   category: 'AI',          proficiency: 2, color: '#0097A7' },
  { name: 'Workflow Automation (n8n)',   icon: 'n8n',         category: 'AI',          proficiency: 2, color: '#EA4B71' },
  // Finance
  { name: 'Financial Statement Analysis', icon: 'chartdotjs', category: 'Finance',     proficiency: 3, color: '#10B981' },
  { name: 'Accounting',                  icon: 'accounting',  category: 'Finance',     proficiency: 2, color: '#3B82F6' },
]
