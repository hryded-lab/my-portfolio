'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import MobileStatusBar from './MobileStatusBar'
import { mobileTheme as t } from './mobileTheme'

const UNLOCK_THRESHOLD_PX = 120
const UNLOCK_VELOCITY     = 350

type Props = { onUnlock: () => void }

export default function MobileLock({ onUnlock }: Props) {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  const y       = useMotionValue(0)
  const opacity = useTransform(y, [-300, 0], [0.2, 1])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const finishUnlock = () => {
    animate(y, -window.innerHeight, { duration: 0.45, ease: 'easeIn', onComplete: onUnlock })
  }

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: -10000, bottom: 0 }}
      dragElastic={0.18}
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        y, opacity,
        overflow: 'hidden',
        fontFamily: t.fontUi,
        touchAction: 'none',
      }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -UNLOCK_THRESHOLD_PX || info.velocity.y < -UNLOCK_VELOCITY) {
          finishUnlock()
        } else {
          animate(y, 0, { type: 'spring', stiffness: 320, damping: 30 })
        }
      }}
    >
      {/* Wallpaper */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wallpaper.jpg" alt=""
        draggable={false}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: '78% center',
          pointerEvents: 'none', userSelect: 'none',
        }}
      />

      {/* Atmospheric overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,12,45,0.35) 0%, rgba(0,15,55,0.15) 45%, rgba(0,8,30,0.78) 100%)',
        }}
      />

      <MobileStatusBar tone="light" />

      {/* Clock + date — Samsung One UI style: top-aligned, generous breathing room */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top, 0px) + 92px)',
          left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 84, fontWeight: 300,
            letterSpacing: -3.5,
            lineHeight: 1,
            fontFamily: t.fontDisplay,
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 2px 24px rgba(0,40,120,0.5)',
          }}
        >
          {time}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 11, fontWeight: 700,
            color: 'rgba(220,232,255,0.78)',
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            fontFamily: t.fontMono,
          }}
        >
          {date}
        </div>
      </div>

      {/* Identity chip */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 130px)',
          left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          color: '#fff',
        }}
      >
        <div
          style={{
            width: 64, height: 64, borderRadius: '50%', overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.45)',
            boxShadow: '0 6px 22px rgba(0,30,90,0.5)',
            marginBottom: 12,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/me.jpg" alt="Hryday" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.2, fontFamily: t.fontDisplay }}>Hryday</div>
        <div
          style={{
            fontSize: 9.5, fontWeight: 700,
            color: 'rgba(220,232,255,0.68)',
            marginTop: 4, letterSpacing: 1.4,
            textTransform: 'uppercase',
            fontFamily: t.fontMono,
          }}
        >
          BITS Pilani · 2029
        </div>
      </div>

      {/* Swipe-up hint */}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.45, 0.95, 0.45] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 36px)',
          left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.85)',
          pointerEvents: 'none',
        }}
      >
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden>
          <path d="M2 11l9-9 9 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: 700, fontFamily: t.fontMono }}>
          Swipe up to open
        </span>
      </motion.div>
    </motion.div>
  )
}
