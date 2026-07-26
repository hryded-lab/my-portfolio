'use client'

import type { CSSProperties, ReactNode } from 'react'

// Frutiger Aero primitives — the shared language for window and mobile app
// interiors. The look is glossy gel and frosted glass over sky and water:
// specular highlight across the top half of a surface, a light bevel on the top
// edge and a dark one on the bottom, soft outer glow rather than hard offsets,
// generous radii, and humanist type. Deliberately the opposite of the near-black
// hairline-and-mono aesthetic it replaces.
//
// API mirrors components/brutal.tsx so windows can be migrated one at a time.

const FONT_UI = "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif"
const FONT_DISPLAY = "'DM Sans', 'Inter', system-ui, sans-serif"

export const aeroFonts = { ui: FONT_UI, display: FONT_DISPLAY }

export const aero = {
  sky1:     'var(--aero-sky-1)',
  sky2:     'var(--aero-sky-2)',
  glass:    'var(--aero-glass)',
  glassHi:  'var(--aero-glass-hi)',
  text:     'var(--aero-text)',
  textDim:  'var(--aero-text-dim)',
  textMute: 'var(--aero-text-mute)',
  edge:     'var(--aero-edge)',
  edgeHi:   'var(--aero-edge-hi)',
  bevelTop: 'var(--aero-bevel-top)',
  bevelBot: 'var(--aero-bevel-bot)',
  aqua:     'var(--aero-aqua)',
  leaf:     'var(--aero-leaf)',
  radius:   12,
  radiusSm: 8,

  // The core Aero move: a hard specular break at ~50%, so the surface reads as
  // wet plastic rather than a flat translucent panel.
  gloss:
    'linear-gradient(180deg,' +
    ' rgba(255,255,255,0.38) 0%,' +
    ' rgba(255,255,255,0.13) 49%,' +
    ' rgba(255,255,255,0.02) 50%,' +
    ' rgba(255,255,255,0.10) 100%)',

  bevel: (strong = false) =>
    `inset 0 1px 0 var(--aero-bevel-top), inset 0 -1px 0 var(--aero-bevel-bot)` +
    (strong ? ', inset 0 0 0 1px var(--aero-edge)' : ''),

  glow: (color?: string) =>
    color
      ? `0 2px 10px rgba(0,25,40,0.16), 0 0 22px -4px ${color}`
      : `0 2px 10px rgba(0,25,40,0.16), 0 8px 26px -10px rgba(0,40,60,0.30)`,
} as const

// ── Surfaces ──────────────────────────────────────────────────────────────────

export function AeroCard({
  children,
  accent,
  glow = true,
  padded = true,
  style,
}: {
  children: ReactNode
  accent?: string
  glow?: boolean
  padded?: boolean
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        position: 'relative',
        background: aero.glass,
        border: `1px solid ${aero.edge}`,
        borderRadius: aero.radius,
        padding: padded ? 16 : 0,
        boxShadow: `${aero.bevel()}${glow ? `, ${aero.glow(accent)}` : ''}`,
        backdropFilter: 'blur(14px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Specular sheen across the upper half */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: aero.gloss,
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }}
      />
      {accent && (
        <div
          aria-hidden
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
            background: `linear-gradient(180deg, ${accent}, transparent)`,
            pointerEvents: 'none',
          }}
        />
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

// Glossy lozenge. Replaces the hard-bordered uppercase mono chip.
export function AeroTag({
  children,
  color,
  filled = false,
  style,
}: {
  children: ReactNode
  color?: string
  filled?: boolean
  style?: CSSProperties
}) {
  const tint = color ?? aero.aqua
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: FONT_UI,
        fontSize: 11.5,
        fontWeight: 600,
        letterSpacing: 0.1,
        padding: '4px 11px',
        borderRadius: 999,
        border: `1px solid ${filled ? 'transparent' : aero.edge}`,
        background: filled
          ? `linear-gradient(180deg, ${tint} 0%, ${tint} 48%, color-mix(in srgb, ${tint} 78%, #000) 50%, ${tint} 100%)`
          : aero.glass,
        color: filled ? '#fff' : aero.text,
        boxShadow: filled
          ? `inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 3px rgba(0,30,45,0.25)`
          : aero.bevel(),
        textShadow: filled ? '0 1px 1px rgba(0,30,45,0.35)' : 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0))',
          borderRadius: '999px 999px 0 0',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  )
}

