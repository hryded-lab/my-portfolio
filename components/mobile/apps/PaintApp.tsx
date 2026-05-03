'use client'

import { useEffect, useRef, useState } from 'react'
import MobileAppShell from '../MobileAppShell'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#ff7ec5'

const PALETTE = [
  '#000000', '#ffffff',
  '#ff5e4e', '#ff7ec5', '#ffb83a', '#ffe14a',
  '#4ed670', '#4ee8e8', '#4ab8ff', '#5d8aff',
  '#b783ff', '#888888',
]

const BRUSH_SIZES = [2, 5, 10, 18]

type Tool = 'brush' | 'eraser'

export default function PaintApp() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const lastRef    = useRef<{ x: number; y: number } | null>(null)

  const [color, setColor] = useState('#000000')
  const [size, setSize]   = useState(5)
  const [tool, setTool]   = useState<Tool>('brush')

  // Resize canvas to wrapper while preserving an internal pixel buffer.
  // We re-snapshot the existing strokes onto the new buffer so resizing
  // (e.g. on layout shift) doesn't wipe the drawing.
  useEffect(() => {
    const wrap = wrapRef.current
    const cvs  = canvasRef.current
    if (!wrap || !cvs) return

    const snapshot = () => {
      const tmp = document.createElement('canvas')
      tmp.width  = cvs.width
      tmp.height = cvs.height
      const ctx2 = tmp.getContext('2d')
      if (ctx2) ctx2.drawImage(cvs, 0, 0)
      return tmp
    }

    const resize = () => {
      const r   = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w   = Math.max(1, Math.floor(r.width  * dpr))
      const h   = Math.max(1, Math.floor(r.height * dpr))
      if (cvs.width === w && cvs.height === h) return

      const prev = cvs.width > 0 && cvs.height > 0 ? snapshot() : null
      cvs.width  = w
      cvs.height = h
      cvs.style.width  = `${r.width}px`
      cvs.style.height = `${r.height}px`
      const ctx = cvs.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      if (prev) ctx.drawImage(prev, 0, 0, prev.width, prev.height, 0, 0, w, h)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cvs  = canvasRef.current!
    const rect = cvs.getBoundingClientRect()
    const sx   = cvs.width  / rect.width
    const sy   = cvs.height / rect.height
    return {
      x: (e.clientX - rect.left) * sx,
      y: (e.clientY - rect.top)  * sy,
    }
  }

  const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const cvs = canvasRef.current!
    const ctx = cvs.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth   = size * dpr
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const pos = getPos(e)
    drawingRef.current = true
    lastRef.current    = pos
    canvasRef.current?.setPointerCapture(e.pointerId)
    stroke(pos, pos)
  }

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const pos  = getPos(e)
    const last = lastRef.current ?? pos
    stroke(last, pos)
    lastRef.current = pos
  }

  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false
    lastRef.current    = null
    canvasRef.current?.releasePointerCapture(e.pointerId)
  }

  const clear = () => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, cvs.width, cvs.height)
  }

  const save = () => {
    const cvs = canvasRef.current
    if (!cvs) return
    const url  = cvs.toDataURL('image/png')
    const a    = document.createElement('a')
    a.href     = url
    a.download = `paint-${Date.now()}.png`
    a.click()
  }

  return (
    <MobileAppShell title="Paint" color={COLOR} subtitle={tool === 'brush' ? `Brush · ${size}px` : 'Eraser'}>
      {/* Canvas */}
      <div
        ref={wrapRef}
        style={{
          width: '100%',
          aspectRatio: '4 / 5',
          background: '#fff',
          border: `1.5px solid ${b.borderStrong}`,
          borderRadius: b.radius,
          boxShadow: b.shadow(COLOR),
          overflow: 'hidden',
          marginBottom: 14,
          touchAction: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onPointerCancel={onUp}
          style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair', touchAction: 'none' }}
        />
      </div>

      {/* Palette */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 6,
          marginBottom: 12,
        }}
      >
        {PALETTE.map(c => {
          const active = color === c && tool === 'brush'
          return (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('brush') }}
              aria-label={`Color ${c}`}
              style={{
                aspectRatio: '1 / 1',
                background: c,
                border: active ? `2.5px solid ${b.text}` : `1.5px solid ${b.border}`,
                borderRadius: b.radiusSm,
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                boxShadow: active ? b.shadow() : 'inset 0 0 0 1px rgba(0,0,0,0.06)',
              }}
            />
          )
        })}
      </div>

      {/* Brush size + tool toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {BRUSH_SIZES.map(s => {
          const active = size === s
          return (
            <button
              key={s}
              onClick={() => setSize(s)}
              style={{
                flex: 1,
                padding: '10px 0',
                background: active ? b.surfaceRaised : b.surface,
                color: b.text,
                border: `1.5px solid ${active ? COLOR : b.border}`,
                borderRadius: b.radiusSm,
                cursor: 'pointer',
                fontFamily: t.fontMono,
                fontSize: 11, fontWeight: 700,
                letterSpacing: 1.2,
                WebkitTapHighlightColor: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: s + 2, height: s + 2,
                  background: tool === 'eraser' ? '#888' : color,
                  borderRadius: 999,
                  border: tool === 'eraser' ? `1.5px dashed ${b.borderStrong}` : 'none',
                }}
              />
              {s}
            </button>
          )
        })}
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', gap: 6 }}>
        <ActionBtn label={tool === 'eraser' ? 'Brush' : 'Eraser'} onClick={() => setTool(t => t === 'eraser' ? 'brush' : 'eraser')} />
        <ActionBtn label="Clear" onClick={clear} />
        <ActionBtn label="Save ↓" onClick={save} primary />
      </div>
    </MobileAppShell>
  )
}

function ActionBtn({ label, onClick, primary }: { label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 8px',
        background: primary ? COLOR : b.surface,
        color: primary ? b.bgDeep : b.text,
        border: `1.5px solid ${primary ? COLOR : b.border}`,
        borderRadius: b.radiusSm,
        boxShadow: primary ? b.shadow() : 'none',
        cursor: 'pointer',
        fontFamily: 'Space Mono, ui-monospace, monospace',
        fontSize: 11, fontWeight: 700,
        letterSpacing: 1.4, textTransform: 'uppercase',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {label}
    </button>
  )
}
