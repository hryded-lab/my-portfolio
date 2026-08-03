'use client'

import { useEffect, useState, useCallback, useRef, useSyncExternalStore } from 'react'

// Ambient life for the phone. Same rule as the desktop: pure CSS, nothing over
// the network. Deliberately tied to moments rather than running constantly,
// because on a small screen anything moving while you read looks like a bug.

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  )
}

// ── Home screen bubbles ───────────────────────────────────────────────────────
// Sparse and slow: four at a time on a long drift, so the grid feels like it is
// sitting in the wallpaper rather than on top of it.

const BUBBLES = [
  { left: 12, size: 26, delay: 0,   duration: 21, drift: 14 },
  { left: 34, size: 16, delay: 5.5, duration: 26, drift: -10 },
  { left: 61, size: 32, delay: 2.5, duration: 24, drift: 8 },
  { left: 83, size: 20, delay: 8,   duration: 29, drift: -16 },
]

export function HomeBubbles() {
  const reduced = usePrefersReducedMotion()
  if (reduced) return null

  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    >
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${b.left}%`,
            bottom: -40,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            // Same construction as the desktop trail: clear centre, colour only
            // in the thin skin near the rim.
            background:
              'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.22) 6%, transparent 16%),' +
              'radial-gradient(circle at 50% 50%, transparent 62%, rgba(190,255,248,0.22) 76%, rgba(200,226,255,0.30) 88%, rgba(255,255,255,0.40) 97%, transparent 100%)',
            backdropFilter: 'blur(0.3px) brightness(1.06)',
            WebkitBackdropFilter: 'blur(0.3px) brightness(1.06)',
            animation: `mobileBubbleRise ${b.duration}s linear ${b.delay}s infinite`,
            // Custom property drives the horizontal wander inside the keyframe.
            ['--drift' as string]: `${b.drift}px`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}

// ── Unlock droplets ───────────────────────────────────────────────────────────
// The touch counterpart to the desktop cursor trail, but it fires only while the
// swipe-up gesture is in progress, so it reads as a reward rather than decoration.

type Drop = { id: number; x: number; y: number; size: number }

export function UnlockDroplets({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion()
  const [drops, setDrops] = useState<Drop[]>([])
  const lastRef = useRef({ y: 0, t: 0 })
  const idRef = useRef(0)

  const onMove = useCallback((e: TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    const now = performance.now()
    if (Math.abs(t.clientY - lastRef.current.y) < 26 || now - lastRef.current.t < 55) return
    lastRef.current = { y: t.clientY, t: now }

    const id = idRef.current++
    setDrops(d => [...d.slice(-10), {
      id, x: t.clientX, y: t.clientY, size: 7 + Math.random() * 5,
    }])
    setTimeout(() => setDrops(d => d.filter(x => x.id !== id)), 1200)
  }, [])

  useEffect(() => {
    if (reduced || !active) return
    window.addEventListener('touchmove', onMove, { passive: true })
    return () => window.removeEventListener('touchmove', onMove)
  }, [reduced, active, onMove])

  if (reduced || !active) return null

  return (
    <>
      {drops.map(d => (
        <span
          key={d.id}
          aria-hidden
          style={{
            position: 'fixed',
            left: d.x, top: d.y,
            width: d.size, height: d.size,
            marginLeft: -d.size / 2, marginTop: -d.size / 2,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 95,
            background:
              'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 8%, transparent 20%),' +
              'radial-gradient(circle at 50% 50%, transparent 58%, rgba(190,235,255,0.34) 82%, rgba(255,255,255,0.5) 97%, transparent 100%)',
            animation: 'mobileDropFade 1.2s ease-out forwards',
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  )
}

// ── Lock screen clock sheen ───────────────────────────────────────────────────
// A slow band of light crossing the clock every half minute, the way light moves
// over water. Almost subliminal by design.

export function ClockSheen({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion()

  if (reduced) return <>{children}</>

  // An overlay band rather than background-clip: text. Clipping to text needs a
  // transparent fill, which would drop the clock entirely if the animation or the
  // gradient ever failed to paint.
  return (
    <span style={{ position: 'relative', display: 'inline-block', isolation: 'isolate' }}>
      {children}
      <span
        aria-hidden
        style={{
          position: 'absolute', inset: '-10% -30%',
          pointerEvents: 'none',
          background:
            'linear-gradient(105deg,' +
            ' rgba(255,255,255,0) 42%,' +
            ' rgba(255,255,255,0.42) 49%,' +
            ' rgba(215,245,255,0.55) 52%,' +
            ' rgba(255,255,255,0) 59%)',
          mixBlendMode: 'screen',
          animation: 'mobileClockSheen 30s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </span>
  )
}
