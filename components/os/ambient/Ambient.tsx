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

    // Faster movement throws smaller beads, stretched along the direction of
    // travel, the way water actually sheds off a moving surface.
    const speed = Math.min(dist / dt, 3)
    const id = idRef.current++
    setDrops(d => [...d.slice(-16), {
      id,
      x: e.clientX,
      y: e.clientY,
      size: 11 - speed * 2 + Math.random() * 5,
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      stretch: 1 + speed * 0.22,
    }])
    setTimeout(() => setDrops(d => d.filter(x => x.id !== id)), 1600)
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
            // Real water is a lens: it bends and brightens whatever is behind it.
            // Without this a droplet is just a blue circle, which is what the last
            // version was.
            backdropFilter: `blur(0.6px) brightness(1.18) contrast(1.12) saturate(1.25)`,
            WebkitBackdropFilter: `blur(0.6px) brightness(1.18) contrast(1.12) saturate(1.25)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            // Thin meniscus rim, brighter at the bottom where light collects.
            background:
              'radial-gradient(circle at 50% 118%,' +
              ' rgba(255,255,255,0.85) 0%,' +
              ' rgba(255,255,255,0.18) 22%,' +
              ' transparent 46%),' +
              'radial-gradient(circle at 36% 26%,' +
              ' rgba(255,255,255,0.92) 0%,' +
              ' rgba(255,255,255,0.28) 12%,' +
              ' transparent 34%),' +
              'radial-gradient(circle at 50% 50%,' +
              ' transparent 52%,' +
              ' rgba(150,205,240,0.20) 82%,' +
              ' rgba(70,140,195,0.32) 100%)',
            boxShadow:
              'inset 0 -1.5px 3px rgba(255,255,255,0.6),' +
              ' inset 0 1px 2px rgba(30,95,145,0.22),' +
              ' 0 2px 4px rgba(20,70,115,0.20)',
            animation: 'ambientDroplet 1.6s cubic-bezier(0.16, 0.9, 0.3, 1) forwards',
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
