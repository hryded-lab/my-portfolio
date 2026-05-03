'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { mobileTheme as t } from './mobileTheme'
import { brutal as b } from '../brutal'

const BOOT_DURATION_MS = 2400

export default function MobileBoot({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, BOOT_DURATION_MS)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        position: 'fixed', inset: 0,
        background: `linear-gradient(180deg, ${b.bg} 0%, ${b.bgDeep} 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
        fontFamily: t.fontUi,
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 4 }}
        animate={{ scale: 1,    opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          marginBottom: 36,
        }}
      >
        <div
          style={{
            fontFamily: t.fontMono,
            fontSize: 10,
            color: t.accent,
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontWeight: 700,
            marginBottom: 14,
            padding: '3px 8px',
            border: `1.5px solid ${t.accent}`,
            borderRadius: 4,
          }}
        >
          Boot · v1
        </div>
        <div
          style={{
            fontFamily: t.fontDisplay,
            fontSize: 24,
            fontWeight: 800,
            color: b.text,
            letterSpacing: -0.6,
            lineHeight: 1.05,
            textAlign: 'center',
          }}
        >
          Hryday&apos;s Portfolio
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 3, background: t.accent, borderRadius: 2 }} />
          <div
            style={{
              fontFamily: t.fontMono,
              fontSize: 9,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: b.textMute,
              fontWeight: 700,
            }}
          >
            Phone
          </div>
          <div style={{ width: 28, height: 3, background: t.accent, borderRadius: 2 }} />
        </div>
      </motion.div>

      <div
        style={{
          width: 160, height: 2,
          background: b.border,
          borderRadius: 1, overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ x: '-120%' }}
          animate={{ x: '350%' }}
          transition={{ duration: 1.3, ease: 'linear', repeat: Infinity }}
          style={{
            position: 'absolute', top: 0, left: 0, height: '100%', width: '45%',
            background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 22,
          fontSize: 10,
          letterSpacing: 1.4,
          color: b.textMute,
          textTransform: 'uppercase',
          fontFamily: t.fontMono,
          fontWeight: 700,
        }}
      >
        Now Loading
      </div>
    </motion.div>
  )
}
