'use client'

import { useState, useEffect, useRef } from 'react'
import { useWindowManager, type WindowId, WINDOWS } from '@/lib/windowManager'
import StartMenu from './StartMenu'
import SysTrayBalloon from './SysTrayBalloon'
import { setSoundsEnabled, getSoundsEnabled, playClick } from '@/lib/sounds'
import { useTheme } from '@/lib/themeContext'

// ── Exact XP Luna blue taskbar gradient ───────────────────────────────────────
const TASKBAR_BG = [
  'linear-gradient(to bottom,',
  '  #5080d8 0%,',      // bright top highlight
  '  #3a68cc 1%,',
  '  #2b5dbf 3%,',
  '  #245ab8 6%,',
  '  #1f54b2 49%,',     // midpoint color shift (XP characteristic)
  '  #1a4daa 50%,',
  '  #1648a3 96%,',
  '  #0d3a90 100%',
  ')',
].join('')

const SYSTRAY_BG = [
  'linear-gradient(to bottom,',
  '  #3a62b8 0%,',
  '  #2550a8 3%,',
  '  #1e4aa0 50%,',
  '  #183e96 50%,',
  '  #122e80 100%',
  ')',
].join('')

export default function Taskbar({ onShutdown }: { onShutdown?: () => void }) {
  const { windows, focusWindow, restoreWindow, minimizeWindow, activeWindowId } = useWindowManager()
  const { t, toggle: toggleTheme } = useTheme()
  const [startOpen, setStartOpen] = useState(false)
  const [soundsOn, setSoundsOn] = useState(getSoundsEnabled())
  const [showVolTooltip, setShowVolTooltip] = useState(false)
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  // Battery API
  useEffect(() => {
    if (typeof navigator === 'undefined') return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any
    if (!nav.getBattery) return
    nav.getBattery().then((b: { level: number; charging: boolean; addEventListener(t: string, fn: () => void): void }) => {
      const update = () => setBattery({ level: Math.round(b.level * 100), charging: b.charging })
      update()
      b.addEventListener('levelchange', update)
      b.addEventListener('chargingchange', update)
    })
  }, [])

  const openWindows = (Object.values(windows) as Array<typeof windows[WindowId]>).filter(w => w.isOpen)

  const handleTaskbarClick = (id: WindowId) => {
    const w = windows[id]
    if (w.isMinimized) {
      restoreWindow(id)
    } else if (activeWindowId === id) {
      minimizeWindow(id)
    } else {
      focusWindow(id)
    }
  }

  const toggleSounds = () => {
    const next = !soundsOn
    setSoundsOn(next)
    setSoundsEnabled(next)
    if (next) playClick()
  }

  return (
    <>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} onShutdown={onShutdown} />}
      <SysTrayBalloon />

      <div
        className="xp-taskbar"
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          height: 38,
          background: TASKBAR_BG,
          borderTop: '1px solid #0a2878',
          display: 'flex',
          alignItems: 'center',
          zIndex: 99999,
          boxShadow: '0 -1px 0 #7aaaf0 inset, 0 -2px 6px rgba(0,0,0,0.5)',
          userSelect: 'none',
        }}
      >
        {/* ── Start Button ── */}
        <StartButton
          onClick={() => { playClick(); setStartOpen(!startOpen) }}
          active={startOpen}
        />

        {/* ── Quick Launch area ── */}
        <DragHandle />
        <div style={{ display: 'flex', alignItems: 'center', gap: 1, padding: '0 4px' }}>
          <QuickLaunchBtn title="Show Desktop" onClick={() => {
            openWindows.forEach(w => minimizeWindow(w.id))
          }}>
            {/* Show Desktop SVG icon */}
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="1" y="2" width="14" height="10" rx="1" fill="#3a7bd5" stroke="#1a3f8c" strokeWidth="0.8"/>
              <rect x="2" y="3" width="12" height="8" fill="#5b9bd5"/>
              <rect x="1" y="11" width="14" height="2" fill="#2a5fb0"/>
              <rect x="5" y="13" width="6" height="1.5" fill="#2a5fb0"/>
              <rect x="3" y="14" width="10" height="1.2" rx="0.5" fill="#1a3f8c"/>
            </svg>
          </QuickLaunchBtn>
        </div>
        <DragHandle />

        {/* ── Open window buttons ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          gap: 3, padding: '0 4px',
          overflowX: 'hidden', minWidth: 0,
        }}>
          {openWindows.map(w => (
            <TaskbarButton
              key={w.id}
              icon={WINDOWS[w.id].icon}
              label={WINDOWS[w.id].title.split('—')[0].trim()}
              active={activeWindowId === w.id && !w.isMinimized}
              onClick={() => handleTaskbarClick(w.id)}
            />
          ))}
        </div>

        {/* ── System Tray ── */}
        {/* Teardrop left edge */}
        <svg width="14" height="38" style={{ flexShrink: 0, display: 'block' }}>
          <path d="M14 0 Q0 0 0 19 Q0 38 14 38 L14 0 Z" fill="#1e4aa0"/>
          <path d="M14 0 Q2 0 2 19 Q2 38 14 38" stroke="#3a62b8" strokeWidth="0.8" fill="none"/>
        </svg>

        <div
          style={{
            height: '100%',
            padding: '0 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: SYSTRAY_BG,
            flexShrink: 0,
          }}
        >
          {/* Battery icon */}
          {battery !== null && (
            <SysTrayIcon title={`Battery: ${battery.level}%${battery.charging ? ' (charging)' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Battery body */}
                <div style={{
                  width: 14, height: 8, border: '1px solid #7ecef4', borderRadius: 2,
                  position: 'relative', display: 'flex', alignItems: 'center', padding: '1px',
                }}>
                  {/* Battery nub */}
                  <div style={{
                    position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)',
                    width: 2, height: 4, background: '#7ecef4', borderRadius: '0 1px 1px 0',
                  }} />
                  {/* Fill */}
                  <div style={{
                    height: '100%',
                    width: `${battery.level}%`,
                    background: battery.level > 20
                      ? (battery.charging ? '#4ef0a0' : '#7ecef4')
                      : '#f06060',
                    borderRadius: 1,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{ color: '#7ecef4', fontSize: 9, lineHeight: 1, minWidth: 20 }}>
                  {battery.charging ? '⚡' : ''}{battery.level}%
                </span>
              </div>
            </SysTrayIcon>
          )}

          {/* Network icon */}
          <SysTrayIcon title="Network: Connected">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="1" y="9"  width="2" height="5" fill="#7ecef4" rx="0.5"/>
              <rect x="4" y="7"  width="2" height="7" fill="#7ecef4" rx="0.5"/>
              <rect x="7" y="5"  width="2" height="9" fill="#7ecef4" rx="0.5"/>
              <rect x="10" y="3" width="2" height="11" fill="#7ecef4" rx="0.5"/>
              <rect x="13" y="1" width="2" height="13" fill="#7ecef4" rx="0.5"/>
            </svg>
          </SysTrayIcon>

          {/* Volume icon */}
          <div style={{ position: 'relative' }}>
            <SysTrayIcon
              title={soundsOn ? 'Volume — click to mute' : 'Volume muted — click to unmute'}
              onClick={toggleSounds}
              onMouseEnter={() => setShowVolTooltip(true)}
              onMouseLeave={() => setShowVolTooltip(false)}
            >
              {soundsOn ? (
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <polygon points="2,5 2,11 5,11 9,14 9,2 5,5" fill="#7ecef4"/>
                  <path d="M10.5 5.5 Q13 8 10.5 10.5" stroke="#7ecef4" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <path d="M12 3.5 Q16 8 12 12.5"   stroke="#7ecef4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <polygon points="2,5 2,11 5,11 9,14 9,2 5,5" fill="#7ecef4" opacity="0.5"/>
                  <line x1="11" y1="6" x2="15" y2="10" stroke="#f06060" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="15" y1="6" x2="11" y2="10" stroke="#f06060" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </SysTrayIcon>
            {showVolTooltip && (
              <div style={{
                position: 'absolute', bottom: 36, right: -4,
                background: '#ffffcc', border: '1px solid #808080',
                padding: '3px 7px', fontSize: 11,
                fontFamily: "'Silkscreen', 'Courier New', monospace", color: '#000',
                whiteSpace: 'nowrap', pointerEvents: 'none',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}>
                {soundsOn ? 'Click to mute' : 'Click to unmute'}
              </div>
            )}
          </div>

          {/* Calendar */}
          <CalendarWidget />

          {/* Theme toggle */}
          <SysTrayIcon title={t.mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} onClick={toggleTheme}>
            {t.mode === 'dark' ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="3" fill="#fde68a"/>
                <line x1="7" y1="0.5" x2="7" y2="2" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="7" y1="12" x2="7" y2="13.5" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="0.5" y1="7" x2="2" y2="7" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="12" y1="7" x2="13.5" y2="7" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="2.4" y1="2.4" x2="3.4" y2="3.4" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="10.6" y1="10.6" x2="11.6" y2="11.6" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="11.6" y1="2.4" x2="10.6" y2="3.4" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="3.4" y1="10.6" x2="2.4" y2="11.6" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.5 8.5A5 5 0 0 1 5.5 2.5a5 5 0 1 0 6 6z" fill="#c4b5fd"/>
              </svg>
            )}
          </SysTrayIcon>

          {/* Fullscreen toggle */}
          <SysTrayIcon title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} onClick={toggleFullscreen}>
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <polyline points="5,1 5,5 1,5" stroke="#7ecef4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9,1 9,5 13,5" stroke="#7ecef4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="5,13 5,9 1,9" stroke="#7ecef4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9,13 9,9 13,9" stroke="#7ecef4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <polyline points="1,5 1,1 5,1" stroke="#7ecef4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="13,5 13,1 9,1" stroke="#7ecef4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="1,9 1,13 5,13" stroke="#7ecef4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="13,9 13,13 9,13" stroke="#7ecef4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </SysTrayIcon>

          {/* Tray separator */}
          <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)', boxShadow: '1px 0 0 rgba(0,0,0,0.3)' }} />

          {/* Clock — isolated component so only it re-renders every second */}
          <ClockDisplay />
        </div>
      </div>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StartButton({ onClick, active }: { onClick: () => void; active: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      className="xp-start-btn"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        height: 34,
        padding: '0 16px 0 8px',
        marginLeft: 2,
        background: active
          ? 'linear-gradient(to bottom, #1a8218, #1a9a18, #1a8218)'
          : hovered
          ? 'linear-gradient(to bottom, #72e050 0%, #4ccc28 5%, #3ab818 50%, #30a810 50%, #289010 95%, #1e7808 100%)'
          : 'linear-gradient(to bottom, #68d848 0%, #46c020 5%, #32aa10 50%, #2a9c08 50%, #249008 95%, #1a7804 100%)',
        border: '1px solid rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255,255,255,0.3)',
        borderLeft: 'none',
        borderRadius: '0 10px 10px 0',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 7,
        boxShadow: active
          ? 'inset 0 2px 5px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.15)'
          : '2px 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.35)',
        flexShrink: 0,
        transition: 'background 0.08s',
      }}
    >
      {/* Windows flag logo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', width: 20, height: 20, flexShrink: 0 }}>
        <div style={{ background: 'linear-gradient(135deg, #f44 60%, #c00)', borderRadius: '3px 0 0 0' }} />
        <div style={{ background: 'linear-gradient(135deg, #4c4 60%, #080)', borderRadius: '0 3px 0 0' }} />
        <div style={{ background: 'linear-gradient(135deg, #44f 60%, #008)', borderRadius: '0 0 0 3px' }} />
        <div style={{ background: 'linear-gradient(135deg, #fa0 60%, #c70)', borderRadius: '0 0 3px 0' }} />
      </div>
      <span style={{
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Trebuchet MS, Franklin Gothic Medium, Arial, sans-serif',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        letterSpacing: 0.3,
      }}>
        start
      </span>
    </button>
  )
}

/** The dotted "grab handle" divider between Quick Launch sections */
function DragHandle() {
  return (
    <div style={{
      width: 5, height: 30, flexShrink: 0, margin: '0 2px',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
      backgroundSize: '3px 3px',
      backgroundRepeat: 'repeat',
    }} />
  )
}

function QuickLaunchBtn({ title, onClick, children }: {
  title: string
  onClick: () => void
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 24, height: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? 'rgba(255,255,255,0.18)' : 'transparent',
        border: hovered ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
        borderRadius: 2,
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {children}
    </button>
  )
}

function SysTrayIcon({ title, onClick, onMouseEnter, onMouseLeave, children }: {
  title?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      title={title}
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); onMouseEnter?.() }}
      onMouseLeave={() => { setHovered(false); onMouseLeave?.() }}
      style={{
        width: 20, height: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? 'rgba(255,255,255,0.15)' : 'transparent',
        borderRadius: 2,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  )
}

// ── Calendar Widget ───────────────────────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES   = ['Su','Mo','Tu','We','Th','Fr','Sa']

function CalendarWidget() {
  const [open, setOpen]   = useState(false)
  const now               = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const ref               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    setTimeout(() => document.addEventListener('mousedown', handler), 10)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const isToday     = (d: number) => d === now.getDate() && month === now.getMonth() && year === now.getFullYear()

  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({length: daysInMonth}, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <SysTrayIcon title="Calendar" onClick={() => setOpen(o => !o)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="0.5" y="1.5" width="13" height="12" rx="1.5" stroke="#7ecef4" strokeWidth="1.1"/>
          <line x1="4" y1="0.5" x2="4" y2="3" stroke="#7ecef4" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="10" y1="0.5" x2="10" y2="3" stroke="#7ecef4" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="0.5" y1="5" x2="13.5" y2="5" stroke="#7ecef4" strokeWidth="1"/>
          <rect x="3" y="7" width="2" height="2" rx="0.4" fill="#7ecef4"/>
          <rect x="6" y="7" width="2" height="2" rx="0.4" fill="#7ecef4"/>
          <rect x="9" y="7" width="2" height="2" rx="0.4" fill="#7ecef4"/>
          <rect x="3" y="10" width="2" height="2" rx="0.4" fill="#7ecef4" opacity="0.6"/>
          <rect x="6" y="10" width="2" height="2" rx="0.4" fill="#7ecef4" opacity="0.6"/>
        </svg>
      </SysTrayIcon>

      {open && (
        <div style={{
          position: 'absolute', bottom: 44, right: 0,
          width: 210,
          background: 'linear-gradient(to bottom, #1a2a4a, #0e1828)',
          border: '1px solid rgba(125,206,244,0.35)',
          borderRadius: 6,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)',
          padding: '10px 10px 8px',
          zIndex: 100000,
          fontFamily: "'Silkscreen', 'Courier New', monospace",
          userSelect: 'none',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: '#7ecef4', cursor: 'pointer', fontSize: 12, padding: '0 4px', lineHeight: 1 }}>‹</button>
            <span style={{ color: '#c8e8ff', fontSize: 10, letterSpacing: 0.5 }}>
              {MONTH_NAMES[month].slice(0,3).toUpperCase()} {year}
            </span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: '#7ecef4', cursor: 'pointer', fontSize: 12, padding: '0 4px', lineHeight: 1 }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 3 }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 8, color: 'rgba(125,206,244,0.6)', padding: '1px 0' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {cells.map((d, i) => (
              <div key={i} style={{
                textAlign: 'center', fontSize: 9,
                padding: '3px 0',
                borderRadius: 3,
                color: d ? (isToday(d) ? '#0e1828' : 'rgba(200,230,255,0.85)') : 'transparent',
                background: d && isToday(d) ? '#7ecef4' : 'transparent',
                fontWeight: d && isToday(d) ? 700 : 400,
              }}>
                {d ?? ''}
              </div>
            ))}
          </div>

          {/* Today label */}
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(125,206,244,0.15)', fontSize: 8, color: 'rgba(125,206,244,0.55)', textAlign: 'center' }}>
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Clock — owns its own 1-second interval so the rest of Taskbar never re-renders ──
function ClockDisplay() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      title={date}
      style={{
        color: '#fff',
        fontSize: 11,
        fontFamily: "'Silkscreen', 'Courier New', monospace",
        textAlign: 'center',
        cursor: 'default',
        lineHeight: 1.25,
        minWidth: 46,
        textShadow: '0 1px 1px rgba(0,0,0,0.5)',
      }}
    >
      {time}
    </div>
  )
}

function TaskbarButton({ icon, label, active, onClick }: {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const bg = active
    ? 'linear-gradient(to bottom, #1a4898 0%, #2258b0 3%, #1d52a8 50%, #1a4ea4 50%, #163e90 100%)'
    : hovered
    ? 'linear-gradient(to bottom, #5888e0 0%, #4070d0 3%, #3060c8 50%, #2858c0 50%, #1e48a8 100%)'
    : 'linear-gradient(to bottom, #4878d4 0%, #3060c4 3%, #2558bc 50%, #2050b4 50%, #1840a0 100%)'

  const boxShadow = active
    ? 'inset 1px 1px 3px rgba(0,0,0,0.5), inset -1px -1px 0 rgba(255,255,255,0.05)'
    : hovered
    ? '1px 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
    : '1px 1px 2px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'

  return (
    <button
      className="xp-taskbar-btn"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 26,
        minWidth: 100, maxWidth: 150,
        padding: '0 8px',
        display: 'flex', alignItems: 'center', gap: 5,
        background: bg,
        border: active
          ? '1px solid rgba(0,0,40,0.6)'
          : '1px solid rgba(10,40,110,0.8)',
        borderTop: active ? '1px solid rgba(0,0,0,0.5)' : '1px solid rgba(255,255,255,0.25)',
        borderRadius: 3,
        cursor: 'pointer',
        color: active ? '#e0e8ff' : '#fff',
        fontSize: 11,
        fontFamily: "'Silkscreen', 'Courier New', monospace",
        fontWeight: active ? 'bold' : 'normal',
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        boxShadow,
        flexShrink: 0,
        transition: 'background 0.08s ease, box-shadow 0.08s ease, color 0.08s ease',
        animation: 'taskbarBtnIn 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        transformOrigin: 'left center',
      }}
    >
      <span style={{ fontSize: 13, flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  )
}
