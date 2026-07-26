'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Ambient life for the desktop. Pure CSS, no animation library, no image files,
// nothing over the network, matching the way the sound system synthesises rather
// than shipping audio. Honours prefers-reduced-motion.

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

// ── Cursor water droplets ─────────────────────────────────────────────────────
// Beads of water shed behind the pointer. Each is a real droplet: a refractive
// body, a bright specular dot, and a lower rim highlight. They swell, sag and
// evaporate.

type Droplet = { id: number; x: number; y: number; size: number; angle: number; stretch: number }

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
    if (dist < 34 || now - last.t < 45) return
    const dt = Math.max(now - last.t, 1)
    lastRef.current = { x: e.clientX, y: e.clientY, t: now }

    const speed = Math.min(dist / dt, 3)
    const id = idRef.current++
    setDrops(d => [...d.slice(-18), {
      id,
      x: e.clientX,
      y: e.clientY,
      size: 6 + Math.random() * 5,
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      stretch: 1 + speed * 0.06,
    }])
    setTimeout(() => setDrops(d => d.filter(x => x.id !== id)), 1500)
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
        // Two elements: the outer carries the orientation, the inner runs the
        // keyframe. On one element the animation's transform would replace the
        // rotation and stretch outright.
        <span
          key={d.id}
          style={{
            position: 'fixed',
            left: d.x, top: d.y,
            width: d.size, height: d.size,
            marginLeft: -d.size / 2, marginTop: -d.size / 2,
            transform: `rotate(${d.angle}deg) scaleX(${d.stretch})`,
            pointerEvents: 'none',
          }}
        >
        <span
          style={{
            display: 'block',
            width: '100%', height: '100%',
            // A soap bubble is mostly empty: a lens with a thin iridescent skin.
            // The magnification is what sells it, so the centre stays clear and
            // only the rim carries colour.
            backdropFilter: 'blur(0.4px) brightness(1.1) saturate(1.3)',
            WebkitBackdropFilter: 'blur(0.4px) brightness(1.1) saturate(1.3)',
            borderRadius: '50%',
            pointerEvents: 'none',
            background:
              // specular pinprick
              'radial-gradient(circle at 31% 27%,' +
              ' rgba(255,255,255,0.95) 0%,' +
              ' rgba(255,255,255,0.4) 5%,' +
              ' transparent 15%),' +
              // soft bounce light lower right
              'radial-gradient(circle at 70% 76%,' +
              ' rgba(255,255,255,0.42) 0%,' +
              ' transparent 22%),' +
              // iridescent skin, thin and only near the edge
              'radial-gradient(circle at 50% 50%,' +
              ' transparent 62%,' +
              ' rgba(180,255,244,0.30) 74%,' +
              ' rgba(196,222,255,0.42) 84%,' +
              ' rgba(255,206,246,0.34) 92%,' +
              ' rgba(255,255,255,0.55) 97%,' +
              ' transparent 100%)',
            boxShadow: '0 1px 3px rgba(20,70,115,0.16)',
            animation: 'ambientBubble 1.5s cubic-bezier(0.22, 0.8, 0.3, 1) forwards',
            willChange: 'transform, opacity',
          }}
        />
        {/* Burst ring, fires as the skin gives way rather than fading out */}
        <span
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(220,250,255,0.9)',
            opacity: 0,
            pointerEvents: 'none',
            animation: 'ambientBubblePop 0.34s ease-out 1.02s forwards',
            willChange: 'transform, opacity',
          }}
        />
        </span>
      ))}
    </>
  )
}

// ── Host ──────────────────────────────────────────────────────────────────────

export default function Ambient() {
  const reduced = usePrefersReducedMotion()
  return <DropletLayer reduced={reduced} />
}
