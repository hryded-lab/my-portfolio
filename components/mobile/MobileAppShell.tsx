'use client'

import type { ReactNode } from 'react'
import { aero as a, FONT, AeroCard, AeroSection, AeroTag } from './aeroKit'

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
  // (useful for apps that own their own layout, e.g. the Resume iframe).
  bare?: boolean
}

// Shared chrome for every phone app, in the same Vista-2023-meets-Aero language
// as the desktop: a blue frosted header slab over white content, sized for touch.
// The app's own accent tints the header so each one still reads distinctly.
export default function MobileAppShell({
  title, color, onInternalBack, trailing, subtitle, children, bare,
}: Props) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: a.bg,
        display: 'flex', flexDirection: 'column',
        color: a.text,
        fontFamily: FONT,
      }}
    >
      {/* Blue header slab, running up under the status bar */}
      <div
        style={{
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 34px)',
          background: `linear-gradient(158deg,
            color-mix(in srgb, ${color} 46%, #4d7ba8) 0%,
            color-mix(in srgb, ${color} 30%, #3a6491) 48%,
            color-mix(in srgb, ${color} 22%, #2b4d75) 100%)`,
          borderBottom: '1px solid rgba(255,255,255,0.35)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.5),' +
            ' inset 0 -22px 40px rgba(8,34,60,0.30),' +
            ' 0 2px 10px rgba(20,52,82,0.28)',
        }}
      >
        {/* Glass sheen over the upper half */}
        <div
          aria-hidden
          style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: '62%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0))',
            pointerEvents: 'none',
          }}
        />
        {/* Light bloom off the top-left corner */}
        <div
          aria-hidden
          style={{
            position: 'absolute', top: '-46%', left: '-10%',
            width: '62%', height: '120%',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.24), transparent 68%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', padding: '10px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 34 }}>
            {onInternalBack && (
              <button
                type="button"
                onClick={onInternalBack}
                aria-label="Back"
                style={{
                  width: 44, height: 34, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.5)',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.10))',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                  color: '#fff', fontSize: 17, lineHeight: 1,
                }}
              >
                ‹
              </button>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: FONT, fontSize: 21, fontWeight: 650,
                  lineHeight: 1.2, color: '#fff',
                  textShadow: '0 1px 2px rgba(10,38,62,0.45)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {title}
              </div>
              {subtitle && (
                <div
                  style={{
                    fontFamily: FONT, fontSize: 12.5, marginTop: 2,
                    color: 'rgba(255,255,255,0.85)',
                    textShadow: '0 1px 2px rgba(10,38,62,0.35)',
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>

            {trailing && <div style={{ flexShrink: 0 }}>{trailing}</div>}
          </div>
        </div>
      </div>

      {/* Content */}
      {bare ? (
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>{children}</div>
      ) : (
        <div
          style={{
            flex: 1, minHeight: 0,
            overflowY: 'auto',
            padding: '16px 16px calc(env(safe-area-inset-bottom, 0px) + 74px)',
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

// Re-exported under their previous names so app bodies resolve unchanged; the
// implementations are the Aero ones.
export {
  AeroCard as BrutalistCard,
  AeroSection as BrutalistSection,
  AeroTag as BrutalistTag,
}
