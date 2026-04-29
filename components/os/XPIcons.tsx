'use client'

import { useEffect, useRef } from 'react'

type IconProps = { size?: number }

// ── PNG icons (iOS style) ────────────────────────────────────────────────────

function PngIcon({ src, size = 32 }: IconProps & { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        display: 'block',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
        objectFit: 'cover',
      }}
    />
  )
}

export function IconUser({ size = 32 }: IconProps) {
  return <PngIcon src="/icons/contacts.png" size={size} />
}

export function IconEnvelope({ size = 32 }: IconProps) {
  return <PngIcon src="/icons/mail.png" size={size} />
}

export function IconNotepad({ size = 32 }: IconProps) {
  return <PngIcon src="/icons/notes.png" size={size} />
}

export function IconBlog({ size = 32 }: IconProps) {
  return <PngIcon src="/icons/newsstand.png" size={size} />
}

export function IconResume({ size = 32 }: IconProps) {
  return <PngIcon src="/icons/books.png" size={size} />
}

export function IconFolder({ size = 32 }: IconProps) {
  return <PngIcon src="/icons/photos.png" size={size} />
}

export function IconMusicPlayer({ size = 32 }: IconProps) {
  return <PngIcon src="/icons/apple_music.png" size={size} />
}

// ── Sprite-sheet icons (XP style) — kept as-is ──────────────────────────────

const COLS = 4
const ROWS = 6

function SpriteIcon({ size = 32, col, row }: IconProps & { col: number; row: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      const srcW = img.naturalWidth / COLS
      const srcH = img.naturalHeight / ROWS

      canvas.width = size
      canvas.height = size
      ctx.clearRect(0, 0, size, size)
      ctx.drawImage(img, col * srcW, row * srcH, srcW, srcH, 0, 0, size, size)

      const imageData = ctx.getImageData(0, 0, size, size)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2]
        const whiteness = Math.min(r, g, b)
        if (whiteness > 248) {
          d[i + 3] = Math.round(Math.max(0, (255 - whiteness) / (255 - 248)) * 255)
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }
    img.src = '/icons-sheet.jpg'
  }, [size, col, row])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        flexShrink: 0,
        display: 'block',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
      }}
    />
  )
}

export function IconMyComputer({ size = 32 }: IconProps) {
  return <SpriteIcon size={size} col={1} row={0} />
}

export function IconLaptop({ size = 32 }: IconProps) {
  return <SpriteIcon size={size} col={2} row={1} />
}

export function IconRecycleBin({ size = 32 }: IconProps) {
  return <SpriteIcon size={size} col={3} row={3} />
}

export function IconLaptopSkills({ size = 32 }: IconProps) {
  return <SpriteIcon size={size} col={2} row={4} />
}

export function IconPaint({ size = 32 }: IconProps) {
  return <SpriteIcon size={size} col={2} row={4} />
}

export function IconMine({ size = 32 }: IconProps) {
  return <SpriteIcon size={size} col={0} row={5} />
}

export function IconGradCap({ size = 32 }: IconProps) {
  return <SpriteIcon size={size} col={2} row={5} />
}

export function IconDocument({ size = 32 }: IconProps) {
  return <SpriteIcon size={size} col={3} row={5} />
}

export function IconIE({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}>
      {/* Globe body */}
      <circle cx="20" cy="20" r="17" fill="url(#ieGlobe)"/>
      <circle cx="20" cy="20" r="17" stroke="#1a5cb8" strokeWidth="1"/>
      {/* Latitude lines */}
      <ellipse cx="20" cy="20" rx="8" ry="17" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" fill="none"/>
      <line x1="3" y1="20" x2="37" y2="20" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8"/>
      <ellipse cx="20" cy="20" rx="17" ry="6" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none"/>
      {/* "e" letter */}
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold"
        fontFamily="Times New Roman, serif" style={{ letterSpacing: -1 }}>e</text>
      {/* Orbit ring */}
      <ellipse cx="20" cy="20" rx="19" ry="7" stroke="#f0a830" strokeWidth="2.5" fill="none"
        transform="rotate(-30 20 20)"/>
      <defs>
        <radialGradient id="ieGlobe" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#5baaf0"/>
          <stop offset="100%" stopColor="#1a4cb0"/>
        </radialGradient>
      </defs>
    </svg>
  )
}

export function IconMinecraft({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}>
      {/* Green face */}
      <rect x="1" y="1" width="38" height="38" rx="3" fill="#5d9e3f"/>
      <rect x="1" y="1" width="38" height="38" rx="3" fill="url(#mcNoise)" opacity="0.18"/>
      {/* Left eye */}
      <rect x="7"  y="11" width="10" height="10" fill="#1a1a1a"/>
      <rect x="9"  y="13" width="4"  height="4"  fill="#2a2a2a"/>
      {/* Right eye */}
      <rect x="23" y="11" width="10" height="10" fill="#1a1a1a"/>
      <rect x="25" y="13" width="4"  height="4"  fill="#2a2a2a"/>
      {/* Mouth — creeper frown */}
      <rect x="13" y="23" width="4"  height="4"  fill="#1a1a1a"/>
      <rect x="23" y="23" width="4"  height="4"  fill="#1a1a1a"/>
      <rect x="13" y="27" width="14" height="4"  fill="#1a1a1a"/>
      <rect x="9"  y="27" width="4"  height="8"  fill="#1a1a1a"/>
      <rect x="27" y="27" width="4"  height="8"  fill="#1a1a1a"/>
      <defs>
        <pattern id="mcNoise" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" fill="#000"/>
        </pattern>
      </defs>
    </svg>
  )
}

export function IconCmdPrompt({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}>
      {/* Window body */}
      <rect x="1" y="1" width="38" height="38" rx="3" fill="#0d0d0d"/>
      {/* Title bar */}
      <rect x="1" y="1" width="38" height="9" rx="3" fill="#000c7a"/>
      <rect x="1" y="7" width="38" height="3" fill="#000c7a"/>
      {/* Title bar label dots */}
      <rect x="4" y="4" width="8" height="1.5" rx="0.5" fill="white" opacity="0.75"/>
      {/* Close button area */}
      <rect x="34" y="3" width="4" height="4" rx="0.8" fill="#bb3333"/>
      {/* Prompt chevron — 3 rects forming ">" */}
      <rect x="5"  y="14" width="4" height="2" rx="0.5" fill="#00ff41" opacity="0.95"/>
      <rect x="8"  y="16" width="4" height="2" rx="0.5" fill="#00ff41" opacity="0.95"/>
      <rect x="5"  y="18" width="4" height="2" rx="0.5" fill="#00ff41" opacity="0.95"/>
      {/* Text line after prompt */}
      <rect x="15" y="15.5" width="18" height="1.5" rx="0.5" fill="#c0c0c0" opacity="0.55"/>
      {/* Second line */}
      <rect x="5"  y="23"  width="22" height="1.5" rx="0.5" fill="#c0c0c0" opacity="0.38"/>
      {/* Third line */}
      <rect x="5"  y="28"  width="14" height="1.5" rx="0.5" fill="#c0c0c0" opacity="0.25"/>
      {/* Cursor block */}
      <rect x="5"  y="33"  width="4"  height="5"   rx="0.5" fill="#c0c0c0" opacity="0.85"/>
    </svg>
  )
}
