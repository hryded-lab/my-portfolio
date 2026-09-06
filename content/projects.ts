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
    description: 'A startup platform that helps new founders find and apply for non-dilutive grants. Won ₹5 Lakhs at NoDevBuild.',
    longDescription:
      'Startup grants in India are scattered across dozens of government and private portals, and most founders never find the ones they qualify for. Kapital Grants puts them in one place: founders can search opportunities, track deadlines, and get walked through the application. We took 1st place at NoDevBuild and are building out the MVP against a curated grant database.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Figma'],
    category: 'Web App',
    image: '/projects/kapital-grants.jpg',
    gradient: 'from-emerald-600/20 via-teal-500/10 to-transparent',
    featured: true,
    year: 2026,
  },
  {
    id: 'darkroom',
    title: 'Darkroom',
    description: 'A real-time ASCII camera that runs entirely in the browser, with hand gestures as the control surface.',
    longDescription:
      'Darkroom turns a live camera feed into ASCII art in the browser, on desktop and phone. It ships ten render modes including Matrix, Braille, Contour, Thermal and Amber CRT, and does per-frame auto-levels so the output stays readable in bad lighting. MediaPipe hand tracking lets you frame a region in the air and apply a filter only inside it, and portal mode composites ASCII over video or video inside ASCII. Captures export to PNG, plain text or WebM. There is no backend, so the camera feed never leaves the device.',
    tech: ['React', 'TypeScript', 'Vite', 'MediaPipe', 'Zustand', 'Tailwind CSS'],
    category: 'Tool',
    image: '/projects/darkroom.jpg',
    gradient: 'from-amber-600/20 via-orange-500/10 to-transparent',
    github: 'https://github.com/hryded-lab/ascii-darkcam',
    live: 'https://ascii-darkcam.vercel.app',
    featured: true,
    year: 2026,
  },
  {
    id: 'compass',
    title: 'Compass',
    description: 'A personal command centre for college, with an AI agent that reads across every tracker and messages me on Telegram.',
    longDescription:
      'Compass is a PWA I built to keep academics, fitness, nutrition, startup work, skills and habits in one place instead of six apps. An agent called Ferrum sits on top of the data, takes plain language input for logging and questions, and pushes nudges to Telegram through the day. The review page does a weekly synthesis and charts six to twelve months so I can see what actually moved. Gemini handles the reasoning with Groq Llama 3.3 70B as fallback, and Vercel Cron drives the scheduled jobs.',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Gemini', 'Groq', 'Framer Motion'],
    category: 'Web App',
    image: '/projects/compass.jpg',
    gradient: 'from-sky-600/20 via-cyan-500/10 to-transparent',
    github: 'https://github.com/hryded-lab/compass',
    live: 'https://compass-hryday.vercel.app',
    featured: true,
    year: 2026,
  },
  {
    id: 'dayforge',
    title: 'Dayforge',
    description: 'Drop tasks by voice into Telegram all day, get a time-blocked schedule back at midnight.',
    longDescription:
      'Dayforge removes the part of planning I never do, which is sitting down to plan. Tasks go into a Telegram bot as voice notes or text whenever they come up, and Whisper transcribes them locally so nothing goes to a cloud speech service. At 23:59 an n8n workflow hands the pile to Gemini, which returns a time-blocked schedule for tomorrow and resets the list. The whole thing runs in Docker on free tiers.',
    tech: ['n8n', 'Whisper', 'Gemini', 'Telegram Bot API', 'Docker'],
    category: 'Tool',
    image: '/projects/dayforge.jpg',
    gradient: 'from-slate-500/20 via-zinc-400/10 to-transparent',
    github: 'https://github.com/hryded-lab/dayforge',
    featured: false,
    year: 2026,
  },
  {
    id: 'lawsaathi',
    title: 'LawSaathi',
    description: 'An Indian legal rights assistant built as a Claude Skill, covering eight areas of law in plain language.',
    longDescription:
      'Most people in India do not know what their rights are when they get pulled over, evicted, or scammed, and legal sites are written for lawyers. LawSaathi takes a description of the situation and returns the relevant law, what the person is entitled to, the fine that applies in their state, and what to do next. It covers traffic, police and arrest rights, tenancy, consumer protection, workplace issues, cybercrime, domestic violence and general rights, with state-specific figures for over 18 states and union territories and IPC sections mapped to their BNS equivalents. I ran it against 100 real scenarios and 86 were answered directly from the reference material.',
    tech: ['Claude Skills', 'Prompt Engineering', 'Legal Research'],
    category: 'Tool',
    image: '/projects/lawsaathi.jpg',
    gradient: 'from-lime-600/20 via-green-500/10 to-transparent',
    github: 'https://github.com/hryded-lab/LawSaathi',
    featured: false,
    year: 2026,
  },
  {
    id: 'smallsteps',
    title: 'SmallSteps',
    description: 'An AI screening tool that uses questionnaires and a RAG model to flag early signs of ADHD and Autism in children.',
    longDescription:
      'SmallSteps tracks child development through structured questionnaires and runs the answers against a RAG model built on WHO published material, so parents get an early read on possible signs of ADHD and Autism rather than waiting for a school to notice. It is meant as a prompt to see a professional, not a diagnosis. Still in active development.',
    tech: ['Python', 'FastAPI', 'RAG', 'ChromaDB', 'React', 'Next.js'],
    category: 'Web App',
    image: '/projects/smallsteps.jpg',
    gradient: 'from-blue-600/20 via-indigo-500/10 to-transparent',
    github: 'https://github.com/hryded-lab/smallsteps',
    featured: true,
    year: 2026,
  },
  {
    id: 'swasthseva',
    title: 'SwasthSeva',
    description: 'A peer support forum for Indians living with chronic illness, along the lines of PatientsLikeMe.',
    longDescription:
      'SwasthSeva is a community platform where people managing chronic conditions can compare notes, find others with the same diagnosis, and learn what actually worked for them. PatientsLikeMe does this well in the US and nothing equivalent exists for Indian patients. The build is finished and waiting on a moderation setup before it goes live, since health advice from strangers needs a check.',
    tech: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    category: 'Web App',
    image: '/projects/swasthseva.jpg',
    gradient: 'from-rose-600/20 via-pink-500/10 to-transparent',
    featured: false,
    year: 2025,
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description: 'A Windows XP desktop that runs in the browser, with a boot sequence, draggable windows and a Clippy-style assistant.',
    longDescription:
      'Part portfolio, part excuse to find out how far I could get building with AI instead of writing every line myself. It boots, locks, and runs draggable resizable windows, a working command prompt with easter eggs, and an assistant powered by Groq that answers questions about me from a single generated profile. Mobile gets a separate phone OS rather than a squashed desktop. Built on Next.js 15, TypeScript, Tailwind CSS v4 and Framer Motion, deployed on Vercel.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'MDX'],
    category: 'Web App',
    image: '/projects/portfolio.jpg',
    gradient: 'from-violet-600/20 via-purple-500/10 to-transparent',
    github: 'https://github.com/hryded-lab/my-portfolio',
    live: 'https://hrydaylath.vercel.app',
    featured: false,
    year: 2026,
  },
]
