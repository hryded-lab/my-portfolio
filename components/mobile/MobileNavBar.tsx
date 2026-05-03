'use client'

import { mobileTheme as t } from './mobileTheme'

type Props = {
  onBack: () => void
  onHome: () => void
  onRecents: () => void
  canGoBack?: boolean
}

export default function MobileNavBar({ onBack, onHome, onRecents, canGoBack = false }: Props) {
  const fg = '#fff'
  const dim = canGoBack ? '#fff' : 'rgba(255,255,255,0.35)'

  return (
    <div
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        height: t.navHeight,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(8, 18, 40, 0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderTop: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        zIndex: 80,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <NavButton onClick={onBack} aria-label="Back" disabled={!canGoBack}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M14 4l-7 7 7 7" stroke={dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </NavButton>

      <NavButton onClick={onHome} aria-label="Home">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="8" stroke={fg} strokeWidth="2" fill="none" />
        </svg>
      </NavButton>

      <NavButton onClick={onRecents} aria-label="Recents">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="3" y="3" width="14" height="14" rx="2.5" stroke={fg} strokeWidth="2" fill="none" />
        </svg>
      </NavButton>
    </div>
  )
}

function NavButton({
  children, onClick, disabled, ...rest
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  'aria-label': string
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      aria-label={rest['aria-label']}
      style={{
        flex: 1,
        height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        color: '#fff',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </button>
  )
}
