'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Ambient life for the desktop. Everything here is hand-drawn inline SVG with CSS
// keyframes: no animation library, no image files, nothing over the network. The
// same choice the sound system makes by synthesising rather than shipping audio.
//
// All three respect prefers-reduced-motion.

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

// ── Paper aeroplane ───────────────────────────────────────────────────────────
// Folded paper, so it is drawn as flat planes with slightly different tints
// rather than a shaded 3D object. Crosses the sky on a long lazy arc.

function PaperPlane() {
  return (
    <svg width="54" height="30" viewBox="0 0 54 30" fill="none" aria-hidden>
      <defs>
        <linearGradient id="pp-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbe9f6" />
        </linearGradient>
        <linearGradient id="pp-under" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c3d8ea" />
          <stop offset="100%" stopColor="#9db8d0" />
        </linearGradient>
      </defs>
      {/* far wing, folded down */}
      <path d="M2 13 L50 3 L26 17 Z" fill="url(#pp-under)" />
      {/* body */}
      <path d="M26 17 L50 3 L31 27 Z" fill="url(#pp-top)" />
      {/* near wing */}
      <path d="M26 17 L31 27 L21 22 Z" fill="#eef5fc" />
      {/* crease */}
      <path d="M50 3 L26 17" stroke="#b6cee2" strokeWidth="0.7" />
    </svg>
  )
}

function PlaneLayer({ reduced }: { reduced: boolean }) {
  const [flightKey, setFlightKey] = useState(0)
  const [lane, setLane] = useState(0.22)

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    const schedule = () => {
      // Long gaps so it stays a surprise rather than decoration.
      const wait = 45000 + Math.random() * 75000
      const id = setTimeout(() => {
        if (cancelled) return
        setLane(0.12 + Math.random() * 0.3)
        setFlightKey(k => k + 1)
        schedule()
      }, wait)
      return id
    }
    const first = setTimeout(() => { setFlightKey(k => k + 1); schedule() }, 9000)
    return () => { cancelled = true; clearTimeout(first) }
  }, [reduced])

  if (reduced || flightKey === 0) return null

  return (
    <div
      key={flightKey}
      style={{
        position: 'absolute',
        top: `${lane * 100}%`,
        left: 0,
        animation: 'ambientPlaneCross 26s linear forwards',
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      <div style={{ animation: 'ambientPlaneBob 5.5s ease-in-out infinite' }}>
        <PaperPlane />
      </div>
    </div>
  )
}

// ── Dragonfly ─────────────────────────────────────────────────────────────────
// Iridescent body, four translucent wings beating out of phase. Drifts in, hovers
// with small corrections the way a real one does, then leaves.

function Dragonfly() {
  return (
    <svg width="46" height="30" viewBox="0 0 46 30" fill="none" aria-hidden>
      <defs>
        <linearGradient id="df-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7ce8d0" />
          <stop offset="45%" stopColor="#3fb9c9" />
          <stop offset="100%" stopColor="#1d6f96" />
        </linearGradient>
        <linearGradient id="df-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="55%" stopColor="#bfefff" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#8fd4f2" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {/* wings, upper pair and lower pair beating out of phase */}
      <g style={{ transformOrigin: '20px 12px', animation: 'ambientWingUpper 0.13s ease-in-out infinite' }}>
        <ellipse cx="30" cy="8" rx="12" ry="3.1" fill="url(#df-wing)" stroke="#a9e2f7" strokeWidth="0.35" transform="rotate(-11 30 8)" />
        <ellipse cx="10" cy="8" rx="10" ry="2.8" fill="url(#df-wing)" stroke="#a9e2f7" strokeWidth="0.35" transform="rotate(11 10 8)" />
      </g>
      <g style={{ transformOrigin: '20px 15px', animation: 'ambientWingLower 0.13s ease-in-out infinite' }}>
        <ellipse cx="29" cy="17" rx="10.5" ry="2.7" fill="url(#df-wing)" stroke="#a9e2f7" strokeWidth="0.3" transform="rotate(9 29 17)" />
        <ellipse cx="11" cy="17" rx="9" ry="2.5" fill="url(#df-wing)" stroke="#a9e2f7" strokeWidth="0.3" transform="rotate(-9 11 17)" />
      </g>

      {/* abdomen tapering to the tail */}
      <path d="M21 12.4 C 27 12.1, 36 12.6, 43 13.4 C 36 14.4, 27 14.2, 21 13.8 Z" fill="url(#df-body)" />
      {/* thorax */}
      <ellipse cx="17.5" cy="13" rx="5" ry="3.4" fill="url(#df-body)" />
      {/* head and compound eyes */}
      <circle cx="11.6" cy="12.8" r="3.1" fill="#2f97b8" />
      <circle cx="10.2" cy="11.7" r="1.5" fill="#9ff0ff" opacity="0.9" />
      <circle cx="12.8" cy="11.6" r="1.3" fill="#9ff0ff" opacity="0.75" />
      {/* specular along the back */}
      <path d="M22 12.7 C 29 12.5, 36 12.9, 41 13.4" stroke="#dffbff" strokeWidth="0.55" opacity="0.65" />
    </svg>
  )
}

function DragonflyLayer({ reduced }: { reduced: boolean }) {
  const [visitKey, setVisitKey] = useState(0)
  const [pos, setPos] = useState({ x: 0.7, y: 0.55 })

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    const schedule = (delay: number) => {
      const id = setTimeout(() => {
        if (cancelled) return
        setPos({ x: 0.35 + Math.random() * 0.45, y: 0.35 + Math.random() * 0.35 })
        setVisitKey(k => k + 1)
        schedule(70000 + Math.random() * 90000)
      }, delay)
      return id
    }
    const first = schedule(22000)
    return () => { cancelled = true; clearTimeout(first) }
  }, [reduced])

  if (reduced || visitKey === 0) return null

  return (
    <div
      key={visitKey}
      style={{
        position: 'absolute',
        left: `${pos.x * 100}%`,
        top: `${pos.y * 100}%`,
        animation: 'ambientDragonflyVisit 17s ease-in-out forwards',
        willChange: 'transform, opacity',
        pointerEvents: 'none',
      }}
    >
      <div style={{ animation: 'ambientHover 2.3s ease-in-out infinite' }}>
        <Dragonfly />
      </div>
    </div>
  )
}

