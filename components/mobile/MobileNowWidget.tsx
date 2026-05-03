'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/content/siteConfig'
import { mobileTheme as t } from './mobileTheme'

const ROTATE_MS = 4500

export default function MobileNowWidget() {
  const items = siteConfig.currently
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    const id = setInterval(() => setIdx(i => (i + 1) % items.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [items.length])

  const current = items[idx]

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top, 0px) + 116px)',
        left: 16, right: 16,
        zIndex: 4,
        height: 116,
        padding: '14px 16px 12px',
        borderRadius: 18,
        background: 'rgba(10, 25, 60, 0.55)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid ${t.borderStrong}`,
        boxShadow: '0 6px 22px rgba(0,15,55,0.35)',
        overflow: 'hidden',
        fontFamily: t.fontUi,
      }}
    >
      {/* Header — pulsing dot + NOW + section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <motion.div
          animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.18, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 7, height: 7,
            borderRadius: 999,
            background: '#4ed670',
            boxShadow: '0 0 8px rgba(78,214,112,0.7)',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: t.fontMono,
            fontSize: 9.5, fontWeight: 700,
            letterSpacing: 1.8, textTransform: 'uppercase',
            color: 'rgba(220,232,255,0.78)',
          }}
        >
          Now
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }} />
        <span
          style={{
            fontFamily: t.fontMono,
            fontSize: 9, fontWeight: 700,
            letterSpacing: 1.4, textTransform: 'uppercase',
            color: 'rgba(220,232,255,0.5)',
          }}
        >
          {current.label}
        </span>
      </div>

      {/* Rotating value with crossfade */}
      <div style={{ position: 'relative', height: 44 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0,
              fontSize: 14.5,
              fontWeight: 600,
              color: '#fff',
              lineHeight: 1.4,
              letterSpacing: -0.1,
              textShadow: '0 1px 4px rgba(0,15,55,0.6)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {current.value}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Index dots */}
      <div style={{ position: 'absolute', bottom: 10, left: 16, display: 'flex', gap: 4 }}>
        {items.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === idx ? 14 : 4,
              height: 4,
              borderRadius: 999,
              background: i === idx ? '#4ed670' : 'rgba(255,255,255,0.32)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
