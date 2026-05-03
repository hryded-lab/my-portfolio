'use client'

import { useEffect, useState } from 'react'
import { mobileTheme as t } from './mobileTheme'

type Props = { tone?: 'light' | 'dark' }

export default function MobileStatusBar({ tone = 'light' }: Props) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  const fg = tone === 'light' ? '#fff' : '#0a1530'

  return (
    <div
      style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: t.statusHeight,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 18px 0',
        fontSize: 12, fontWeight: 600,
        color: fg,
        fontFamily: t.fontUi,
        letterSpacing: 0.2,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>{time}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.92 }}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
          <rect x="0"    y="7" width="2.4" height="3"  rx="0.6" fill={fg} />
          <rect x="3.4"  y="5" width="2.4" height="5"  rx="0.6" fill={fg} />
          <rect x="6.8"  y="3" width="2.4" height="7"  rx="0.6" fill={fg} />
          <rect x="10.2" y="0" width="2.4" height="10" rx="0.6" fill={fg} />
        </svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
          <path d="M1 4a8.5 8.5 0 0 1 12 0"   stroke={fg} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M3 6a5.5 5.5 0 0 1 8 0"    stroke={fg} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <circle cx="7" cy="9" r="1" fill={fg} />
        </svg>
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="19" height="9" rx="2" stroke={fg} strokeWidth="1" fill="none" />
          <rect x="20"  y="3"   width="1.5" height="4" rx="0.5" fill={fg} />
          <rect x="2"   y="2"   width="14" height="6" rx="1" fill={fg} />
        </svg>
      </div>
    </div>
  )
}