// ── Cursor water droplets ─────────────────────────────────────────────────────
// Beads of water shed behind the pointer. Each is a real droplet: a refractive
// body, a bright specular dot, and a lower rim highlight. They swell, sag and
// evaporate.

type Droplet = { id: number; x: number; y: number; size: number }

function DropletLayer({ reduced }: { reduced: boolean }) {
  const [drops, setDrops] = useState<Droplet[]>([])
  const lastRef = useRef({ x: 0, y: 0, t: 0 })
  const idRef = useRef(0)

  const onMove = useCallback((e: MouseEvent) => {
    const now = performance.now()
    const last = lastRef.current
    const dx = e.clientX - last.x
    const dy = e.clientY - last.y
    const dist = Math.hypot(dx, dy)

    // Shed a bead only after enough travel, so fast movement leaves a trail and
    // resting the pointer leaves nothing.
    if (dist < 42 || now - last.t < 55) return
    lastRef.current = { x: e.clientX, y: e.clientY, t: now }

    const id = idRef.current++
    const size = 7 + Math.random() * 7
    setDrops(d => [...d.slice(-14), { id, x: e.clientX, y: e.clientY, size }])
    setTimeout(() => setDrops(d => d.filter(x => x.id !== id)), 1400)
  }, [])

  useEffect(() => {
    if (reduced) return
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced, onMove])

  if (reduced) return null

  return (
    <>
      {drops.map(d => (
        <span
          key={d.id}
          style={{
            position: 'fixed',
            left: d.x, top: d.y,
            width: d.size, height: d.size,
            marginLeft: -d.size / 2, marginTop: -d.size / 2,
            borderRadius: '50%',
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 34% 28%,' +
              ' rgba(255,255,255,0.95) 0%,' +
              ' rgba(214,244,255,0.55) 26%,' +
              ' rgba(140,205,240,0.30) 58%,' +
              ' rgba(90,165,215,0.16) 100%)',
            boxShadow:
              'inset 0 -1px 2px rgba(255,255,255,0.75),' +
              ' inset 0 1px 2px rgba(40,110,160,0.30),' +
              ' 0 1px 3px rgba(30,90,140,0.22)',
            animation: 'ambientDroplet 1.4s ease-out forwards',
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  )
}

// ── Host ──────────────────────────────────────────────────────────────────────

export default function Ambient() {
  const reduced = usePrefersReducedMotion()

  return (
    <>
      {/* Sky layer sits behind windows but above the wallpaper */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <PlaneLayer reduced={reduced} />
        <DragonflyLayer reduced={reduced} />
      </div>
      <DropletLayer reduced={reduced} />
    </>
  )
}
