'use client'

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import { WindowManagerProvider } from '@/lib/windowManager'
import { AssistantProvider } from '@/lib/assistantContext'
import { ThemeProvider } from '@/lib/themeContext'
import Desktop from '@/components/os/Desktop'
import Taskbar from '@/components/os/Taskbar'
import Window from '@/components/os/Window'
import BootScreen from '@/components/os/BootScreen'
import BiosScreen from '@/components/os/BiosScreen'
import LockScreen from '@/components/os/LockScreen'
import MobilePortfolio from '@/components/mobile/MobilePortfolio'

const AboutWindow      = dynamic(() => import('@/components/os/windows/AboutWindow'),      { ssr: false })
const ProjectsWindow   = dynamic(() => import('@/components/os/windows/ProjectsWindow'),   { ssr: false })
const SkillsWindow     = dynamic(() => import('@/components/os/windows/SkillsWindow'),     { ssr: false })
const ExperienceWindow = dynamic(() => import('@/components/os/windows/ExperienceWindow'), { ssr: false })
const ContactWindow    = dynamic(() => import('@/components/os/windows/ContactWindow'),    { ssr: false })
const BlogWindow       = dynamic(() => import('@/components/os/windows/BlogWindow'),       { ssr: false })
const ResumeWindow     = dynamic(() => import('@/components/os/windows/ResumeWindow'),     { ssr: false })
const MinesweeperWindow = dynamic(() => import('@/components/os/windows/MinesweeperWindow'), { ssr: false })
const NotepadWindow    = dynamic(() => import('@/components/os/windows/NotepadWindow'),    { ssr: false })
const PaintWindow      = dynamic(() => import('@/components/os/windows/PaintWindow'),      { ssr: false })
const RecycleBinWindow = dynamic(() => import('@/components/os/windows/RecycleBinWindow'), { ssr: false })
const AssistantWindow  = dynamic(() => import('@/components/os/windows/AssistantWindow'),  { ssr: false })
const MediaPlayerWindow = dynamic(() => import('@/components/os/windows/MediaPlayerWindow'), { ssr: false })
const CmdPromptWindow  = dynamic(() => import('@/components/os/windows/CmdPromptWindow'),  { ssr: false })
const BrowserWindow    = dynamic(() => import('@/components/os/windows/BrowserWindow'),    { ssr: false })
const MinecraftWindow  = dynamic(() => import('@/components/os/windows/MinecraftWindow'),  { ssr: false })

type Phase = 'bios' | 'boot' | 'lock' | 'unlocking' | 'desktop'

const MOBILE_QUERY = '(max-width: 767px)'

function subscribeMobile(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia(MOBILE_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches
}

function getMobileServerSnapshot() {
  return false
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>('bios')
  const [bootFading, setBootFading] = useState(false)
  const [showBoot, setShowBoot] = useState(false)
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getMobileServerSnapshot)
  const bootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (bootTimerRef.current) clearTimeout(bootTimerRef.current) }, [])

  const handleBiosDone       = useCallback(() => { setShowBoot(true); setPhase('boot') }, [])
  const handleBootDone       = useCallback(() => {
    setBootFading(true)
    setPhase('lock')
    bootTimerRef.current = setTimeout(() => { setShowBoot(false); setBootFading(false) }, 600)
  }, [])
  const handleUnlock         = useCallback(() => setPhase('unlocking'), [])
  const handleUnlockComplete = useCallback(() => setPhase('desktop'), [])
  const handleShutdown       = useCallback(() => {
    sessionStorage.removeItem('xp-booted')
    setPhase('lock')
  }, [])

  // Desktop mounts as soon as lock screen appears so it's warm when unlock fires
  const mountDesktop = phase === 'lock' || phase === 'unlocking' || phase === 'desktop'
  const showLock     = phase === 'lock' || phase === 'unlocking'

  if (isMobile) return <MobilePortfolio />

  return (
    <>
      {phase === 'bios' && <BiosScreen onDone={handleBiosDone} />}
      {showBoot && <BootScreen onDone={handleBootDone} fading={bootFading} />}

      {/* Desktop — pre-mounted behind lock screen so unlock is instant */}
      {mountDesktop && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          // Invisible while lock is showing, no pointer events
          visibility: phase === 'lock' ? 'hidden' : 'visible',
          animation: phase === 'unlocking' ? 'desktopReveal 0.65s ease-out forwards' : 'none',
          willChange: phase === 'unlocking' ? 'transform, filter' : 'auto',
        }}>
          <ThemeProvider><AssistantProvider><WindowManagerProvider>
            <Desktop />
            <Window id="about"><AboutWindow /></Window>
            <Window id="projects"><ProjectsWindow /></Window>
            <Window id="skills"><SkillsWindow /></Window>
            <Window id="experience"><ExperienceWindow /></Window>
            <Window id="contact"><ContactWindow /></Window>
            <Window id="blog"><BlogWindow /></Window>
            <Window id="resume"><ResumeWindow /></Window>
            <Window id="minesweeper"><MinesweeperWindow /></Window>
            <Window id="notepad"><NotepadWindow /></Window>
            <Window id="paint"><PaintWindow /></Window>
            <Window id="recyclebin"><RecycleBinWindow /></Window>
            <Window id="assistant"><AssistantWindow /></Window>
            <Window id="mediaplayer"><MediaPlayerWindow /></Window>
            <Window id="cmdprompt"><CmdPromptWindow /></Window>
            <Window id="browser"><BrowserWindow /></Window>
            <Window id="minecraft"><MinecraftWindow /></Window>
            <Taskbar onShutdown={handleShutdown} />
          </WindowManagerProvider></AssistantProvider></ThemeProvider>
        </div>
      )}

      {/* Lock screen on top — slides up on unlock */}
      {showLock && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          willChange: phase === 'unlocking' ? 'transform' : 'auto',
        }}>
          <LockScreen
            onUnlock={handleUnlock}
            isUnlocking={phase === 'unlocking'}
            onUnlockComplete={handleUnlockComplete}
            onShutdown={() => window.location.reload()}
          />
        </div>
      )}
    </>
  )
}
