'use client'

import { useEffect } from 'react'

type Props = { onDone: () => void; fading?: boolean }

export default function BootScreen({ onDone, fading }: Props) {
  useEffect(() => {
    if (sessionStorage.getItem('xp-booted')) {
      onDone()
      return
    }
    const t = setTimeout(() => {
      sessionStorage.setItem('xp-booted', 'true')
      onDone() // parent starts mounting lock screen; we stay alive for the crossfade
    }, 3500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 999999,
        gap: 48,
        // Fade out smoothly when parent signals it's time
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.55s ease-in',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Windows logo */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 52, height: 52 }}>
            <div style={{ background: '#e62020', borderRadius: '5px 0 0 0' }} />
            <div style={{ background: '#30a030', borderRadius: '0 5px 0 0' }} />
            <div style={{ background: '#2020e6', borderRadius: '0 0 0 5px' }} />
            <div style={{ background: '#f0a000', borderRadius: '0 0 5px 0' }} />
          </div>
          <div>
            <div style={{
              color: '#fff', fontFamily: 'Trebuchet MS, Arial', fontSize: 36,
              fontWeight: 300, letterSpacing: -1, lineHeight: 1,
            }}>
              Windows
            </div>
            <div style={{ color: '#3a78c0', fontSize: 11, fontFamily: 'Trebuchet MS, Arial', letterSpacing: 3, marginTop: 2 }}>
              PORTFOLIO EDITION
            </div>
          </div>
        </div>
        <div style={{ color: '#444', fontSize: 11, fontFamily: "'Silkscreen', 'Courier New', monospace", marginTop: 6 }}>
          Hryday Nitin Lath — BITS Pilani
        </div>
      </div>

      {/* XP-style marquee progress bar */}
      <div style={{ width: 200 }}>
        <div style={{
          height: 10, background: '#0a0a0a',
          border: '1px solid #1a3a6a',
          borderRadius: 5, overflow: 'hidden',
          position: 'relative',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)',
        }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 1, bottom: 1,
                width: '28%',
                background: 'linear-gradient(to bottom, #5aaaf8 0%, #1a6de8 50%, #0d52c0 100%)',
                borderRadius: 3,
                animation: `xpMarquee 1.4s linear ${i * 0.47}s infinite`,
                boxShadow: '0 0 6px rgba(30,120,255,0.6)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
