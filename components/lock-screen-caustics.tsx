'use client'

// Canvas 2D caustics — radial-gradient blobs moving in sinusoidal paths.
// Where blobs overlap they screen-composite into bright aqua highlights.

import { useEffect, useRef, useState } from 'react'

interface Blob {
  cx: number; cy: number  // base center [0-1]
  rx: number; ry: number  // travel radius [0-1]
  r:  number              // blob radius relative to min(w,h)
  px: number; py: number  // phase
  fx: number; fy: number  // frequency
}

const BLOBS: Blob[] = [
  { cx: 0.18, cy: 0.28, rx: 0.16, ry: 0.13, r: 0.28, px: 0.0, py: 0.9, fx: 0.27, fy: 0.21 },
  { cx: 0.72, cy: 0.22, rx: 0.13, ry: 0.19, r: 0.24, px: 1.1, py: 2.0, fx: 0.22, fy: 0.31 },
  { cx: 0.50, cy: 0.60, rx: 0.21, ry: 0.11, r: 0.30, px: 2.3, py: 0.4, fx: 0.31, fy: 0.19 },
  { cx: 0.28, cy: 0.78, rx: 0.11, ry: 0.16, r: 0.22, px: 0.8, py: 3.1, fx: 0.24, fy: 0.28 },
  { cx: 0.82, cy: 0.52, rx: 0.14, ry: 0.22, r: 0.26, px: 3.2, py: 1.5, fx: 0.29, fy: 0.23 },
  { cx: 0.12, cy: 0.58, rx: 0.19, ry: 0.13, r: 0.23, px: 1.7, py: 0.7, fx: 0.34, fy: 0.18 },
  { cx: 0.63, cy: 0.82, rx: 0.13, ry: 0.15, r: 0.27, px: 2.8, py: 2.2, fx: 0.20, fy: 0.26 },
  { cx: 0.44, cy: 0.14, rx: 0.17, ry: 0.17, r: 0.21, px: 0.4, py: 1.2, fx: 0.26, fy: 0.33 },
  { cx: 0.90, cy: 0.35, rx: 0.09, ry: 0.20, r: 0.19, px: 1.9, py: 0.3, fx: 0.32, fy: 0.22 },
]

function drawFrame(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  ctx.clearRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'screen'

  const minD = Math.min(w, h)

  for (const b of BLOBS) {
    const x = (b.cx + Math.sin(t * b.fx + b.px) * b.rx) * w
    const y = (b.cy + Math.cos(t * b.fy + b.py) * b.ry) * h
    const r = b.r * minD

    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0,    'rgba(120, 240, 220, 0.55)')
    g.addColorStop(0.35, 'rgba(70,  200, 180, 0.30)')
    g.addColorStop(0.7,  'rgba(35,  160, 145, 0.12)')
    g.addColorStop(1,    'rgba(0,   0,   0,   0)')

    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function StaticFallback() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, zIndex: 1,
        pointerEvents: 'none', opacity: 0.45,
        backgroundImage: [
          'radial-gradient(ellipse at 20% 30%, rgba(100,230,210,0.55) 0%, transparent 50%)',
          'radial-gradient(ellipse at 78% 60%, rgba(80,200,180,0.45) 0%, transparent 48%)',
          'radial-gradient(ellipse at 50% 85%, rgba(120,240,220,0.40) 0%, transparent 55%)',
        ].join(','),
      }}
    />
  )
}

export function LockScreenCaustics() {
  const [ready, setReady] = useState<'pending' | 'canvas' | 'static'>('pending')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Only skip for explicit reduced-motion preference.
    // Do NOT check hover/pointer — touch-enabled Windows laptops falsely match
    // (hover:none) and would silently get the static fallback instead.
    const skip = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(skip ? 'static' : 'canvas')
  }, [])

  useEffect(() => {
    if (ready !== 'canvas') return
    const canvas = canvasRef.current
    if (!canvas) return

    // Use window dimensions directly — more reliable than clientWidth for an
    // absolutely-positioned canvas whose CSS layout may not be resolved yet.
    function resize() {
      canvas!.width  = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 100) }
    window.addEventListener('resize', onResize)

    let rafId = 0
    let paused = false
    const t0 = performance.now()

    function loop() {
      if (!paused && canvas!.width > 0 && canvas!.height > 0) {
        const ctx = canvas!.getContext('2d')
        if (ctx) drawFrame(ctx, (performance.now() - t0) * 0.001, canvas!.width, canvas!.height)
      }
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    const onVis = () => { paused = document.hidden }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [ready])

  if (ready === 'pending') return null
  if (ready === 'static')  return <StaticFallback />

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.80,
      }}
    />
  )
}
