'use client'

import { useState, useEffect } from 'react'
import { playNotification } from '@/lib/sounds'

export default function SysTrayBalloon() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasShown = sessionStorage.getItem('balloon-shown')
    if (!hasShown) {
      const t = setTimeout(() => {
        setVisible(true)
        playNotification()
        sessionStorage.setItem('balloon-shown', 'true')
        setTimeout(() => setVisible(false), 7000)
      }, 2800)
      return () => clearTimeout(t)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 48,
        right: 12,
        width: 248,
        background: '#ffffcc',
        border: '1px solid #808080',
        borderRadius: 4,
        padding: '8px 10px',
        zIndex: 99997,
        boxShadow: '3px 3px 10px rgba(0,0,0,0.4)',
        fontFamily: 'Tahoma, Arial',
        fontSize: 11,
        animation: 'windowOpen 0.2s ease-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'bold', color: '#0054e3', fontSize: 11 }}>
          <span style={{ fontSize: 13 }}>💼</span>
          Hryday&apos;s Portfolio
        </div>
        <button
          onClick={() => setVisible(false)}
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 11, color: '#666', lineHeight: 1, padding: '0 2px',
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ color: '#222', lineHeight: 1.6, fontSize: 11 }}>
        Welcome! <strong>Double-click</strong> the desktop icons to explore.<br />
        <span style={{ color: '#555', fontSize: 10 }}>
          Click <strong>start</strong> for the full menu. Try Minesweeper!
        </span>
      </div>
      {/* Balloon tail */}
      <div style={{
        position: 'absolute',
        bottom: -8,
        right: 24,
        width: 0, height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid #ffffcc',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -10,
        right: 23,
        width: 0, height: 0,
        borderLeft: '9px solid transparent',
        borderRight: '9px solid transparent',
        borderTop: '9px solid #808080',
        zIndex: -1,
      }} />
    </div>
  )
}
