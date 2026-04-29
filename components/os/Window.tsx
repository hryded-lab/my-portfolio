'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { useWindowManager, type WindowId, WINDOWS } from '@/lib/windowManager'
import { playWindowOpen, playWindowClose, playMinimize, playClick } from '@/lib/sounds'
import { useTheme } from '@/lib/themeContext'

// ── Module-level constants — never recreated on render ─────────────────────────
const ACTIVE_TITLE_BG = 'linear-gradient(to bottom, rgba(125,249,255,0.09) 0%, rgba(125,249,255,0.03) 100%)'
const INACTIVE_TITLE_BG = 'rgba(255,255,255,0.02)'
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

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    playWindowClose()
    setAnimState('closing')
    setTimeout(() => { closeWindow(id); setAnimState('idle') }, 240)
  }, [closeWindow, id])

  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    playMinimize()
    setAnimState('minimizing')
    setTimeout(() => { minimizeWindow(id); setAnimState('idle') }, 300)
  }, [minimizeWindow, id])

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
      style={{ ...style, display: isHiddenMinimized ? 'none' : undefined }}
      onMouseDown={() => focusWindow(id)}
      onMouseMove={handleShineMove}
      onMouseLeave={handleShineLeave}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: isActive ? '1px solid rgba(125,249,255,0.45)' : '1px solid rgba(125,249,255,0.12)',
          borderRadius: '10px 10px 0 0',
          overflow: 'hidden',
          background: 'rgba(4,8,20,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: isActive
            ? '0 0 40px rgba(125,249,255,0.06), 0 16px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(125,249,255,0.1)'
            : '0 8px 24px rgba(0,0,0,0.5)',
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
            borderBottom: isActive ? '1px solid rgba(125,249,255,0.18)' : '1px solid rgba(125,249,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', flex: 1 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{cfg.icon}</span>
            <span style={{
              color: isActive ? '#E8F4FF' : '#6a8aaa',
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
              color="#7DF9FF" hoverColor="#a8ffff"
              onClick={handleMinimize}
              label="—" isActive={isActive}
            />
            <TitleBarButton
              color="#A8FF78" hoverColor="#c8ffaa"
              onClick={(e) => { e.stopPropagation(); playClick(); if (win.isMaximized) restoreWindow(id); else maximizeWindow(id) }}
              label={win.isMaximized ? '❐' : '□'} labelSize={9} isActive={isActive}
            />
            <TitleBarButton
              color="#ff5566" hoverColor="#ff8888"
              onClick={handleClose}
              label="✕" isClose isActive={isActive}
            />
          </div>
        </div>

        {/* Menu bar */}
        <div style={{
          height: 22,
          flexShrink: 0,
          background: t.menuBar,
          borderBottom: `1px solid ${t.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          transition: 'background 0.2s, border-color 0.2s',
        }}>
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
          background: t.statusBar,
          borderTop: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center',
          padding: '0 10px', fontSize: 11, color: t.statusBarText,
          fontFamily: GLASS_FONT,
          letterSpacing: '0.1px',
          gap: 8,
          transition: 'background 0.2s',
        }}>
          <span>Ready</span>
          <div style={{ flex: 1 }} />
          <div style={{ borderLeft: `1px solid ${t.border}`, paddingLeft: 8, fontSize: 10 }}>{cfg.title.split('—')[0].trim()}</div>
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

function TitleBarButton({ color, hoverColor, onClick, label, labelSize = 10, isActive = true }: {
  color: string; hoverColor: string; onClick: (e: React.MouseEvent) => void
  label: string; labelSize?: number; isClose?: boolean; isActive?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const dimColor = isActive ? color : '#9090a0'
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 20, height: 20,
        border: `1px solid ${dimColor}55`,
        borderRadius: 4,
        background: hovered
          ? `${hoverColor}22`
          : `${dimColor}15`,
        color: hovered ? hoverColor : dimColor,
        fontSize: labelSize, fontWeight: 600,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: GLASS_FONT,
        textShadow: 'none',
        boxShadow: hovered ? `0 0 8px ${color}55` : 'none',
        transition: 'all 0.15s',
        opacity: isActive ? 1 : 0.4,
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
      style={{ color: t.menuBarText, fontFamily: GLASS_FONT }}
    >
      {label}
    </span>
  )
}
