'use client'

import type { CSSProperties, ReactNode } from 'react'

// Windows Vista / 7 Aero application chrome.
//
// The previous pass styled window interiors as modern web glass: 12px radii,
// neon cyan glow, dark teal panels. That is a 2024 aesthetic sitting inside 2001
// window chrome, which is why it read as generic no matter how much gloss went on
// it. This targets the actual software that shipped alongside the imagery on the
// desktop: light panels, 3px radii, thin cool borders, blue heading text, and
// Explorer's task-pane-plus-list layout.
//
// Type is Segoe UI at 12.5px, the real Aero UI size. Inter is the fallback since
// it is already loaded and is the closest humanist match off Windows.

export const FONT = "'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif"

export const ui = {
  // Values live in globals.css under --aa-*, so the whole app chrome follows the
  // theme toggle instead of being pinned to the light palette.
  body:      'var(--aa-body)',
  pane:      'var(--aa-pane)',
  bar:       'var(--aa-bar)',
  rowAlt:    'var(--aa-row-alt)',

  border:    'var(--aa-border)',
  borderSoft:'var(--aa-border-soft)',
  ridge:     'var(--aa-ridge)',

  text:      'var(--aa-text)',
  textDim:   'var(--aa-text-dim)',
  textMute:  'var(--aa-text-mute)',
  heading:   'var(--aa-heading)',

  selBg:     'var(--aa-sel-bg)',
  selBorder: 'var(--aa-sel-bdr)',

  field:     'var(--aa-field)',
  inset:     'var(--aa-inset)',

  cellOn:    'var(--aa-cell-on)',
  cellOff:   'var(--aa-cell-off)',
  cellBdrOn: 'var(--aa-cell-bdr-on)',
  cellBdrOff:'var(--aa-cell-bdr-off)',

  radius:    3,
} as const

// Top strip. Vista put a soft vertical gradient here with a hairline underneath.
export function CommandBar({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 10px',
        height: 34,
        flexShrink: 0,
        background: ui.bar,
        borderBottom: `1px solid ${ui.border}`,
        boxShadow: `inset 0 1px 0 ${ui.ridge}`,
        fontFamily: FONT,
        fontSize: 12.5,
        color: ui.text,
      }}
    >
      {children}
    </div>
  )
}

export function SearchBox({
  value, onChange, placeholder = 'Search',
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: ui.field,
        border: `1px solid ${ui.border}`,
        borderRadius: ui.radius,
        padding: '0 8px',
        height: 22,
        minWidth: 150,
        boxShadow: ui.inset,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.55 }}>
        <circle cx="10.5" cy="10.5" r="6.5" stroke={ui.textDim} strokeWidth="2.4" />
        <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={ui.textDim} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          border: 'none', outline: 'none', background: 'transparent',
          fontFamily: FONT, fontSize: 12, color: ui.text,
          width: '100%', minWidth: 0, padding: 0,
        }}
      />
    </div>
  )
}

// Explorer's left navigation pane.
export function TaskPane({ children, width = 168 }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        width, flexShrink: 0,
        background: ui.pane,
        borderRight: `1px solid ${ui.border}`,
        boxShadow: `inset -1px 0 0 ${ui.ridge}`,
        overflowY: 'auto',
        padding: '10px 0',
        fontFamily: FONT,
      }}
    >
      {children}
    </div>
  )
}

export function PaneHeading({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 11.5,
        fontWeight: 600,
        color: ui.heading,
        padding: '0 12px 6px',
      }}
    >
      {children}
    </div>
  )
}

export function PaneItem({
  label, count, selected, onClick,
}: { label: string; count?: number; selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="aero-pane-item"
      data-selected={selected ? 'true' : undefined}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: 'calc(100% - 12px)',
        margin: '1px 6px',
        padding: '4px 8px',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: ui.radius,
        fontFamily: FONT,
        fontSize: 12.5,
        color: ui.text,
        border: `1px solid ${selected ? ui.selBorder : 'transparent'}`,
        background: selected ? ui.selBg : 'transparent',
      }}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span style={{ color: ui.textMute, fontSize: 11.5 }}>{count}</span>
      )}
    </button>
  )
}

// Blue group header, the way Explorer separates grouped results.
export function GroupHeading({ label, count }: { label: string; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0 6px' }}>
      <span
        style={{
          fontFamily: FONT, fontSize: 12.5, fontWeight: 600,
          color: ui.heading, flexShrink: 0,
        }}
      >
        {label}
      </span>
      {count !== undefined && (
        <span style={{ fontFamily: FONT, fontSize: 11.5, color: ui.textMute }}>({count})</span>
      )}
      <div style={{ flex: 1, height: 1, background: ui.borderSoft }} />
    </div>
  )
}

export function ListRow({
  children, alt, style,
}: { children: ReactNode; alt?: boolean; style?: CSSProperties }) {
  return (
    <div
      className="aero-list-row"
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 10px',
        borderRadius: ui.radius,
        border: '1px solid transparent',
        background: alt ? ui.rowAlt : 'transparent',
        fontFamily: FONT,
        fontSize: 12.5,
        color: ui.text,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Vista drew levels as discrete notched cells, not a continuous rounded bar.
export function LevelBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} aria-hidden>
      {Array.from({ length: max }, (_, i) => {
        const on = i < value
        return (
          <span
            key={i}
            style={{
              width: 13, height: 9,
              borderRadius: 1,
              border: `1px solid ${on ? ui.cellBdrOn : ui.cellBdrOff}`,
              background: on ? ui.cellOn : ui.cellOff,
              boxShadow: on ? 'inset 0 1px 0 rgba(255,255,255,0.5)' : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

// Bordered group box, the way Vista fenced related settings.
export function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: ui.pane,
        border: `1px solid ${ui.border}`,
        borderRadius: ui.radius,
        boxShadow: `inset 0 1px 0 ${ui.ridge}`,
        padding: '4px 12px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Label and value on one line, Explorer's details-pane pairing.
export function PropRow({
  label, children, last,
}: { label: string; children: ReactNode; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex', gap: 14, alignItems: 'baseline',
        padding: '8px 0',
        borderBottom: last ? 'none' : `1px solid ${ui.borderSoft}`,
        fontFamily: FONT, fontSize: 12.5,
      }}
    >
      <span style={{ width: 108, flexShrink: 0, color: ui.textMute }}>{label}</span>
      <span style={{ color: ui.text, lineHeight: 1.55, minWidth: 0 }}>{children}</span>
    </div>
  )
}

export function StatusBar({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        height: 22, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 10px',
        background: ui.bar,
        borderTop: `1px solid ${ui.border}`,
        boxShadow: `inset 0 1px 0 ${ui.ridge}`,
        fontFamily: FONT,
        fontSize: 11.5,
        color: ui.textDim,
      }}
    >
      {children}
    </div>
  )
}

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="aero-app"
      style={{
        height: '100%',
        display: 'flex', flexDirection: 'column',
        background: ui.body,
        fontFamily: FONT,
        fontSize: 12.5,
        color: ui.text,
      }}
    >
      {children}
    </div>
  )
}