export function AeroSection({
  title,
  color,
  count,
  children,
}: {
  title: string
  color?: string
  count?: number | string
  children: ReactNode
}) {
  const tint = color ?? aero.aqua
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span
          aria-hidden
          style={{
            width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
            background: `radial-gradient(circle at 35% 30%, #fff 0%, ${tint} 55%, color-mix(in srgb, ${tint} 60%, #000) 100%)`,
            boxShadow: `0 0 10px -1px ${tint}`,
          }}
        />
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_DISPLAY,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 0.1,
            color: aero.text,
          }}
        >
          {title}
        </h2>
        {count !== undefined && (
          <span style={{ fontFamily: FONT_UI, fontSize: 12, color: aero.textMute }}>{count}</span>
        )}
        <div
          style={{
            flex: 1, height: 1,
            background: `linear-gradient(90deg, ${aero.edge}, transparent)`,
          }}
        />
      </div>
      {children}
    </div>
  )
}

export function AeroHeader({
  title,
  subtitle,
  color,
}: {
  title: ReactNode
  subtitle?: ReactNode
  color?: string
}) {
  const tint = color ?? aero.aqua
  return (
    <div style={{ marginBottom: 26 }}>
      {subtitle && (
        <div style={{ marginBottom: 12 }}>
          <AeroTag color={tint}>{subtitle}</AeroTag>
        </div>
      )}
      <h1
        style={{
          margin: 0,
          fontFamily: FONT_DISPLAY,
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: -0.8,
          color: aero.text,
          overflowWrap: 'break-word',
          textShadow: '0 1px 0 rgba(255,255,255,0.28)',
        }}
      >
        {title}
      </h1>
      <div
        aria-hidden
        style={{
          marginTop: 14, height: 3, borderRadius: 999,
          background: `linear-gradient(90deg, ${tint}, color-mix(in srgb, ${tint} 35%, transparent) 45%, transparent)`,
          boxShadow: `0 0 12px -2px ${tint}`,
        }}
      />
    </div>
  )
}

// Liquid-fill meter. Replaces the flat segmented "3/5" progress bar.
export function AeroMeter({
  value,
  max = 5,
  color,
  label,
}: {
  value: number
  max?: number
  color?: string
  label?: string
}) {
  const tint = color ?? aero.aqua
  const pct = Math.max(0, Math.min(1, value / max)) * 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          position: 'relative',
          flex: 1,
          height: 10,
          borderRadius: 999,
          background: aero.glass,
          boxShadow: `inset 0 1px 3px var(--aero-bevel-bot), inset 0 -1px 0 var(--aero-bevel-top)`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0, width: `${pct}%`,
            borderRadius: 999,
            background: `linear-gradient(180deg,
              color-mix(in srgb, ${tint} 85%, #fff) 0%,
              ${tint} 48%,
              color-mix(in srgb, ${tint} 72%, #000) 50%,
              ${tint} 100%)`,
            boxShadow: `0 0 10px -2px ${tint}`,
            transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
      {label && (
        <span style={{ fontFamily: FONT_UI, fontSize: 11.5, color: aero.textMute, flexShrink: 0 }}>
          {label}
        </span>
      )}
    </div>
  )
}

// Gel tab strip. Replaces the row of outlined pill filters.
export function AeroTabs({
  tabs,
  active,
  onChange,
  color,
}: {
  tabs: string[]
  active: string
  onChange: (t: string) => void
  color?: string
}) {
  const tint = color ?? aero.aqua
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex', flexWrap: 'wrap', gap: 3, padding: 3,
        borderRadius: 999,
        background: aero.glass,
        border: `1px solid ${aero.edge}`,
        boxShadow: `inset 0 1px 3px var(--aero-bevel-bot)`,
        marginBottom: 18,
      }}
    >
      {tabs.map(tab => {
        const on = tab === active
        return (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(tab)}
            style={{
              position: 'relative',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 999,
              padding: '6px 14px',
              fontFamily: FONT_UI,
              fontSize: 12.5,
              fontWeight: on ? 600 : 500,
              color: on ? '#fff' : aero.textDim,
              background: on
                ? `linear-gradient(180deg,
                    color-mix(in srgb, ${tint} 88%, #fff) 0%,
                    ${tint} 48%,
                    color-mix(in srgb, ${tint} 74%, #000) 50%,
                    ${tint} 100%)`
                : 'transparent',
              boxShadow: on
                ? `inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 4px rgba(0,30,45,0.28)`
                : 'none',
              textShadow: on ? '0 1px 1px rgba(0,30,45,0.35)' : 'none',
              transition: 'color 0.18s ease, background 0.18s ease',
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

// Scroll body for Aero window interiors — sky gradient instead of near-black.
export function AeroBody({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: `linear-gradient(180deg, ${aero.sky1} 0%, ${aero.sky2} 100%)`,
        color: aero.text,
        padding: '22px 24px 30px',
        fontFamily: FONT_UI,
        fontSize: 14,
        lineHeight: 1.6,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
