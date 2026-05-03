'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import MobileBoot from './MobileBoot'
import MobileLock from './MobileLock'
import MobileHome from './MobileHome'
import MobileNavBar from './MobileNavBar'
import MobileAppHost from './MobileAppHost'
import MobileRecents from './MobileRecents'
import MobileAssistantSheet from './MobileAssistantSheet'
import type { AppId } from './mobileApps'
import { mobileTheme as t } from './mobileTheme'

type Phase = 'boot' | 'lock' | 'home'

export default function MobileShell() {
  const [phase, setPhase]                 = useState<Phase>('boot')
  const [openApps, setOpenApps]           = useState<AppId[]>([])
  const [activeApp, setActiveApp]         = useState<AppId | null>(null)
  const [showRecents, setShowRecents]     = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)

  const handleBootDone  = useCallback(() => setPhase('lock'), [])
  const handleUnlock    = useCallback(() => setPhase('home'), [])

  const openApp = useCallback((id: AppId) => {
    if (id === 'restart') {
      if (typeof window !== 'undefined') window.location.reload()
      return
    }
    setShowRecents(false)
    setShowAssistant(false)
    setOpenApps(prev => (prev.includes(id) ? [...prev.filter(x => x !== id), id] : [...prev, id]))
    setActiveApp(id)
  }, [])

  const goHome = useCallback(() => {
    setShowRecents(false)
    setShowAssistant(false)
    setActiveApp(null)
  }, [])

  const goBack = useCallback(() => {
    if (showAssistant)        setShowAssistant(false)
    else if (showRecents)     setShowRecents(false)
    else if (activeApp)       setActiveApp(null)
  }, [activeApp, showRecents, showAssistant])

  const openRecents = useCallback(() => {
    setActiveApp(null)
    setShowAssistant(false)
    setShowRecents(true)
  }, [])

  const closeAppFromRecents = useCallback((id: AppId) => {
    setOpenApps(prev => prev.filter(x => x !== id))
    setActiveApp(prev => (prev === id ? null : prev))
  }, [])

  const resumeFromRecents = useCallback((id: AppId) => {
    setShowRecents(false)
    setOpenApps(prev => (prev.includes(id) ? [...prev.filter(x => x !== id), id] : [...prev, id]))
    setActiveApp(id)
  }, [])

  const clearAllRecents = useCallback(() => {
    setOpenApps([])
    setActiveApp(null)
  }, [])

  const showNavBar = phase === 'home'
  const canGoBack  = activeApp !== null || showRecents || showAssistant

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: t.bg,
        overflow: 'hidden',
        fontFamily: t.fontUi,
        color: t.text,
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'boot' && <MobileBoot key="boot" onDone={handleBootDone} />}
        {phase === 'lock' && <MobileLock key="lock" onUnlock={handleUnlock} />}
        {phase === 'home' && <MobileHome key="home" onOpenApp={openApp} onSearchTap={() => setShowAssistant(true)} />}
      </AnimatePresence>

      {/* Open apps live above the home — state preserved when hidden */}
      {phase === 'home' && (
        <MobileAppHost openApps={openApps} activeApp={activeApp} />
      )}

      {/* Recents card stack */}
      <AnimatePresence>
        {phase === 'home' && showRecents && (
          <MobileRecents
            key="recents"
            openApps={openApps}
            onClose={closeAppFromRecents}
            onResume={resumeFromRecents}
            onDismiss={() => setShowRecents(false)}
            onClearAll={clearAllRecents}
          />
        )}
      </AnimatePresence>

      {/* Assistant chat sheet */}
      <AnimatePresence>
        {phase === 'home' && showAssistant && (
          <MobileAssistantSheet key="assistant" onClose={() => setShowAssistant(false)} />
        )}
      </AnimatePresence>

      {showNavBar && (
        <MobileNavBar
          onBack={goBack}
          onHome={goHome}
          onRecents={openRecents}
          canGoBack={canGoBack}
        />
      )}
    </div>
  )
}
