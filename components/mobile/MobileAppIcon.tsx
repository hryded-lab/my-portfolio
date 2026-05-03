'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { AppMeta, GlyphName } from './mobileApps'
import { mobileTheme as t } from './mobileTheme'

type Props = {
  app: AppMeta
  onTap: () => void
}

// Lighten / darken hex by a 0..1 amount.
function shade(hex: string, amt: number): string {
  const c = parseInt(hex.replace('#', ''), 16)
  const r0 = (c >> 16) & 0xff, g0 = (c >> 8) & 0xff, b0 = c & 0xff
  if (amt >= 0) {
    const r = Math.round(r0 + (255 - r0) * amt)
    const g = Math.round(g0 + (255 - g0) * amt)
    const b = Math.round(b0 + (255 - b0) * amt)
    return `rgb(${r}, ${g}, ${b})`
  }
  const k = 1 + amt
  return `rgb(${Math.round(r0 * k)}, ${Math.round(g0 * k)}, ${Math.round(b0 * k)})`
}

export default function MobileAppIcon({ app, onTap }: Props) {
  const top    = shade(app.color, 0.32)
  const mid    = app.color
  const bottom = shade(app.color, -0.42)
  const glow   = `${app.color}66`

  // Prefer a real PNG from /public/icons/{id}.png if present; fall back to SVG.
  const [imageOk, setImageOk] = useState(true)

  return (
    <motion.button
      // Use framer-motion's gesture-aware onTap rather than onClick. The
      // parent grid is wrapped in a `<motion.div drag="x">` for page swipes,
      // and that drag handler can swallow plain DOM click events on touch
      // devices when its gesture state is ambiguous. onTap fires through
      // the same gesture system, so taps work reliably under the drag parent.
      onTap={onTap}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        fontFamily: t.fontUi,
        width: '100%',
      }}
    >
      {imageOk ? (
        // Real image path — sliced from /mobile_icons.png by scripts/slice-mobile-icons.mjs
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/icons/${app.id}.png`}
          alt={app.label}
          onError={() => setImageOk(false)}
          draggable={false}
          style={{
            width: 44, height: 44,
            display: 'block',
            objectFit: 'contain',
            filter: `drop-shadow(0 4px 9px ${glow}) drop-shadow(0 1.5px 3px rgba(0,0,0,0.26))`,
          }}
        />
      ) : (
      <div
        style={{
          width: 44, height: 44,
          borderRadius: 12,
          position: 'relative',
          background: `linear-gradient(180deg, ${top} 0%, ${mid} 48%, ${bottom} 100%)`,
          boxShadow: [
            `0 8px 22px ${glow}`,
            `0 2px 6px rgba(0,0,0,0.35)`,
            'inset 0 1.4px 0 rgba(255,255,255,0.62)',
            'inset 0 -2px 6px rgba(0,0,0,0.28)',
            'inset 0 0 0 1px rgba(255,255,255,0.18)',
          ].join(', '),
          overflow: 'hidden',
        }}
      >
        {/* Gloss sheen */}
        <div
          style={{
            position: 'absolute',
            top: 1, left: 4, right: 4,
            height: '52%',
            borderRadius: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.10) 70%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Specular pinpoint */}
        <div
          style={{
            position: 'absolute',
            top: 5, right: 9,
            width: 6, height: 4,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            filter: 'blur(0.4px)',
            pointerEvents: 'none',
          }}
        />

        {/* Glyph illustration — sits above gloss */}
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            filter: 'drop-shadow(0 1.5px 2px rgba(0,0,0,0.4))',
          }}
        >
          <Glyph name={app.id} accent={shade(app.color, -0.55)} base={app.color} />
        </div>
      </div>
      )}

      <span
        style={{
          fontSize: 10.5,
          fontWeight: 500,
          color: '#fff',
          textShadow: '0 1px 5px rgba(0,15,55,0.9)',
          letterSpacing: 0.1,
          lineHeight: 1.2,
          textAlign: 'center',
          maxWidth: 76,
          whiteSpace: 'normal',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {app.label}
      </span>
    </motion.button>
  )
}

// ── Detailed icon illustrations ─────────────────────────────────────────────
// Each glyph uses multiple layers, gradients, highlights and shadows to read
// as a real iOS-style icon rather than a stack of flat shapes.

function Glyph({ name, accent, base }: { name: GlyphName; accent: string; base: string }) {
  switch (name) {
    case 'about':       return <AboutGlyph base={base} />
    case 'experience':  return <ExperienceGlyph />
    case 'projects':    return <ProjectsGlyph accent={accent} />
    case 'skills':      return <SkillsGlyph />
    case 'resume':      return <ResumeGlyph accent={accent} />
    case 'blog':        return <BlogGlyph />
    case 'contact':     return <ContactGlyph />
    case 'restart':     return <RestartGlyph />
    case 'notes':       return <NotesGlyph />
    case 'terminal':    return <TerminalGlyph />
    case 'paint':       return <PaintGlyph />
    case 'browser':     return <BrowserGlyph />
    case 'media':       return <MediaGlyph />
    case 'minesweeper': return <MinesweeperGlyph />
    case 'minecraft':   return <MinecraftGlyph />
    case 'clock':       return <ClockGlyph />
  }
}

// 1. ABOUT — Memoji-style avatar with hair, face shading, shoulders
function AboutGlyph({ base }: { base: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="a-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff1de" />
          <stop offset="100%" stopColor="#ffd9b3" />
        </linearGradient>
        <linearGradient id="a-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2820" />
          <stop offset="100%" stopColor="#1e120c" />
        </linearGradient>
        <linearGradient id="a-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(base, 0.45)} />
          <stop offset="100%" stopColor={shade(base, -0.3)} />
        </linearGradient>
      </defs>
      {/* Shirt / shoulders */}
      <path d="M5 36c0-5 5.6-9 15-9s15 4 15 9v4H5z" fill="url(#a-shirt)" />
      <path d="M5 36c0-5 5.6-9 15-9s15 4 15 9" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" fill="none" />
      {/* Neck */}
      <rect x="17.5" y="22" width="5" height="6" fill="url(#a-skin)" />
      <path d="M17.5 24h5" stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" />
      {/* Face */}
      <ellipse cx="20" cy="17" rx="7" ry="8" fill="url(#a-skin)" />
      {/* Hair top swoop */}
      <path d="M13 14c0-5 3.5-8 7-8s7 3 7 8c-1.5-1-3.5-1.5-5-1-2 .5-3 2-5 1.5-1.5-.4-3-.4-4-.5z" fill="url(#a-hair)" />
      <path d="M14 13c1.4-3 4-4.5 6-4.5" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
      {/* Eyebrows */}
      <path d="M16 15.5c.7-.4 1.7-.4 2.4 0M21.6 15.5c.7-.4 1.7-.4 2.4 0" stroke="#1e120c" strokeWidth="0.8" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="17.2" cy="17.5" rx="0.9" ry="1.1" fill="#1e120c" />
      <ellipse cx="22.8" cy="17.5" rx="0.9" ry="1.1" fill="#1e120c" />
      <circle cx="17.5" cy="17.2" r="0.3" fill="#fff" />
      <circle cx="23.1" cy="17.2" r="0.3" fill="#fff" />
      {/* Cheeks */}
      <ellipse cx="14.8" cy="19.5" rx="1.2" ry="0.8" fill="#ffb3a3" opacity="0.55" />
      <ellipse cx="25.2" cy="19.5" rx="1.2" ry="0.8" fill="#ffb3a3" opacity="0.55" />
      {/* Smile */}
      <path d="M17.5 21.3c.8.8 4.2.8 5 0" stroke="#5a3320" strokeWidth="0.85" strokeLinecap="round" fill="none" />
      {/* Face highlight */}
      <ellipse cx="17" cy="14.5" rx="2.5" ry="1.2" fill="rgba(255,255,255,0.45)" />
    </svg>
  )
}

// 2. EXPERIENCE — Leather briefcase with brass clasp and stitching
function ExperienceGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="e-leather" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3a22" />
          <stop offset="50%" stopColor="#3e2614" />
          <stop offset="100%" stopColor="#251407" />
        </linearGradient>
        <linearGradient id="e-handle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2412" />
          <stop offset="100%" stopColor="#1e1208" />
        </linearGradient>
        <linearGradient id="e-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe7a3" />
          <stop offset="50%" stopColor="#e8b850" />
          <stop offset="100%" stopColor="#8a6618" />
        </linearGradient>
      </defs>
      {/* Handle */}
      <path d="M14 11c0-3.5 2.7-5 6-5s6 1.5 6 5v3" stroke="url(#e-handle)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M14 11c0-3 2.4-4.5 6-4.5" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
      {/* Body */}
      <rect x="5" y="13" width="30" height="22" rx="2.5" fill="url(#e-leather)" />
      {/* Top edge highlight */}
      <rect x="5.5" y="13.5" width="29" height="1.2" rx="0.6" fill="rgba(255,255,255,0.18)" />
      {/* Stitching */}
      <rect x="6.6" y="14.6" width="26.8" height="18.8" rx="1.5" fill="none" stroke="rgba(255,225,180,0.38)" strokeWidth="0.5" strokeDasharray="1 1.2" />
      {/* Center divider seam */}
      <line x1="5" y1="22" x2="35" y2="22" stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" />
      {/* Brass clasp */}
      <rect x="16" y="20.3" width="8" height="3.4" rx="0.6" fill="url(#e-brass)" stroke="#5a3a0a" strokeWidth="0.3" />
      <rect x="18.4" y="21.3" width="3.2" height="1.4" rx="0.3" fill="#5a3a0a" />
      {/* Side studs */}
      <circle cx="9" cy="22" r="0.7" fill="url(#e-brass)" />
      <circle cx="31" cy="22" r="0.7" fill="url(#e-brass)" />
      {/* Bottom shadow */}
      <rect x="5" y="32" width="30" height="3" fill="rgba(0,0,0,0.35)" />
    </svg>
  )
}

// 3. PROJECTS — Stacked papers with binder clip, fanned out
function ProjectsGlyph({ accent }: { accent: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="p-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbe2ec" />
        </linearGradient>
        <linearGradient id="p-clip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a44" />
          <stop offset="100%" stopColor="#0e0e14" />
        </linearGradient>
      </defs>
      {/* Back paper, rotated */}
      <g transform="rotate(-7 20 22)">
        <rect x="6" y="9" width="24" height="28" rx="1.5" fill="#c3ccd8" />
      </g>
      {/* Mid paper */}
      <g transform="rotate(3 20 22)">
        <rect x="7" y="8" width="24" height="28" rx="1.5" fill="#dde4ed" />
      </g>
      {/* Front paper */}
      <rect x="8" y="7" width="24" height="28" rx="1.5" fill="url(#p-paper)" />
      <rect x="8" y="7" width="24" height="28" rx="1.5" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.4" />
      {/* Lines on front */}
      <rect x="11.5" y="13" width="13" height="1.2" rx="0.4" fill={accent} opacity="0.85" />
      <rect x="11.5" y="16" width="17" height="0.9" rx="0.3" fill="#475061" opacity="0.55" />
      <rect x="11.5" y="18.5" width="13" height="0.9" rx="0.3" fill="#475061" opacity="0.55" />
      <rect x="11.5" y="21" width="15" height="0.9" rx="0.3" fill="#475061" opacity="0.55" />
      <rect x="11.5" y="25" width="9" height="2" rx="0.4" fill={accent} opacity="0.55" />
      {/* Binder clip */}
      <rect x="16" y="4" width="8" height="6" rx="0.7" fill="url(#p-clip)" />
      <rect x="17.4" y="5.4" width="5.2" height="1.4" rx="0.4" fill="rgba(255,255,255,0.32)" />
      <path d="M16 7l-2.5 1M24 7l2.5 1" stroke="#0e0e14" strokeWidth="0.8" strokeLinecap="round" />
      {/* Page corner shadow */}
      <path d="M28 7l4 4-4 0z" fill="rgba(0,0,0,0.18)" />
    </svg>
  )
}

// 4. SKILLS — Toolbox with hammer + wrench protruding, crisp metal
function SkillsGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="s-box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e85a4a" />
          <stop offset="100%" stopColor="#a02d24" />
        </linearGradient>
        <linearGradient id="s-handle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2818" />
          <stop offset="100%" stopColor="#1c100a" />
        </linearGradient>
        <linearGradient id="s-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f6fa" />
          <stop offset="50%" stopColor="#b8bfc9" />
          <stop offset="100%" stopColor="#5d6470" />
        </linearGradient>
      </defs>
      {/* Hammer (back layer, rotated) */}
      <g transform="rotate(-22 20 18)">
        <rect x="18" y="8" width="2.4" height="14" rx="0.4" fill="url(#s-handle)" />
        <rect x="13" y="6" width="12" height="4.5" rx="0.6" fill="url(#s-metal)" />
        <rect x="13" y="6" width="12" height="1" fill="rgba(255,255,255,0.4)" />
      </g>
      {/* Wrench (back layer, rotated other way) */}
      <g transform="rotate(28 20 18)">
        <rect x="18.5" y="9" width="2.4" height="14" rx="0.5" fill="url(#s-metal)" />
        <circle cx="19.7" cy="8.5" r="3.2" fill="url(#s-metal)" />
        <circle cx="19.7" cy="8.5" r="1.6" fill="#1f2530" />
      </g>
      {/* Toolbox body — front */}
      <rect x="5" y="20" width="30" height="14" rx="2" fill="url(#s-box)" />
      {/* Toolbox top edge highlight */}
      <rect x="5.5" y="20.5" width="29" height="1.4" rx="0.7" fill="rgba(255,255,255,0.4)" />
      {/* Toolbox latch */}
      <rect x="17.5" y="19" width="5" height="3" rx="0.5" fill="url(#s-metal)" />
      <rect x="18.5" y="19.6" width="3" height="1" rx="0.3" fill="#1f2530" />
      {/* Toolbox lid line */}
      <line x1="5.5" y1="24" x2="34.5" y2="24" stroke="rgba(0,0,0,0.32)" strokeWidth="0.6" />
      {/* Side handles */}
      <rect x="6.5" y="26" width="2.4" height="1.2" rx="0.4" fill="rgba(0,0,0,0.4)" />
      <rect x="31" y="26" width="2.4" height="1.2" rx="0.4" fill="rgba(0,0,0,0.4)" />
      {/* Bottom shadow */}
      <rect x="5" y="32" width="30" height="2" fill="rgba(0,0,0,0.32)" />
    </svg>
  )
}

// 5. RESUME — Document with embossed star seal and ribbon
function ResumeGlyph({ accent }: { accent: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="r-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8edf4" />
        </linearGradient>
        <radialGradient id="r-seal" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffe8a2" />
          <stop offset="60%" stopColor="#e2a83a" />
          <stop offset="100%" stopColor="#7a5008" />
        </radialGradient>
      </defs>
      {/* Back shadow page */}
      <rect x="8" y="6" width="24" height="30" rx="1.5" fill="rgba(0,0,0,0.18)" transform="translate(2 1)" />
      {/* Paper */}
      <path d="M8 5h17l7 7v23.5a1 1 0 01-1 1H8z" fill="url(#r-paper)" />
      <path d="M8 5h17l7 7v23.5a1 1 0 01-1 1H8z" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
      {/* Folded corner */}
      <path d="M25 5v7h7L25 5z" fill="#cbd2dd" />
      <path d="M25 5v7h7" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.5" />
      {/* Header bar */}
      <rect x="11" y="9" width="11" height="1.6" rx="0.5" fill={accent} />
      {/* Lines */}
      <rect x="11" y="14"   width="18" height="1" rx="0.3" fill="#475061" opacity="0.45" />
      <rect x="11" y="16.5" width="14" height="1" rx="0.3" fill="#475061" opacity="0.45" />
      <rect x="11" y="19"   width="17" height="1" rx="0.3" fill="#475061" opacity="0.45" />
      <rect x="11" y="22"   width="13" height="1" rx="0.3" fill="#475061" opacity="0.45" />
      {/* Gold seal */}
      <circle cx="26" cy="29" r="4.3" fill="url(#r-seal)" stroke="#5a3e08" strokeWidth="0.5" />
      <circle cx="26" cy="29" r="3" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.4" strokeDasharray="0.8 0.6" />
      <path d="M26 26.7l.74 1.5 1.66.24-1.2 1.16.28 1.64L26 30.46l-1.48.78.28-1.64-1.2-1.16 1.66-.24z" fill="#fff8de" />
      {/* Ribbon */}
      <path d="M23 33l1.6 4 1.4-2 1.4 2 1.6-4z" fill="#c33" />
      <path d="M23 33l3 1 3-1" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" fill="none" />
    </svg>
  )
}

// 6. BLOG — Open hardcover book with pages and red bookmark
function BlogGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="b-cover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4d6e" />
          <stop offset="100%" stopColor="#1c2438" />
        </linearGradient>
        <linearGradient id="b-page" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6ecf3" />
        </linearGradient>
      </defs>
      {/* Back cover (right) */}
      <path d="M20 8c2-1.5 7-2.5 14-1v25c-7-1.5-12-.5-14 1z" fill="url(#b-cover)" />
      {/* Back cover (left) */}
      <path d="M20 8c-2-1.5-7-2.5-14-1v25c7-1.5 12-.5 14 1z" fill="url(#b-cover)" />
      {/* Pages right */}
      <path d="M20 9.5c2-1.2 6-2.2 13-.8v23c-7-1.4-11-.4-13 .8z" fill="url(#b-page)" />
      {/* Pages left */}
      <path d="M20 9.5c-2-1.2-6-2.2-13-.8v23c7-1.4 11-.4 13 .8z" fill="url(#b-page)" />
      {/* Spine */}
      <line x1="20" y1="9.5" x2="20" y2="32.5" stroke="rgba(0,0,0,0.32)" strokeWidth="0.7" />
      {/* Lines on right page */}
      <rect x="22" y="14" width="9" height="0.8" rx="0.3" fill="#5a6378" opacity="0.55" />
      <rect x="22" y="16" width="11" height="0.8" rx="0.3" fill="#5a6378" opacity="0.55" />
      <rect x="22" y="18" width="9" height="0.8" rx="0.3" fill="#5a6378" opacity="0.55" />
      <rect x="22" y="20" width="10" height="0.8" rx="0.3" fill="#5a6378" opacity="0.55" />
      {/* Lines on left page */}
      <rect x="9"  y="14" width="9" height="0.8" rx="0.3" fill="#5a6378" opacity="0.55" />
      <rect x="9"  y="16" width="10" height="0.8" rx="0.3" fill="#5a6378" opacity="0.55" />
      <rect x="9"  y="18" width="9" height="0.8" rx="0.3" fill="#5a6378" opacity="0.55" />
      <rect x="9"  y="20" width="11" height="0.8" rx="0.3" fill="#5a6378" opacity="0.55" />
      {/* Bookmark */}
      <path d="M27 7v10l-2-1.6-2 1.6V7" fill="#e94f4f" />
      <path d="M27 7v10l-2-1.6-2 1.6V7" fill="none" stroke="#7a1f1f" strokeWidth="0.4" />
      {/* Top page edge highlight */}
      <path d="M7 8.5c6-1.5 11-1 13 .5 2-1.5 7-2 13-.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" fill="none" />
    </svg>
  )
}

// 7. CONTACT — Open envelope with letter peeking out
function ContactGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="c-env" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d3dae3" />
        </linearGradient>
        <linearGradient id="c-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f4fa" />
          <stop offset="100%" stopColor="#aab2bf" />
        </linearGradient>
      </defs>
      {/* Body */}
      <rect x="5" y="11" width="30" height="22" rx="2" fill="url(#c-env)" />
      {/* Letter peeking */}
      <rect x="9" y="9" width="22" height="14" rx="1" fill="#fff" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" />
      <rect x="11" y="13" width="14" height="0.9" rx="0.3" fill="#475061" opacity="0.45" />
      <rect x="11" y="15" width="18" height="0.9" rx="0.3" fill="#475061" opacity="0.45" />
      <rect x="11" y="17" width="14" height="0.9" rx="0.3" fill="#475061" opacity="0.45" />
      <rect x="11" y="19" width="10" height="0.9" rx="0.3" fill="#475061" opacity="0.45" />
      {/* Front V flap (open) */}
      <path d="M5 11l15 11 15-11v22H5z" fill="url(#c-env)" />
      <path d="M5 33l15-12 15 12" stroke="rgba(0,0,0,0.22)" strokeWidth="0.5" fill="none" />
      {/* Top crease */}
      <path d="M5 11l15 11 15-11" stroke="rgba(0,0,0,0.32)" strokeWidth="0.5" fill="none" />
      {/* Notification bubble */}
      <circle cx="31" cy="9" r="5.2" fill="#ff5e4e" stroke="#fff" strokeWidth="1" />
      <text x="31" y="11.6" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#fff" fontFamily="system-ui">@</text>
    </svg>
  )
}

// 8. RESTART — Chrome power button with circular arrow
function RestartGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <radialGradient id="rs-base" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#cdd5e0" />
          <stop offset="100%" stopColor="#5a6473" />
        </radialGradient>
        <linearGradient id="rs-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#aab2bf" />
        </linearGradient>
      </defs>
      {/* Outer chrome ring */}
      <circle cx="20" cy="20" r="14" fill="url(#rs-ring)" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
      {/* Recess */}
      <circle cx="20" cy="20" r="11.5" fill="url(#rs-base)" />
      {/* Reload arrow */}
      <path
        d="M28.6 20a8.6 8.6 0 11-2.6-6.1"
        stroke="#222a36" strokeWidth="2.4" strokeLinecap="round" fill="none"
      />
      <path
        d="M28.6 11.5v4.6h-4.6"
        stroke="#222a36" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* Highlight */}
      <path d="M14 13a8.6 8.6 0 014-3" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// 9. NOTES — Yellow legal pad with red top, rings, pencil
function NotesGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="n-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff5b8" />
          <stop offset="100%" stopColor="#f6dc6e" />
        </linearGradient>
        <linearGradient id="n-pencil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd166" />
          <stop offset="100%" stopColor="#c98e1a" />
        </linearGradient>
      </defs>
      {/* Back shadow page */}
      <rect x="9" y="7" width="22" height="28" rx="1.5" fill="rgba(0,0,0,0.18)" transform="translate(1 1)" />
      {/* Paper body */}
      <rect x="8" y="6" width="22" height="28" rx="1.5" fill="url(#n-paper)" stroke="#c8a635" strokeWidth="0.4" />
      {/* Red header */}
      <rect x="8" y="6" width="22" height="4" rx="1.5" fill="#d94a4a" />
      <rect x="8" y="9.5" width="22" height="0.6" fill="rgba(0,0,0,0.25)" />
      {/* Spiral rings */}
      {[10, 14.5, 19, 23.5, 28].map((y, i) => (
        <ellipse key={i} cx="11" cy={y} rx="1.5" ry="0.9" fill="#9aa1ad" />
      ))}
      {/* Lines */}
      <rect x="14" y="14" width="13" height="0.7" rx="0.3" fill="#a48a3a" opacity="0.7" />
      <rect x="14" y="16.5" width="11" height="0.7" rx="0.3" fill="#a48a3a" opacity="0.7" />
      <rect x="14" y="19" width="13" height="0.7" rx="0.3" fill="#a48a3a" opacity="0.7" />
      <rect x="14" y="21.5" width="9" height="0.7" rx="0.3" fill="#a48a3a" opacity="0.7" />
      <rect x="14" y="24" width="11" height="0.7" rx="0.3" fill="#a48a3a" opacity="0.7" />
      {/* Pencil */}
      <g transform="rotate(28 30 24)">
        <rect x="29" y="13" width="2.4" height="13" fill="url(#n-pencil)" />
        <rect x="29" y="13" width="2.4" height="1.5" fill="#ffe7a3" />
        <path d="M29 26l1.2 2 1.2-2z" fill="#1f2a38" />
        <rect x="29" y="11" width="2.4" height="2" fill="#e94f4f" />
        <rect x="29" y="10.4" width="2.4" height="0.7" fill="#aaa" />
      </g>
    </svg>
  )
}

// 10. TERMINAL — Vintage CRT with bezel and green prompt
function TerminalGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="t-bezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4250" />
          <stop offset="100%" stopColor="#0e1118" />
        </linearGradient>
        <radialGradient id="t-screen" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#103820" />
          <stop offset="100%" stopColor="#020a05" />
        </radialGradient>
      </defs>
      {/* Bezel */}
      <rect x="4" y="6" width="32" height="24" rx="2.6" fill="url(#t-bezel)" />
      <rect x="4" y="6" width="32" height="2" rx="2.6" fill="rgba(255,255,255,0.18)" />
      {/* Screen */}
      <rect x="6.5" y="9" width="27" height="18" rx="1.4" fill="url(#t-screen)" />
      {/* Scanlines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x="6.5" y={9.5 + i * 2.2} width="27" height="0.6" fill="rgba(63,255,140,0.06)" />
      ))}
      {/* Prompt arrow */}
      <path d="M9 14.5l3 2.4-3 2.4" stroke="#3fff8a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="13.4" y="18" width="6" height="1.4" rx="0.4" fill="#3fff8a" />
      {/* Cursor */}
      <rect x="20.4" y="18" width="1.6" height="1.4" fill="#3fff8a" opacity="0.7" />
      {/* Stand */}
      <rect x="14" y="30" width="12" height="2.4" rx="0.4" fill="url(#t-bezel)" />
      <rect x="11" y="32" width="18" height="2" rx="0.6" fill="url(#t-bezel)" />
    </svg>
  )
}

// 11. PAINT — Wooden palette with realistic paint blobs and brush
function PaintGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="pt-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dca570" />
          <stop offset="100%" stopColor="#7a5430" />
        </linearGradient>
        <radialGradient id="pt-blob1" cx="40%" cy="40%" r="60%"><stop offset="0%" stopColor="#ff9a8d" /><stop offset="100%" stopColor="#c63a2c" /></radialGradient>
        <radialGradient id="pt-blob2" cx="40%" cy="40%" r="60%"><stop offset="0%" stopColor="#ffe9a8" /><stop offset="100%" stopColor="#d4a008" /></radialGradient>
        <radialGradient id="pt-blob3" cx="40%" cy="40%" r="60%"><stop offset="0%" stopColor="#a8d4ff" /><stop offset="100%" stopColor="#1f6dc7" /></radialGradient>
        <radialGradient id="pt-blob4" cx="40%" cy="40%" r="60%"><stop offset="0%" stopColor="#bdf0c6" /><stop offset="100%" stopColor="#2c8a40" /></radialGradient>
      </defs>
      {/* Palette */}
      <path d="M20 5C11 5 4 11 4 19s5 14 13 14c1.7 0 1.9-1.4 1.4-2.6-.8-1.7.4-3 1.7-3h2.5c5 0 9-4 9-9C32 11 27 5 20 5z" fill="url(#pt-wood)" />
      <path d="M20 5C11 5 4 11 4 19" stroke="rgba(255,255,255,0.36)" strokeWidth="0.6" strokeLinecap="round" fill="none" />
      {/* Thumb hole */}
      <ellipse cx="20.5" cy="22" rx="2.6" ry="2" fill="#3a2614" />
      {/* Paint blobs */}
      <circle cx="9.5"  cy="17" r="2.4" fill="url(#pt-blob1)" />
      <circle cx="13"   cy="11" r="2"   fill="url(#pt-blob2)" />
      <circle cx="20"   cy="9"  r="2.2" fill="url(#pt-blob3)" />
      <circle cx="26"   cy="12" r="2"   fill="url(#pt-blob4)" />
      <circle cx="9.5"  cy="17" r="0.7" fill="#fff" opacity="0.6" />
      <circle cx="13"   cy="11" r="0.6" fill="#fff" opacity="0.7" />
      {/* Brush */}
      <g transform="rotate(38 28 26)">
        <rect x="27" y="14" width="2.2" height="11" fill="#7a4a2a" />
        <rect x="27" y="14" width="2.2" height="11" fill="url(#pt-wood)" opacity="0.6" />
        <rect x="26.4" y="24" width="3.4" height="2" fill="#9aa1ad" />
        <path d="M26.6 26h3.2l-.6 3.4h-2z" fill="#ff7ec5" />
      </g>
    </svg>
  )
}

// 12. BROWSER — 3D globe with grid and continent shapes
function BrowserGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <radialGradient id="br-globe" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#bbe5ff" />
          <stop offset="60%" stopColor="#3a8eff" />
          <stop offset="100%" stopColor="#0c2a5a" />
        </radialGradient>
      </defs>
      {/* Globe body */}
      <circle cx="20" cy="20" r="14" fill="url(#br-globe)" />
      {/* Latitude lines */}
      <ellipse cx="20" cy="20" rx="14" ry="6"  fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
      <ellipse cx="20" cy="20" rx="14" ry="11" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
      {/* Longitude lines */}
      <ellipse cx="20" cy="20" rx="6"  ry="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
      <ellipse cx="20" cy="20" rx="11" ry="14" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
      <line x1="6" y1="20" x2="34" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
      <line x1="20" y1="6" x2="20" y2="34" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
      {/* Continent silhouettes */}
      <path d="M11 14c2-1 4 0 5 .5s1.5 2 0 3c-1.6 1-4 .5-5-.5z" fill="#8de08a" opacity="0.85" />
      <path d="M22 11c1.5-.5 3.5 0 4 1.5s-1 3-2.5 3-3-1-3-2.5z" fill="#8de08a" opacity="0.85" />
      <path d="M16 22c2 0 5 .5 6 2.5s-1.5 4-4 4c-2.5 0-3.5-2-2-6z" fill="#8de08a" opacity="0.85" />
      {/* Specular highlight */}
      <ellipse cx="14" cy="13" rx="3.5" ry="2" fill="rgba(255,255,255,0.55)" />
    </svg>
  )
}

// 13. MEDIA — Vinyl record with grooves, label and reflection
function MediaGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <radialGradient id="m-vinyl" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#1a1f2a" />
          <stop offset="60%"  stopColor="#0a0d18" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <radialGradient id="m-label" cx="50%" cy="40%" r="60%">
          <stop offset="0%"  stopColor="#ff8b7a" />
          <stop offset="100%" stopColor="#c63a2c" />
        </radialGradient>
      </defs>
      {/* Disc */}
      <circle cx="20" cy="20" r="14.5" fill="url(#m-vinyl)" />
      <circle cx="20" cy="20" r="14.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" />
      {/* Concentric grooves */}
      {[12, 10, 8.5, 7].map((r, i) => (
        <circle key={i} cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
      ))}
      {/* Label */}
      <circle cx="20" cy="20" r="5" fill="url(#m-label)" />
      <circle cx="20" cy="20" r="5" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.4" />
      {/* Spindle */}
      <circle cx="20" cy="20" r="0.9" fill="#0a0d18" />
      {/* Highlight sweep */}
      <path d="M9 11a16 16 0 0114-2" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M9 14a13 13 0 0110-3" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// 14. MINESWEEPER — Smiley + bomb sticker
function MinesweeperGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <radialGradient id="ms-face" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffec70" />
          <stop offset="100%" stopColor="#c89000" />
        </radialGradient>
        <radialGradient id="ms-bomb" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#5a6473" />
          <stop offset="100%" stopColor="#0e1118" />
        </radialGradient>
      </defs>
      {/* Face */}
      <circle cx="19" cy="20" r="12" fill="url(#ms-face)" stroke="#7a4d00" strokeWidth="0.7" />
      {/* Highlight */}
      <ellipse cx="14" cy="14" rx="3.5" ry="2.4" fill="rgba(255,255,255,0.5)" />
      {/* Eyes */}
      <circle cx="14.6" cy="18" r="1.6" fill="#1f2a38" />
      <circle cx="23.4" cy="18" r="1.6" fill="#1f2a38" />
      <circle cx="14.9" cy="17.6" r="0.45" fill="#fff" />
      <circle cx="23.7" cy="17.6" r="0.45" fill="#fff" />
      {/* Smile */}
      <path d="M13 24c2 2.6 10 2.6 12 0" stroke="#5a3608" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M14 24c1.8 1.6 8 1.6 10 0" fill="#7a1f1f" opacity="0.45" />
      {/* Bomb sticker */}
      <circle cx="29" cy="9" r="4.5" fill="url(#ms-bomb)" stroke="#fff" strokeWidth="1.2" />
      <ellipse cx="27" cy="7" rx="1" ry="0.7" fill="rgba(255,255,255,0.5)" />
      {/* Fuse */}
      <path d="M30 5l1.6-1.6" stroke="#fff" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="32" cy="3.4" r="0.9" fill="#ff5e4e" />
    </svg>
  )
}

// 15. MINECRAFT — 3D iso grass block, refined
function MinecraftGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="mc-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7eda58" />
          <stop offset="100%" stopColor="#3e8624" />
        </linearGradient>
        <linearGradient id="mc-side-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9c6638" />
          <stop offset="100%" stopColor="#553410" />
        </linearGradient>
        <linearGradient id="mc-side-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a4f28" />
          <stop offset="100%" stopColor="#3a200a" />
        </linearGradient>
      </defs>
      {/* Top face */}
      <path d="M5 13l15-7 15 7-15 7z" fill="url(#mc-top)" />
      <path d="M5 13l15-7 15 7" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" fill="none" />
      {/* Left face */}
      <path d="M5 13v13l15 7V20z" fill="url(#mc-side-l)" />
      {/* Right face */}
      <path d="M35 13v13l-15 7V20z" fill="url(#mc-side-r)" />
      {/* Top grass speckles */}
      <circle cx="14" cy="11" r="0.5" fill="#a8e87a" />
      <circle cx="22" cy="13" r="0.5" fill="#a8e87a" />
      <circle cx="27" cy="10" r="0.4" fill="#a8e87a" />
      <circle cx="18" cy="14" r="0.4" fill="#a8e87a" />
      {/* Dirt clumps left */}
      <rect x="8" y="20" width="2.4" height="2.4" fill="#3a200a" opacity="0.7" />
      <rect x="13" y="25" width="1.8" height="1.8" fill="#3a200a" opacity="0.7" />
      <rect x="16" y="28" width="1.4" height="1.4" fill="#3a200a" opacity="0.7" />
      {/* Dirt clumps right */}
      <rect x="29" y="22" width="1.8" height="1.8" fill="#1c0e02" opacity="0.6" />
      <rect x="24" y="26" width="1.4" height="1.4" fill="#1c0e02" opacity="0.6" />
      {/* Edge highlight */}
      <path d="M5 13l15 7 15-7" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" fill="none" />
    </svg>
  )
}

// 16. CLOCK — Analog face with glass shine and hands at 10:10
function ClockGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <defs>
        <radialGradient id="ck-face" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cdd5e0" />
        </radialGradient>
        <linearGradient id="ck-bezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4250" />
          <stop offset="100%" stopColor="#0e1118" />
        </linearGradient>
      </defs>
      {/* Outer bezel */}
      <circle cx="20" cy="20" r="14" fill="url(#ck-bezel)" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
      {/* Face */}
      <circle cx="20" cy="20" r="11.5" fill="url(#ck-face)" />
      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = i * 30
        const isMajor = i % 3 === 0
        const r1 = 11
        const r2 = isMajor ? 8.5 : 9.5
        const rad = ((a - 90) * Math.PI) / 180
        return (
          <line
            key={i}
            x1={20 + Math.cos(rad) * r1} y1={20 + Math.sin(rad) * r1}
            x2={20 + Math.cos(rad) * r2} y2={20 + Math.sin(rad) * r2}
            stroke="#1f2a38" strokeWidth={isMajor ? 1.4 : 0.7}
          />
        )
      })}
      {/* Hour hand at 10 */}
      <line x1="20" y1="20" x2="14.5" y2="14.5" stroke="#1f2a38" strokeWidth="2" strokeLinecap="round" />
      {/* Minute hand at 2 */}
      <line x1="20" y1="20" x2="26" y2="13.5" stroke="#1f2a38" strokeWidth="1.6" strokeLinecap="round" />
      {/* Second hand */}
      <line x1="20" y1="20" x2="20" y2="11" stroke="#e94f4f" strokeWidth="0.8" strokeLinecap="round" />
      {/* Center pin */}
      <circle cx="20" cy="20" r="1.4" fill="#1f2a38" />
      <circle cx="20" cy="20" r="0.6" fill="#e94f4f" />
      {/* Glass shine arc */}
      <path d="M11 14a13 13 0 0110-4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M11 18a11 11 0 015-7" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" strokeLinecap="round" fill="none" />
    </svg>
  )
}
