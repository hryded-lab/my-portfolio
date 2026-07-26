'use client'

import type { CSSProperties, ReactNode } from 'react'

// Mobile counterpart to components/aeroApp.tsx: the same Vista-2023-meets-Aero
// language (silver bars, white panes, blue frosted slabs) sized for touch rather
// than a mouse. Shares the --aa-* tokens with the desktop so both follow one
// theme, but uses larger type, taller rows and 44px minimum targets.
//
// Deliberately API-compatible with the brutal kit it replaces, so app bodies
// swap over without being restructured.

export const FONT = "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif"

export const aeroFonts = { ui: FONT, display: FONT, mono: FONT }

export const aero = {
  bg:           'var(--aa-body)',
  bgDeep:       'var(--aa-pane)',
  surface:      'var(--aa-pane)',
  surfaceSolid: 'var(--aa-pane)',
  surfaceRaised: 'var(--aa-row-alt)',
  bar:          'var(--aa-bar)',
  text:         'var(--aa-text)',
  textDim:      'var(--aa-text-dim)',
  textMute:     'var(--aa-text-mute)',
  heading:      'var(--aa-heading)',
  border:       'var(--aa-border)',
  borderStrong: 'var(--aa-border)',
  borderSoft:   'var(--aa-border-soft)',
  field:        'var(--aa-field)',
  inset:        'var(--aa-inset)',
  ridge:        'var(--aa-ridge)',
  blue:         'var(--aa-blue-panel)',
  radius:       10,
  radiusSm:     8,
  shadow: (accent?: string) =>
    accent
      ? `0 1px 2px rgba(20,60,95,0.16), 0 0 0 1px color-mix(in srgb, ${accent} 26%, transparent)`
      : '0 1px 2px rgba(20,60,95,0.14)',
} as const

// ── Blue frosted slab ─────────────────────────────────────────────────────────

export function AeroBlue({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: aero.blue,
        border: '1px solid rgba(255,255,255,0.42)',
        borderRadius: 14,
        padding: '16px 18px',
        color: '#fff',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.55),' +
          ' inset 0 -20px 36px rgba(10,40,70,0.26),' +
          ' 0 2px 8px rgba(24,58,88,0.24)',
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: '58%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0))',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

export function AeroBlueTitle({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: FONT, fontSize: 20, fontWeight: 650, lineHeight: 1.25,
        color: '#fff', textShadow: '0 1px 2px rgba(12,42,68,0.42)',
      }}
    >
      {children}
    </div>
  )
}

export function AeroBlueSub({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: FONT, fontSize: 13.5, lineHeight: 1.6, marginTop: 4,
        color: 'rgba(255,255,255,0.90)', textShadow: '0 1px 2px rgba(12,42,68,0.32)',
      }}
    >
      {children}
    </div>
  )
}

// ── Surfaces ──────────────────────────────────────────────────────────────────

export function AeroCard({
  children, accent, padded = true, style,
}: { children: ReactNode; accent?: string; padded?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'relative',
        background: aero.surface,
        border: `1px solid ${aero.border}`,
        borderRadius: aero.radius,
        padding: padded ? 14 : 0,
        boxShadow: `inset 0 1px 0 ${aero.ridge}, ${aero.shadow()}`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {accent && (
        <div
          aria-hidden
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
            background: accent, pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </div>
  )
}

export function AeroTag({
  children, color, filled = false, style,
}: { children: ReactNode; color?: string; filled?: boolean; style?: CSSProperties }) {
  const tint = color ?? '#4d7ba8'
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: FONT, fontSize: 12, fontWeight: 550,
        padding: '4px 11px',
        borderRadius: 999,
        border: `1px solid ${filled ? 'transparent' : aero.border}`,
        background: filled
          ? `linear-gradient(180deg, ${tint} 0%, color-mix(in srgb, ${tint} 78%, #000) 100%)`
          : aero.surfaceRaised,
        color: filled ? '#fff' : aero.textDim,
        boxShadow: filled
          ? 'inset 0 1px 0 rgba(255,255,255,0.45)'
          : `inset 0 1px 0 ${aero.ridge}`,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export function AeroSection({
  title, color, count, children,
}: { title: string; color?: string; count?: number | string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <h2
          style={{
            margin: 0, fontFamily: FONT, fontSize: 14, fontWeight: 600,
            color: aero.heading,
          }}
        >
          {title}
        </h2>
        {count !== undefined && (
          <span style={{ fontFamily: FONT, fontSize: 12.5, color: aero.textMute }}>({count})</span>
        )}
        <div style={{ flex: 1, height: 1, background: aero.borderSoft }} />
      </div>
      {children}
    </div>
  )
}

// Header slot kept for API compatibility; renders as the blue slab so every app
// leads with the same element the desktop does.
export function AeroHeader({
  title, subtitle,
}: { title: ReactNode; subtitle?: ReactNode; color?: string }) {
  return (
    <AeroBlue style={{ marginBottom: 18 }}>
      <AeroBlueTitle>{title}</AeroBlueTitle>
      {subtitle && <AeroBlueSub>{subtitle}</AeroBlueSub>}
    </AeroBlue>
  )
}

export function AeroBody({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: aero.bg,
        color: aero.text,
        padding: '16px 16px 26px',
        fontFamily: FONT,
        fontSize: 14,
        lineHeight: 1.6,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Touch row: 44px minimum height, chevron affordance when tappable.
export function AeroRow({
  children, onClick, last, style,
}: { children: ReactNode; onClick?: () => void; last?: boolean; style?: CSSProperties }) {
  const interactive = !!onClick
  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick!() }
      } : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        minHeight: 44,
        padding: '10px 4px',
        borderBottom: last ? 'none' : `1px solid ${aero.borderSoft}`,
        fontFamily: FONT, fontSize: 13.5, color: aero.text,
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
      {interactive && (
        <span aria-hidden style={{ color: aero.textMute, flexShrink: 0, fontSize: 16 }}>›</span>
      )}
    </div>
  )
}
