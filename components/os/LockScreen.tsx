'use client'

import { useState, useEffect, useRef } from 'react'
import { siteConfig } from '@/content/siteConfig'
import { playStartup } from '@/lib/sounds'
import { LockScreenCaustics } from '@/components/lock-screen-caustics'

const TOP_SKILLS = ['Fusion 360', 'LTspice', 'Financial Statement Analysis', 'Figma', 'RAG / LLMs']

type Props = { onUnlock: () => void; isUnlocking?: boolean; onUnlockComplete?: () => void; onShutdown?: () => void }

// Windows 7 Aero glass panel base styles
const glassPanel: React.CSSProperties = {
  position: 'relative',
  background: 'rgba(15, 50, 110, 0.48)',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  border: '1px solid rgba(160, 200, 255, 0.22)',
  borderRadius: 4,
  boxShadow: [
    '0 8px 40px rgba(0,0,0,0.55)',
    'inset 0 1px 0 rgba(255,255,255,0.14)',
    'inset 0 0 0 1px rgba(80,140,255,0.08)',
  ].join(', '),
  overflow: 'hidden',
}

function GlossStrip() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '38%',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 100%)',
      borderRadius: '4px 4px 0 0',
      pointerEvents: 'none',
    }} />
  )
}

export default function LockScreen({ onUnlock, isUnlocking, onUnlockComplete, onShutdown }: Props) {
  const [time, setTime]         = useState('')
  const [ampm, setAmpm]         = useState('')
  const [date, setDate]         = useState('')
  const [hoverUnlock, setHoverUnlock] = useState(false)
  const startupPlayed = useRef(false)

  useEffect(() => {
    if (!startupPlayed.current) {
      startupPlayed.current = true
      const t = setTimeout(playStartup, 400)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\s?(AM|PM)/, ''))
      setAmpm(now.toLocaleTimeString('en-US', { hour12: true }).slice(-2))
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (isUnlocking) {
      const t = setTimeout(() => onUnlockComplete?.(), 800)
      return () => clearTimeout(t)
    }
  }, [isUnlocking, onUnlockComplete])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999998,
        overflow: 'hidden',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        animation: isUnlocking
          ? 'lockScreenSlideUp 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          : 'lockScreenSlideIn 0.6s cubic-bezier(0.34, 1.2, 0.64, 1) forwards',
      }}
    >
      {/* Wallpaper */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wallpaper.jpg" alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(150deg, rgba(0,12,45,0.58) 0%, rgba(0,25,70,0.48) 50%, rgba(0,8,30,0.62) 100%)',
        backdropFilter: 'blur(2px)',
      }} />

      {/* Caustics */}
      <LockScreenCaustics />

      {/* Windows 7-style bottom strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 56,
        background: 'linear-gradient(to top, rgba(0,15,55,0.90) 0%, rgba(0,20,65,0.65) 60%, transparent 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        padding: '0 28px', zIndex: 2, gap: 10,
      }}>
        {onShutdown && (
          <button
            onClick={onShutdown}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(200,220,255,0.22)',
              borderRadius: 3,
              padding: '5px 18px',
              color: 'rgba(200,225,255,0.75)',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: 0.2,
            }}
          >
            Shut down
          </button>
        )}
      </div>

      {/* ── Two-panel layout ── */}
      <div className="lock-screen-panels" style={{
        position: 'relative', zIndex: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 48px 72px',
        gap: 18,
      }}>

        {/* ════════════════════════════════════════
            LEFT PANEL — Clock + User Identity
            ════════════════════════════════════════ */}
        <div className="lock-screen-left" style={{ ...glassPanel, width: 288, padding: '32px 26px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GlossStrip />

          {/* Clock */}
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 6 }}>
              <span className="lock-screen-clock" style={{
                fontSize: 76, fontWeight: 200,
                color: '#fff',
                textShadow: '0 2px 22px rgba(0,90,255,0.45), 0 1px 5px rgba(0,0,0,0.65)',
                letterSpacing: -3, lineHeight: 1,
                fontFamily: "'Segoe UI Light', 'Segoe UI', system-ui, sans-serif",
              }}>
                {time}
              </span>
              <span style={{
                fontSize: 18, fontWeight: 300,
                color: 'rgba(200,225,255,0.65)',
                marginTop: 12, letterSpacing: 0.5,
              }}>
                {ampm}
              </span>
            </div>
            <div style={{
              fontSize: 12.5, fontWeight: 400,
              color: 'rgba(190,215,255,0.75)',
              marginTop: 8, letterSpacing: 0.3,
            }}>
              {date}
            </div>
          </div>

          {/* Separator */}
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.11)', marginBottom: 26 }} />

          {/* Avatar */}
          <div style={{
            width: 86, height: 86, borderRadius: '50%', marginBottom: 14,
            border: '3px solid rgba(255,255,255,0.32)',
            boxShadow: '0 4px 22px rgba(0,90,255,0.42), 0 0 0 1px rgba(100,165,255,0.28)',
            overflow: 'hidden', flexShrink: 0,
            background: 'linear-gradient(145deg, #1a3a6a, #0d1f3c)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/me.jpg" alt="Hryday" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Username */}
          <div style={{
            fontSize: 26, fontWeight: 300,
            color: '#fff',
            letterSpacing: 0.5,
            textShadow: '0 1px 12px rgba(0,0,0,0.45)',
            marginBottom: 5,
            fontFamily: "'Segoe UI Light', 'Segoe UI', system-ui, sans-serif",
          }}>
            Hryday
          </div>

          {/* Role */}
          <div style={{ fontSize: 12, color: 'rgba(180,210,255,0.85)', fontWeight: 400, marginBottom: 3, letterSpacing: 0.25 }}>
            Entrepreneur &amp; Builder
          </div>
          <div style={{ fontSize: 11, color: 'rgba(160,195,255,0.60)', fontWeight: 400, marginBottom: 22, letterSpacing: 0.2 }}>
            BITS Pilani · 2029
          </div>

          {/* Working for Growth */}
          <div style={{
            padding: '5px 14px', borderRadius: 3,
            background: 'rgba(25,150,70,0.22)',
            border: '1px solid rgba(50,195,100,0.38)',
            color: '#7dffaa', fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
            letterSpacing: 0.2, marginBottom: 22,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7dffaa', boxShadow: '0 0 6px rgba(125,255,170,0.8)' }} />
            Working for Growth
          </div>

          {/* Separator */}
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.11)', marginBottom: 22 }} />

          {/* Enter Portfolio button */}
          <button
            onClick={onUnlock}
            onMouseEnter={() => setHoverUnlock(true)}
            onMouseLeave={() => setHoverUnlock(false)}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '10px 18px',
              background: hoverUnlock
                ? 'linear-gradient(to bottom, rgba(110,180,255,0.52), rgba(45,115,240,0.42))'
                : 'linear-gradient(to bottom, rgba(70,150,255,0.36), rgba(25,85,215,0.26))',
              border: hoverUnlock
                ? '1px solid rgba(150,210,255,0.65)'
                : '1px solid rgba(110,175,255,0.38)',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.14s',
              boxShadow: hoverUnlock
                ? '0 0 22px rgba(70,155,255,0.42), inset 0 1px 0 rgba(255,255,255,0.22)'
                : '0 3px 14px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.13)',
              transform: hoverUnlock ? 'scale(1.02)' : 'scale(1)',
              animation: hoverUnlock || isUnlocking ? 'none' : 'btnPulse 3s ease-in-out infinite',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 400, letterSpacing: 0.3 }}>
              Enter Portfolio
            </span>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              background: hoverUnlock
                ? 'linear-gradient(145deg, #82d2ff, #2a94ff)'
                : 'linear-gradient(145deg, #52b8ff, #1a72e8)',
              border: '1px solid rgba(255,255,255,0.38)',
              boxShadow: hoverUnlock ? '0 0 10px rgba(80,185,255,0.75)' : '0 2px 7px rgba(0,80,255,0.38)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.14s',
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        {/* ════════════════════════════════════════
            RIGHT PANEL — Academic + Skills + About
            ════════════════════════════════════════ */}
        <div className="lock-screen-right" style={{ ...glassPanel, width: 420, padding: '28px 26px 24px', display: 'flex', flexDirection: 'column' }}>
          <GlossStrip />

          {/* Academic */}
          <div style={{ fontSize: 9.5, color: 'rgba(175,208,255,0.52)', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>
            Academic
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 22 }}>
            {[
              { label: 'CGPA',       value: '7.90/10'     },
              { label: 'PIEDS',      value: 'Associate'   },
              { label: 'Year',       value: '1st'         },
              { label: 'University', value: 'BITS Pilani' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.065)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 3,
                padding: '10px 8px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{s.value}</div>
                <div style={{ fontSize: 9.5, color: 'rgba(175,208,255,0.58)', marginTop: 4, letterSpacing: 0.3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.09)', marginBottom: 18 }} />

          {/* Skills */}
          <div style={{ fontSize: 9.5, color: 'rgba(175,208,255,0.52)', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>
            Top Skills
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {TOP_SKILLS.map(skill => (
              <span key={skill} style={{
                padding: '3px 11px', borderRadius: 2,
                background: 'rgba(55,120,255,0.14)',
                border: '1px solid rgba(95,165,255,0.22)',
                color: 'rgba(200,225,255,0.88)', fontSize: 11, fontWeight: 400,
              }}>
                {skill}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.09)', marginBottom: 18 }} />

          {/* About */}
          <div style={{ fontSize: 9.5, color: 'rgba(175,208,255,0.52)', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>
            About
          </div>
          <div style={{
            fontSize: 12, color: 'rgba(188,213,255,0.72)',
            lineHeight: 1.68, marginBottom: 18,
            borderLeft: '2px solid rgba(90,160,255,0.32)',
            paddingLeft: 12,
          }}>
            {siteConfig.description}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.09)', marginBottom: 15 }} />

          {/* AI hint */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(200,215,255,0.5)',
            borderRadius: 3,
            marginBottom: 18,
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <rect x="1" y="1" width="14" height="10" rx="3" fill="rgba(55,120,255,0.28)" stroke="rgba(80,130,220,0.7)" strokeWidth="1"/>
              <path d="M4 12l1.5 3 1.5-3" fill="rgba(55,120,255,0.28)" stroke="rgba(80,130,220,0.7)" strokeWidth="1" strokeLinejoin="round"/>
              <rect x="4" y="4.5" width="8" height="1.2" rx="0.6" fill="#3a6ad4"/>
              <rect x="4" y="7" width="5" height="1.2" rx="0.6" fill="#3a6ad4"/>
            </svg>
            <span style={{ lineHeight: 1.45, flex: 1, textAlign: 'center' }}>
              <strong style={{ fontSize: 11, color: '#1a2a4a', fontWeight: 700, display: 'block' }}>Ask about Hryday</strong>
              <span style={{ fontSize: 10, color: '#000', fontWeight: 500 }}>AI assistant inside</span>
            </span>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'GitHub',   href: siteConfig.github },
              { label: 'LinkedIn', href: siteConfig.linkedin },
              { label: 'Email',    href: `mailto:${siteConfig.email}` },
            ].map(l => (
              <a
                key={l.label} href={l.href}
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '4px 13px', borderRadius: 2,
                  background: 'rgba(255,255,255,0.065)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  color: 'rgba(198,222,255,0.82)', fontSize: 11,
                  textDecoration: 'none',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.13)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.065)' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
