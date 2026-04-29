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
  { name: 'Python',                      icon: 'python',      category: 'Programming', proficiency: 1, color: '#3776AB' },
  { name: 'JavaScript',                  icon: 'javascript',  category: 'Programming', proficiency: 1, color: '#F7DF1E' },
  { name: 'C',                           icon: 'c',           category: 'Programming', proficiency: 3, color: '#A8B9CC' },
  // Design
  { name: 'Figma',                       icon: 'figma',       category: 'Design',      proficiency: 2, color: '#F24E1E' },
  // AI
  { name: 'RAG / LLMs',                  icon: 'openai',      category: 'AI',          proficiency: 1, color: '#10A37F' },
  // Finance
  { name: 'Financial Statement Analysis', icon: 'chartdotjs', category: 'Finance',     proficiency: 3, color: '#10B981' },
  { name: 'Accounting',                  icon: 'accounting',  category: 'Finance',     proficiency: 2, color: '#3B82F6' },
]
