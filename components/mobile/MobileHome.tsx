'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import MobileStatusBar from './MobileStatusBar'
import MobileAppIcon from './MobileAppIcon'
import MobileNowWidget from './MobileNowWidget'
import { APPS, type AppId } from './mobileApps'
import { mobileTheme as t } from './mobileTheme'

const PAGES = [0, 1] as const
const SWIPE_DIST_FRAC = 0.22  // 22% of viewport triggers a snap
const SWIPE_VELOCITY  = 320

type Props = {
  onOpenApp?: (id: AppId) => void
  onSearchTap?: () => void
}

export default function MobileHome({ onOpenApp, onSearchTap }: Props) {
  const [page, setPage] = useState<0 | 1>(0)
  // Seed with the actual viewport width on first render so the swipe grid
  // (which is sized off pageWidth) doesn't paint at width: 0 — apps were
  // briefly invisible until the resize useEffect could fill this in.
  const [pageWidth, setPageWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0,
  )
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const update = () => setPageWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Keep x aligned with current page if width changes
  useEffect(() => {
    x.set(-page * pageWidth)
  }, [page, pageWidth, x])

  function snapTo(target: 0 | 1) {
    setPage(target)
    animate(x, -target * pageWidth, { type: 'spring', stiffness: 320, damping: 32 })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed', inset: 0,
        overflow: 'hidden',
        fontFamily: t.fontUi,
      }}
    >
      {/* Wallpaper — right portion of the desktop wallpaper */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wallpaper.jpg" alt=""
        draggable={false}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: '78% center',
          pointerEvents: 'none', userSelect: 'none',
        }}
      />

      {/* Atmosphere overlay for legibility */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,12,40,0.30) 0%, rgba(0,15,50,0.10) 35%, rgba(0,12,45,0.45) 100%)',
        }}
      />

      <MobileStatusBar tone="light" />

      {/* AI search widget */}
      <motion.button
        onClick={onSearchTap}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top, 0px) + 56px)',
          left: 16, right: 16,
          zIndex: 4,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px',
          borderRadius: t.radiusPill,
          background: 'rgba(10, 25, 60, 0.55)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: `1px solid ${t.borderStrong}`,
          boxShadow: '0 6px 22px rgba(0,15,55,0.35)',
          color: 'rgba(220,232,255,0.88)',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: t.fontUi,
          textAlign: 'left',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="5" stroke="rgba(220,232,255,0.85)" strokeWidth="1.6" fill="none" />
          <path d="M11 11l3.5 3.5" stroke="rgba(220,232,255,0.85)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1, letterSpacing: 0.2 }}>Ask about Hryday</span>
        <span
          style={{
            fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase',
            padding: '2px 7px', borderRadius: 6,
            background: t.accentBg, color: t.accent,
            border: `1px solid ${t.accentBorder}`, fontWeight: 700,
          }}
        >
          AI
        </span>
      </motion.button>

      {/* "Now" status widget — rotates through siteConfig.currently */}
      <MobileNowWidget />

      {/* Two-page swipeable app grid */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top:    'calc(env(safe-area-inset-top, 0px) + 250px)',
          bottom: `calc(env(safe-area-inset-bottom, 0px) + ${t.navHeight + 38}px)`,
          left: 0, right: 0,
          overflow: 'hidden',
          touchAction: 'pan-y',
        }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -pageWidth, right: 0 }}
          dragElastic={0.18}
          style={{
            x,
            display: 'flex',
            width: pageWidth * 2,
            height: '100%',
          }}
          onDragEnd={(_, info) => {
            const dx = info.offset.x
            const vx = info.velocity.x
            if (page === 0 && (dx < -pageWidth * SWIPE_DIST_FRAC || vx < -SWIPE_VELOCITY)) {
              snapTo(1)
            } else if (page === 1 && (dx > pageWidth * SWIPE_DIST_FRAC || vx > SWIPE_VELOCITY)) {
              snapTo(0)
            } else {
              snapTo(page)
            }
          }}
        >
          {PAGES.map(p => (
            <AppGridPage
              key={p}
              apps={APPS.filter(a => a.page === p)}
              width={pageWidth}
              onOpenApp={onOpenApp}
            />
          ))}
        </motion.div>
      </div>

      {/* Page label */}
      <div
        style={{
          position: 'absolute',
          bottom: `calc(env(safe-area-inset-bottom, 0px) + ${t.navHeight + 28}px)`,
          left: 0, right: 0,
          textAlign: 'center',
          zIndex: 3,
          fontFamily: "'Space Mono', ui-monospace, monospace",
          fontSize: 9.5, fontWeight: 700,
          letterSpacing: 1.8, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.78)',
          textShadow: '0 1px 4px rgba(0,15,55,0.7)',
          transition: 'opacity 0.22s ease',
          pointerEvents: 'none',
        }}
      >
        {page === 0 ? 'Portfolio' : 'Mobile Apps'}
      </div>

      {/* Page indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: `calc(env(safe-area-inset-bottom, 0px) + ${t.navHeight + 14}px)`,
          left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 6,
          zIndex: 3,
        }}
      >
        {PAGES.map(p => (
          <div key={p} style={dotStyle(page === p)} />
        ))}
      </div>
    </motion.div>
  )
}

function AppGridPage({
  apps, width, onOpenApp,
}: {
  apps: typeof APPS
  width: number
  onOpenApp?: (id: AppId) => void
}) {
  return (
    <div
      style={{
        width,
        flexShrink: 0,
        padding: '8px 18px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        rowGap: 22,
        columnGap: 6,
        alignContent: 'start',
      }}
    >
      {apps.map(app => (
        <MobileAppIcon key={app.id} app={app} onTap={() => onOpenApp?.(app.id)} />
      ))}
    </div>
  )
}

function dotStyle(active: boolean): React.CSSProperties {
  return {
    width: active ? 18 : 6,
    height: 6,
    borderRadius: 999,
    background: active ? '#fff' : 'rgba(255,255,255,0.45)',
    transition: 'width 0.22s ease, background 0.22s ease',
  }
}
