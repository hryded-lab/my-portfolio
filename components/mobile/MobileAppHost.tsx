'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import type { AppId } from './mobileApps'
import { mobileTheme as t } from './mobileTheme'

const AboutApp       = dynamic(() => import('./apps/AboutApp'),       { ssr: false })
const ExperienceApp  = dynamic(() => import('./apps/ExperienceApp'),  { ssr: false })
const ProjectsApp    = dynamic(() => import('./apps/ProjectsApp'),    { ssr: false })
const SkillsApp      = dynamic(() => import('./apps/SkillsApp'),      { ssr: false })
const ResumeApp      = dynamic(() => import('./apps/ResumeApp'),      { ssr: false })
const BlogApp        = dynamic(() => import('./apps/BlogApp'),        { ssr: false })
const ContactApp     = dynamic(() => import('./apps/ContactApp'),     { ssr: false })
const ClockApp       = dynamic(() => import('./apps/ClockApp'),       { ssr: false })
const NotesApp       = dynamic(() => import('./apps/NotesApp'),       { ssr: false })
const TerminalApp    = dynamic(() => import('./apps/TerminalApp'),    { ssr: false })
const BrowserApp     = dynamic(() => import('./apps/BrowserApp'),     { ssr: false })
const MediaApp       = dynamic(() => import('./apps/MediaApp'),       { ssr: false })
const PaintApp       = dynamic(() => import('./apps/PaintApp'),       { ssr: false })
const MinesweeperApp = dynamic(() => import('./apps/MinesweeperApp'), { ssr: false })
const MinecraftApp   = dynamic(() => import('./apps/MinecraftApp'),   { ssr: false })

function renderApp(id: AppId) {
  switch (id) {
    case 'about':       return <AboutApp />
    case 'experience':  return <ExperienceApp />
    case 'projects':    return <ProjectsApp />
    case 'skills':      return <SkillsApp />
    case 'resume':      return <ResumeApp />
    case 'blog':        return <BlogApp />
    case 'contact':     return <ContactApp />
    case 'clock':       return <ClockApp />
    case 'notes':       return <NotesApp />
    case 'terminal':    return <TerminalApp />
    case 'browser':     return <BrowserApp />
    case 'media':       return <MediaApp />
    case 'paint':       return <PaintApp />
    case 'minesweeper': return <MinesweeperApp />
    case 'minecraft':   return <MinecraftApp />
    case 'restart':     return null  // intercepted in MobileShell.openApp before reaching here
  }
}

type Props = {
  openApps: AppId[]
  activeApp: AppId | null
}

export default function MobileAppHost({ openApps, activeApp }: Props) {
  if (openApps.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        bottom: `calc(${t.navHeight}px + env(safe-area-inset-bottom, 0px))`,
        pointerEvents: 'none',
        zIndex: 60,
      }}
    >
      {openApps.map(id => {
        const isActive = id === activeApp
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.94, y: 14, filter: 'blur(8px)' }}
            animate={{
              opacity: isActive ? 1 : 0,
              scale:   isActive ? 1 : 0.96,
              y:       isActive ? 0 : 8,
              filter:  isActive ? 'blur(0px)' : 'blur(6px)',
            }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0,
              pointerEvents: isActive ? 'auto' : 'none',
              transformOrigin: 'center 65%',
              willChange: 'transform, opacity, filter',
            }}
          >
            {renderApp(id)}
          </motion.div>
        )
      })}
    </div>
  )
}
