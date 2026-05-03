'use client'

import type { ReactNode } from 'react'
import { mobileTheme as t } from './mobileTheme'
import { BrutalCard, BrutalTag, BrutalSection, brutal as b } from '../brutal'

type Props = {
  title: ReactNode
  color: string
  // Optional in-app back arrow, shown left of the title when provided.
  onInternalBack?: () => void
  // Optional content rendered to the right of the header (e.g. a tab switcher).
  trailing?: ReactNode
  // Optional small line under the title (subtitle / status).
  subtitle?: ReactNode
  children: ReactNode
  // When true, content is rendered without the default scroll wrapper
  // (useful for apps that own their own layout, e.g. Resume iframe).
  bare?: boolean
}

// Edited brutalism — middle ground between conventional dark UI and full
// brutalism. Soft near-black ground, 1.5px hairlines, restrained accent
// stripes, mono labels, no rotated stickers in the chrome.
export default function MobileAppShell({
  title, color, onInternalBack, trailing, subtitle, children, bare,
}: Props) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${b.bg} 0%, ${b.bgDeep} 100%)`,
        display: 'flex', flexDirection: 'column',
        color: b.text,
        fontFamily: t.fontUi,
      }}
    >
      {/* Status bar spacer */}
      <div style={{ height: 'calc(env(safe-area-inset-top, 0px) + 28px)', flexShrink: 0 }} />

      {/* Header */}
      <div
        style={{
          padding: '14px 18px 18px',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Top utility row: back + trailing */}
        {(onInternalBack || trailing) && (
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 14,
              gap: 10,
            }}
          >
            {onInternalBack ? (
              <button
                onClick={onInternalBack}
                aria-label="Back"
                style={{
                  width: 40, height: 32,
                  background: b.surface,
                  border: `1.5px solid ${b.borderStrong}`,
                  borderRadius: b.radiusSm,
                  color: b.text,
                  fontFamily: t.fontMono,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: b.shadow(),
                  WebkitTapHighlightColor: 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0,
                  flexShrink: 0,
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              >
                ←
              </button>
            ) : <span />}
            <div style={{ flexShrink: 0 }}>{trailing}</div>
          </div>
        )}

        {/* Subtitle as a mono tag */}
        {subtitle && (
          <BrutalTag color={color} style={{ marginBottom: 10 }}>
            {subtitle}
          </BrutalTag>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1.1,
            color: b.text,
            margin: 0,
            fontFamily: t.fontDisplay,
            wordBreak: 'break-word',
          }}
        >
          {title}
        </h1>

        {/* Small accent stripe + hairline */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32, height: 4,
              background: color,
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              flex: 1, height: 1,
              background: b.border,
            }}
          />
        </div>
      </div>

      {/* Body */}
      {bare ? (
        <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
      ) : (
        <div
          style={{
            flex: 1, overflowY: 'auto',
            padding: '12px 18px 36px',
            minHeight: 0,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

// ── Brutalist primitives ─────────────────────────────────────────────────────
// Re-exported under both Brutal* (canonical) and Brutalist* (legacy mobile names)
// so existing app interiors keep compiling.

export { BrutalCard, BrutalTag, BrutalSection } from '../brutal'
export {
  BrutalCard as BrutalistCard,
  BrutalTag as BrutalistTag,
  BrutalSection as BrutalistSection,
} from '../brutal'

// Older alias names from earlier shell revisions.
export const Section = ({
  title, accent, children,
}: { title: string; accent?: string; children: ReactNode }) => (
  <BrutalSection title={title} color={accent ?? b.text}>{children}</BrutalSection>
)

export const LuxuryCard = ({
  children, accent, padded = true,
}: { children: ReactNode; accent?: string; padded?: boolean }) => (
  <BrutalCard accent={accent} padded={padded}>{children}</BrutalCard>
)
