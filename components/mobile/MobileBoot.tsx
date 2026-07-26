'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

// Power-on rather than a loading screen. The panel wakes the way a phone screen
// does: a hairline of light strikes across the middle, blooms outward, and
// bioluminescent motes drift up through it before it hands off to the lock
// screen. No branding, no progress bar, nothing to read.

const BOOT_DURATION_MS = 2100

// Fixed rather than random so the sequence is identical on every visit.
const MOTES = [
  { x: 18, y: 62, size: 120, delay: 0.55, drift: -46, hue: '132, 246, 255' },
  { x: 74, y: 38, size: 96,  delay: 0.72, drift: -38, hue: '120, 255, 214' },
  { x: 46, y: 78, size: 152, delay: 0.62, drift: -58, hue: '96, 214, 255' },
  { x: 86, y: 70, size: 78,  delay: 0.90, drift: -30, hue: '160, 255, 232' },
  { x: 8,  y: 30, size: 88,  delay: 0.84, drift: -34, hue: '110, 230, 255' },
  { x: 60, y: 20, size: 110, delay: 1.00, drift: -42, hue: '140, 255, 240' },
]

export default function MobileBoot({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, BOOT_DURATION_MS)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0,
        background: '#000208',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      {/* Bioluminescent motes drifting up behind the bloom */}
      {MOTES.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, scale: 0.7 }}
          animate={{ opacity: [0, 0.5, 0.32], y: m.drift, scale: 1 }}
          transition={{ duration: 1.5, delay: m.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.size,
            height: m.size,
            marginLeft: -m.size / 2,
            marginTop: -m.size / 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${m.hue},0.5) 0%, rgba(${m.hue},0.14) 42%, transparent 70%)`,
            filter: 'blur(14px)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* The bloom: a hairline strike that swells into a full wash of light */}
      <motion.div
        initial={{ scaleX: 0.04, scaleY: 0.006, opacity: 0 }}
        animate={{ scaleX: [0.04, 1, 1.35], scaleY: [0.006, 0.02, 1.35], opacity: [0, 1, 0.62] }}
        transition={{ duration: 1.25, ease: 'easeOut', times: [0, 0.28, 1] }}
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: '110vw', height: '110vw',
          marginLeft: '-55vw', marginTop: '-55vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle,' +
            ' rgba(228,255,255,0.95) 0%,' +
            ' rgba(140,246,255,0.55) 16%,' +
            ' rgba(64,196,226,0.28) 34%,' +
            ' rgba(16,86,120,0.12) 55%,' +
            ' transparent 72%)',
          pointerEvents: 'none',
        }}
      />

      {/* Settles into a calm underwater glow so the handoff to the lock screen
          reads as a continuation rather than a cut */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.1, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(120% 80% at 50% 62%,' +
            ' rgba(22,120,150,0.34) 0%,' +
            ' rgba(6,42,62,0.55) 45%,' +
            ' rgba(0,4,10,0.90) 100%)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  )
}
