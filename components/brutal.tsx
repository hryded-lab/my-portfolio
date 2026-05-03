'use client'

import type { CSSProperties, ReactNode } from 'react'

// Shared "edited brutalism" primitives — used by mobile app interiors and the
// brutalized desktop windows. The aesthetic is a middle ground between a
// conventional dark UI and full brutalism: soft near-black ground, subtle
// 1.5px hairlines, smaller hard-offset shadows mixed with soft drop shadows,
// 8px corners, mono accent labels, restrained per-surface accent.

const FONT_MONO = "'Space Mono', ui-monospace, 'JetBrains Mono', 'IBM Plex Mono', monospace"
const FONT_DISPLAY = "'Archivo Black', 'DM Sans', 'Inter', system-ui, sans-serif"

export const brutalFonts = { mono: FONT_MONO, display: FONT_DISPLAY }

// Design tokens — exposed for ad-hoc inline use.
// Color tokens are CSS vars so they flip on `[data-theme="light|dark"]`
// (defined in globals.css). Components keep using `b.bg` / `b.text` etc.
// in inline styles — those resolve at render time via CSS variable lookup.
export const brutal = {
  bg:           'var(--brutal-bg)',
  bgDeep:       'var(--brutal-bg-deep)',
  surface:      'var(--brutal-surface)',
  surfaceSolid: 'var(--brutal-surface-solid)',
  surfaceRaised:'var(--brutal-surface-raised)',
  text:         'var(--brutal-text)',
  textDim:      'var(--brutal-text-dim)',
  textMute:     'var(--brutal-text-mute)',
  border:       'var(--brutal-border)',
  borderStrong: 'var(--brutal-border-strong)',
  radius:       8,
  radiusSm:     6,
  hardOffset:   3,
  // Compose hard offset + soft ambient, optionally tinted by accent.
  shadow: (accent?: string) =>
    accent
      ? `${3}px ${3}px 0 0 ${accent}, 0 1px 2px rgba(0,0,0,0.35), 0 6px 18px rgba(0,0,0,0.20)`
      : `0 1px 2px rgba(0,0,0,0.35), 0 6px 18px rgba(0,0,0,0.20)`,
} as const

export function BrutalCard({
  children,
  accent,
  shadow = true,
  padded = true,
  rotation = 0,
  style,
}: {
  children: ReactNode
  accent?: string
  shadow?: boolean
  padded?: boolean
  rotation?: number
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        background: brutal.surface,
        border: `1.5px solid ${brutal.border}`,
        borderRadius: brutal.radius,
        padding: padded ? 14 : 0,
        boxShadow: shadow ? brutal.shadow(accent) : 'none',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function BrutalTag({
  children,
  color = brutal.text,
  rotate = 0,
  filled = false,
  style,
}: {
  children: ReactNode
  color?: string
  rotate?: number
  filled?: boolean
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        padding: '3px 8px',
        border: `1.5px solid ${color}`,
        borderRadius: 4,
        background: filled ? color : 'transparent',
        color: filled ? brutal.bgDeep : color,
        display: 'inline-block',
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export function BrutalSection({
  title,
  color = brutal.text,
  count,
  children,
}: {
  title: string
  color?: string
  count?: number | string
  children: ReactNode
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 4, height: 16,
            background: color,
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.8,
            color: brutal.text,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h2>
        {count !== undefined && (
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10.5,
              color: brutal.textMute,
              letterSpacing: 0.4,
            }}
          >
            · {count}
          </span>
        )}
        <div style={{ flex: 1, height: 1, background: brutal.border }} />
      </div>
      {children}
    </div>
  )
}

export function BrutalHeader({
  title,
  subtitle,
  color,
}: {
  title: ReactNode
  subtitle?: ReactNode
  color: string
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      {subtitle && (
        <div style={{ marginBottom: 10 }}>
          <BrutalTag color={color}>{subtitle}</BrutalTag>
        </div>
      )}
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -1.2,
          color: brutal.text,
          margin: 0,
          fontFamily: FONT_DISPLAY,
          wordBreak: 'break-word',
        }}
      >
        {title}
      </h1>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 36, height: 4,
            background: color,
            borderRadius: 2,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, height: 1, background: brutal.border }} />
      </div>
    </div>
  )
}

// Common scroll body wrapper for brutalized desktop windows.
export function BrutalBody({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: `linear-gradient(180deg, ${brutal.bg} 0%, ${brutal.bgDeep} 100%)`,
        color: brutal.text,
        padding: '20px 22px 28px',
        fontFamily: "'Inter', system-ui, sans-serif",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
