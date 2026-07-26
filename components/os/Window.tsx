'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { useWindowManager, type WindowId, WINDOWS } from '@/lib/windowManager'
import { playWindowOpen, playWindowClose, playMinimize, playClick } from '@/lib/sounds'
import { useTheme } from '@/lib/themeContext'

// ── Module-level constants — never recreated on render ─────────────────────────
// Frame colours resolve through --aw-* so the chrome follows the theme toggle.
const ACTIVE_TITLE_BG = 'var(--aw-title-on)'
const INACTIVE_TITLE_BG = 'var(--aw-title-off)'
const GLASS_FONT = "'DM Sans', system-ui, sans-serif"

type Props = {
  id: WindowId
  children: React.ReactNode
}

type AnimState = 'opening' | 'idle' | 'closing' | 'minimizing' | 'maximizing'

export default function Window({ id, children }: Props) {
  const { windows, activeWindowId, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, setPosition, setSize } = useWindowManager()
  const { t } = useTheme()
  const win = windows[id]
  const cfg = WINDOWS[id]
  const outerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    startX: number; startY: number
    winX: number; winY: number
    lastX: number; lastY: number
    minX: number
  } | null>(null)
  const resizeRef = useRef<{
    startX: number; startY: number
    startW: number; startH: number
    startLeft: number; startTop: number
    dir: string
    lastW: number; lastH: number; lastX: number; lastY: number
  } | null>(null)
  const prevOpenRef = useRef(false)
  const prevMaxRef = useRef(false)
  const [animState, setAnimState] = useState<AnimState>('idle')
  const shineRef = useRef<HTMLDivElement>(null)

  const handleShineMove = useCallback((e: React.MouseEvent) => {
    if (!outerRef.current || !shineRef.current) return
    const rect = outerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    shineRef.current.style.background = `radial-gradient(700px circle at ${x}px ${y}px, rgba(125,249,255,0.12) 0%, rgba(168,255,120,0.06) 40%, transparent 65%)`
    shineRef.current.style.opacity = '1'
  }, [])

  const handleShineLeave = useCallback(() => {
    if (shineRef.current) shineRef.current.style.opacity = '0'
  }, [])

  // Play sound + trigger opening animation when window opens
  useEffect(() => {
    const nowOpen = win.isOpen && !win.isMinimized
    if (nowOpen && !prevOpenRef.current) {
      playWindowOpen()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimState('opening')
      const t = setTimeout(() => setAnimState('idle'), 360)
      return () => clearTimeout(t)
    }
    prevOpenRef.current = nowOpen
  }, [win.isOpen, win.isMinimized])

  // Maximize/restore animation
  useEffect(() => {
    if (win.isMaximized !== prevMaxRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimState('maximizing')
      const t = setTimeout(() => setAnimState('idle'), 180)
      prevMaxRef.current = win.isMaximized
      return () => clearTimeout(t)
    }
  }, [win.isMaximized])

  const isActive = activeWindowId === id

  // ── Drag via CSS transform — zero React re-renders while dragging ─────────────
  // We apply position as a transform offset so React's style reconciler never
  // overwrites our in-flight DOM updates. One setPosition call fires on mouseup.
  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) return
    e.preventDefault()

    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      winX: win.position.x, winY: win.position.y,
      lastX: win.position.x, lastY: win.position.y,
      minX: -win.size.width + 80,
    }
    focusWindow(id)

    const el = outerRef.current

    const handleMouseMove = (mv: MouseEvent) => {
      if (!dragRef.current || !el) return
      const newX = Math.max(dragRef.current.minX, dragRef.current.winX + (mv.clientX - dragRef.current.startX))
      const newY = Math.max(0, dragRef.current.winY + (mv.clientY - dragRef.current.startY))
      dragRef.current.lastX = newX
      dragRef.current.lastY = newY
      // transform is not in React's style prop, so React will never overwrite it
      el.style.transform = `translate(${newX - dragRef.current.winX}px, ${newY - dragRef.current.winY}px)`
    }

    const handleMouseUp = () => {
      if (dragRef.current && el) {
        const { lastX, lastY, winX, winY } = dragRef.current
        // Pre-apply final left/top so React's reconciliation matches instantly (no snap)
        el.style.left = `${lastX}px`
        el.style.top = `${lastY}px`
        el.style.transform = ''
        if (lastX !== winX || lastY !== winY) setPosition(id, { x: lastX, y: lastY })
      }
      dragRef.current = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [win.isMaximized, win.position.x, win.position.y, win.size.width, id, focusWindow, setPosition])

  // ── Resize: direct DOM at 60fps, single context commit on mouseup ─────────────
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, dir: string) => {
    if (win.isMaximized) return
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) return
    e.preventDefault()
    e.stopPropagation()

    const startW = win.size.width, startH = win.size.height
    const startLeft = win.position.x, startTop = win.position.y

    resizeRef.current = {
      startX: e.clientX, startY: e.clientY,
      startW, startH, startLeft, startTop, dir,
      lastW: startW, lastH: startH, lastX: startLeft, lastY: startTop,
    }
    focusWindow(id)

    const el = outerRef.current

    const calc = (dx: number, dy: number) => {
      const r = resizeRef.current!
      let newW = r.startW, newH = r.startH, newX = r.startLeft, newY = r.startTop
      if (dir.includes('e')) newW = Math.max(300, r.startW + dx)
      if (dir.includes('s')) newH = Math.max(200, r.startH + dy)
      if (dir.includes('w')) { newW = Math.max(300, r.startW - dx); newX = r.startLeft + (r.startW - newW) }
      if (dir.includes('n')) { newH = Math.max(200, r.startH - dy); newY = r.startTop + (r.startH - newH) }
      return { newW, newH, newX, newY }
    }

    const handleMouseMove = (mv: MouseEvent) => {
      if (!resizeRef.current || !el) return
      const dx = mv.clientX - resizeRef.current.startX
      const dy = mv.clientY - resizeRef.current.startY
      const { newW, newH, newX, newY } = calc(dx, dy)
      resizeRef.current.lastW = newW; resizeRef.current.lastH = newH
      resizeRef.current.lastX = newX; resizeRef.current.lastY = newY
      el.style.width = `${newW}px`
      el.style.height = `${newH}px`
      if (dir.includes('w') || dir.includes('n')) {
        el.style.left = `${newX}px`
        el.style.top = `${newY}px`
      }
    }

    const handleMouseUp = () => {
      if (resizeRef.current) {
        const { lastW, lastH, lastX, lastY } = resizeRef.current
        setSize(id, { width: lastW, height: lastH })
        if (dir.includes('w') || dir.includes('n')) setPosition(id, { x: lastX, y: lastY })
        resizeRef.current = null
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [win.isMaximized, win.position.x, win.position.y, win.size.width, win.size.height, id, focusWindow, setPosition, setSize])

  const handleDoubleClickTitle = useCallback(() => {
    if (win.isMaximized) restoreWindow(id)
    else maximizeWindow(id)
  }, [win.isMaximized, id, maximizeWindow, restoreWindow])

  const runClose = useCallback(() => {
    playWindowClose()
    setAnimState('closing')
    setTimeout(() => { closeWindow(id); setAnimState('idle') }, 240)
  }, [closeWindow, id])

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    runClose()
  }, [runClose])

  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    playMinimize()
    setAnimState('minimizing')
    setTimeout(() => { minimizeWindow(id); setAnimState('idle') }, 300)
  }, [minimizeWindow, id])

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  // Escape closes whichever window is focused. Bound only on the active window so
  // a single press never closes more than one.
  useEffect(() => {
    if (!isActive || !win.isOpen || win.isMinimized) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      // Let inputs handle their own Escape (clearing a field, dismissing a menu).
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      e.preventDefault()
      runClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isActive, win.isOpen, win.isMinimized, runClose])

  // Move focus into a window when it opens, and hand it back to whatever opened it
  // on close, so keyboard users are never stranded.
  const returnFocusRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (win.isOpen && !win.isMinimized) {
      if (!returnFocusRef.current) {
        returnFocusRef.current = document.activeElement as HTMLElement | null
      }
      outerRef.current?.focus({ preventScroll: true })
    } else if (!win.isOpen && returnFocusRef.current) {
      returnFocusRef.current.focus?.({ preventScroll: true })
      returnFocusRef.current = null
    }
  }, [win.isOpen, win.isMinimized])

  // Keep mounted during close/minimize animation
  const isHiding = animState === 'closing' || animState === 'minimizing'
  if (!win.isOpen) return null
  const isHiddenMinimized = win.isMinimized && !isHiding

  const style = win.isMaximized
    ? { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 40, width: '100%', height: 'calc(100% - 40px)', zIndex: win.zIndex }
    : { position: 'fixed' as const, top: win.position.y, left: win.position.x, width: win.size.width, height: win.size.height, zIndex: win.zIndex }

  return (
    <div
      ref={outerRef}
      className="xp-window"
      role="dialog"
      aria-label={cfg.title}
      tabIndex={-1}
      style={{ ...style, display: isHiddenMinimized ? 'none' : undefined, outline: 'none' }}
      onMouseDown={() => focusWindow(id)}
      onFocus={() => { if (!isActive) focusWindow(id) }}
      onMouseMove={handleShineMove}
      onMouseLeave={handleShineLeave}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${isActive ? 'var(--aw-edge-on)' : 'var(--aw-edge-off)'}`,
          borderRadius: 'var(--aw-radius)',
          overflow: 'hidden',
          background: 'var(--aw-frame)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: isActive ? 'var(--aw-shadow-on)' : 'var(--aw-shadow-off)',
          transformOrigin: 'center center',
          willChange: animState !== 'idle' ? 'transform, opacity, filter' : 'auto',
          animation:
            animState === 'opening'    ? 'windowOpen     0.36s cubic-bezier(0.22, 1, 0.36, 1)    forwards' :
            animState === 'closing'    ? 'windowClose    0.24s cubic-bezier(0.4,  0, 1,    0.6)  forwards' :
            animState === 'minimizing' ? 'windowMinimize 0.30s cubic-bezier(0.4,  0, 0.8,  0.6)  forwards' :
            animState === 'maximizing' ? 'windowMaximize 0.22s cubic-bezier(0.22, 1, 0.36, 1)    forwards' :
            'none',
        }}
      >
        {/* Title Bar */}
        <div
          onMouseDown={handleTitleMouseDown}
          onDoubleClick={handleDoubleClickTitle}
          style={{
            height: 32,
            flexShrink: 0,
            background: isActive ? ACTIVE_TITLE_BG : INACTIVE_TITLE_BG,
            borderBottom: `1px solid ${isActive ? 'var(--aw-rule-on)' : 'var(--aw-rule-off)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
            cursor: 'var(--cursor-point)',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', flex: 1 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{cfg.icon}</span>
            <span style={{
              color: isActive ? 'var(--aw-title-txt-on)' : 'var(--aw-title-txt-off)',
              fontSize: 12,
              fontFamily: GLASS_FONT,
              fontWeight: 500,
              letterSpacing: '0.2px',
              textShadow: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {cfg.title}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 8 }}>
            <TitleBarButton
              onClick={handleMinimize}
              label="–" ariaLabel={`Minimise ${cfg.title}`} isActive={isActive}
            />
            <TitleBarButton
              onClick={(e) => { e.stopPropagation(); playClick(); if (win.isMaximized) restoreWindow(id); else maximizeWindow(id) }}
              label={win.isMaximized ? '❐' : '□'} labelSize={11} isActive={isActive}
              ariaLabel={`${win.isMaximized ? 'Restore' : 'Maximise'} ${cfg.title}`}
            />
            <TitleBarButton
              onClick={handleClose}
              label="✕" isClose isActive={isActive}
              ariaLabel={`Close ${cfg.title}`}
            />
          </div>
        </div>

        {/* Menu bar */}
        <div style={{
          height: 22,
          flexShrink: 0,
          background: 'var(--aa-bar)',
          borderBottom: `1px solid ${'var(--aa-border)'}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          transition: 'background 0.2s, border-color 0.2s',
        }}
        aria-hidden="true"
        >
          {/* Decorative XP chrome — these menus have no behaviour, so they're hidden
              from assistive tech rather than announced as dead controls. */}
          {['File', 'Edit', 'View', 'Help'].map(label => <MenuBarItem key={label} label={label} t={t} />)}
        </div>

        {/* Content */}
        <div className="glass-window-content" style={{ flex: 1, background: t.bg, overflow: 'auto', position: 'relative', transition: 'background 0.2s' }}>
          {children}
        </div>

        {/* Glass shine overlay — tracks cursor, zero re-renders */}
        <div
          ref={shineRef}
          style={{
            position: 'absolute', inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            opacity: 0,
            transition: 'opacity 0.4s ease',
            zIndex: 9998,
          }}
        />

        {/* Status bar */}
        <div style={{
          height: 22, flexShrink: 0,
          background: 'var(--aa-bar)',
          borderTop: `1px solid ${'var(--aa-border)'}`,
          display: 'flex', alignItems: 'center',
          padding: '0 10px', fontSize: 11, color: 'var(--aa-text-mute)',
          fontFamily: GLASS_FONT,
          letterSpacing: '0.1px',
          gap: 8,
          transition: 'background 0.2s',
        }}>
          <span>Ready</span>
          <div style={{ flex: 1 }} />
          <div style={{ borderLeft: `1px solid var(--aa-border)`, paddingLeft: 8, fontSize: 10 }}>{cfg.title.split('—')[0].trim()}</div>
        </div>
      </div>

      {/* Resize handles — only show when not maximized */}
      {!win.isMaximized && (
        <>
          {[
            { dir: 'n',  style: { top: -4, left: 8, right: 8, height: 8, cursor: 'n-resize' } },
            { dir: 's',  style: { bottom: -4, left: 8, right: 8, height: 8, cursor: 's-resize' } },
            { dir: 'e',  style: { right: -4, top: 8, bottom: 8, width: 8, cursor: 'e-resize' } },
            { dir: 'w',  style: { left: -4, top: 8, bottom: 8, width: 8, cursor: 'w-resize' } },
            { dir: 'ne', style: { top: -4, right: -4, width: 12, height: 12, cursor: 'ne-resize' } },
            { dir: 'nw', style: { top: -4, left: -4, width: 12, height: 12, cursor: 'nw-resize' } },
            { dir: 'se', style: { bottom: -4, right: -4, width: 12, height: 12, cursor: 'se-resize' } },
            { dir: 'sw', style: { bottom: -4, left: -4, width: 12, height: 12, cursor: 'sw-resize' } },
          ].map(h => (
            <div
              key={h.dir}
              onMouseDown={(e) => handleResizeMouseDown(e, h.dir)}
              style={{ position: 'absolute', zIndex: 10, ...h.style }}
            />
          ))}
        </>
      )}
    </div>
  )
}

function TitleBarButton({ onClick, label, labelSize = 11, isActive = true, isClose, ariaLabel }: {
  onClick: (e: React.MouseEvent) => void
  label: string; labelSize?: number; isClose?: boolean; isActive?: boolean; ariaLabel?: string
}) {
  const [hovered, setHovered] = useState(false)

  // Capsules, wider than tall, with close carrying the red fill.
  const base = isClose
    ? 'linear-gradient(180deg, #e86b63 0%, #d24b42 52%, #c23a31 100%)'
    : 'var(--aw-btn)'
  const hot = isClose
    ? 'linear-gradient(180deg, #f0837b 0%, #dd5b52 52%, #cf4a41 100%)'
    : 'var(--aw-btn-hot)'

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 34, height: 20,
        border: `1px solid ${isClose ? '#a83329' : 'var(--aw-btn-edge)'}`,
        borderRadius: 4,
        background: hovered ? hot : base,
        color: isClose ? '#fff' : 'var(--aw-btn-txt)',
        fontSize: labelSize,
        fontWeight: 500,
        lineHeight: 1,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: GLASS_FONT,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 1px rgba(40,60,80,0.16)',
        opacity: isActive ? 1 : 0.55,
        transition: 'background 0.12s',
        textShadow: isClose ? '0 1px 1px rgba(120,30,24,0.5)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

// CSS hover via .xp-menu-bar-item in globals.css — no useState needed
function MenuBarItem({ label, t }: { label: string; t: import('@/lib/themeContext').AppTheme }) {
  return (
    <span
      className="xp-menu-bar-item"
      style={{ color: 'var(--aa-text-dim)', fontFamily: GLASS_FONT }}
    >
      {label}
    </span>
  )
}
