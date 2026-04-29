'use client'

import { useState, useCallback, useRef } from 'react'
import { useWindowManager, type WindowId } from '@/lib/windowManager'
import { useAssistant } from '@/lib/assistantContext'
import DesktopContextMenu from './DesktopContextMenu'
import BlissWallpaper from './BlissWallpaper'
import {
  IconUser, IconFolder, IconLaptopSkills as IconLaptop, IconGradCap,
  IconEnvelope, IconNotepad, IconBlog, IconResume,
  IconRecycleBin,
} from './XPIcons'


type DesktopIcon = {
  id: WindowId | null
  label: string
  Icon: React.ComponentType<{ size?: number }>
}

const icons: DesktopIcon[] = [
  { id: 'about',      label: 'About Me',    Icon: IconUser },
  { id: 'projects',   label: 'My Projects', Icon: IconFolder },
  { id: 'skills',     label: 'Skills',      Icon: IconLaptop },
  { id: 'experience', label: 'Experience',  Icon: IconGradCap },
  { id: 'blog',       label: 'Blog',        Icon: IconBlog },
  { id: 'contact',    label: 'Contact Me',  Icon: IconEnvelope },
  { id: 'resume',     label: 'Resume',      Icon: IconResume },
  { id: 'notepad',    label: 'Notepad',     Icon: IconNotepad },
]

export default function Desktop() {
  const { openWindow, windows } = useWindowManager()
  const { setPendingQuestion } = useAssistant()
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const handleDoubleClick = (id: WindowId) => {
    if (windows[id].isOpen && !windows[id].isMinimized) return
    openWindow(id)
  }

  const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    const q = searchValue.trim()
    if (!q) return
    setPendingQuestion(q)
    openWindow('assistant')
    setSearchValue('')
    searchRef.current?.blur()
  }, [searchValue, setPendingQuestion, openWindow])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleDesktopClick = useCallback(() => {
    setContextMenu(null)
  }, [])

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
      style={{ position: 'fixed', inset: '0 0 40px 0', overflow: 'hidden' }}
    >
      {/* Original SVG landscape wallpaper */}
      <BlissWallpaper />

      {/* Desktop icons — 2-column grid on the left */}
      <div
        className="desktop-icon-grid"
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 110px)',
          gridAutoRows: 'auto',
          gap: 4,
          zIndex: 1,
        }}
      >
        {icons.map(icon => icon.id && (
          <DesktopIconItem
            key={icon.id}
            label={icon.label}
            Icon={icon.Icon}
            onDoubleClick={() => handleDoubleClick(icon.id as WindowId)}
          />
        ))}
      </div>

      {/* ── AI Search bar — top right, Google-style ── */}
      <div
        className="desktop-search"
        onClick={e => e.stopPropagation()}
        style={{ position: 'absolute', top: 14, right: 16, zIndex: 10, width: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
      >
      <form
        onSubmit={handleSearchSubmit}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.95)',
          border: `1px solid ${searchFocused ? '#4285f4' : 'rgba(200,210,240,0.7)'}`,
          borderRadius: 24,
          padding: '0 12px 0 16px',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: searchFocused
            ? '0 4px 20px rgba(66,133,244,0.25), 0 2px 8px rgba(0,0,0,0.15)'
            : '0 2px 10px rgba(0,0,0,0.18)',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          height: 38,
        }}
      >
        {/* Search icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
          <circle cx="11" cy="11" r="7" stroke="#444" strokeWidth="2"/>
          <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="#444" strokeWidth="2" strokeLinecap="round"/>
        </svg>

        <input
          ref={searchRef}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Ask about Hryday…"
          style={{
            flex: 1,
            border: 'none', outline: 'none', background: 'transparent',
            color: '#202124', fontSize: 13,
            fontFamily: 'Arial, sans-serif',
            padding: '0',
            minWidth: 0,
          }}
        />

        {/* Send button — only visible when there's text */}
        {searchValue && (
          <button
            type="submit"
            style={{
              background: '#4285f4', border: 'none', borderRadius: '50%',
              width: 26, height: 26, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </form>

      <div style={{
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.35)',
        borderRadius: 6,
        padding: '3px 14px',
        fontSize: 11,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'Arial, sans-serif',
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
      }}>
        AI Assistant
      </div>
      </div>

      {/* Recycle bin — bottom right */}
      <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 1 }}>
        <DesktopIconItem
          label="Recycle Bin"
          Icon={IconRecycleBin}
          onDoubleClick={() => openWindow('recyclebin')}
        />
      </div>

      {/* Credits */}
      <div
        style={{
          position: 'absolute', bottom: 6, right: 8,
          color: 'rgba(255,255,255,0.72)', fontSize: 9, fontFamily: 'Tahoma, Arial',
          textShadow: '0 1px 3px rgba(0,0,0,0.9)', pointerEvents: 'none',
          zIndex: 1, textAlign: 'right', lineHeight: 1.6,
        }}
      >
        Wallpaper © <a href="https://grafismasakini.com/article/frutiger-aero-and-the-nostalgia-for-early-2000s-digital-aesthetics/en" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>grafismasakini.com</a>
        &nbsp;·&nbsp;
        Icons © <a href="https://www.pinterest.com/pin/897342294504788059/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>Pinterest / XP icon set</a>
        &nbsp;·&nbsp;
        Paint powered by <a href="https://jspaint.app" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>jspaint.app</a>
        &nbsp;·&nbsp;
        Minesweeper inspired by © 1990 Microsoft Corporation
      </div>

      {/* Context menu */}
      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}

function DesktopIconItem({ label, Icon, onDoubleClick }: {
  label: string
  Icon: React.ComponentType<{ size?: number }>
  onDoubleClick: () => void
}) {
  const [selected, setSelected] = useState(false)

  return (
    <div
      className={`desktop-icon${selected ? ' selected' : ''}`}
      onClick={(e) => { e.stopPropagation(); setSelected(true) }}
      onDoubleClick={(e) => { e.stopPropagation(); setSelected(false); onDoubleClick() }}
      onBlur={() => setSelected(false)}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {/* Icon with selection highlight */}
      <div style={{
        padding: 2,
        borderRadius: 2,
        background: selected ? 'rgba(49,106,197,0.5)' : 'transparent',
        border: selected ? '1px dotted rgba(255,255,255,0.8)' : '1px solid transparent',
        display: 'inline-block',
        lineHeight: 0,
      }}>
        <Icon size={44} />
      </div>
      <span style={{
        color: '#fff',
        fontSize: 13,
        fontFamily: "'Silkscreen', 'Courier New', monospace",
        textAlign: 'center',
        textShadow: '0 1px 3px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,1), 1px 1px 0 rgba(0,0,0,0.8)',
        lineHeight: 1.3,
        padding: '2px 5px',
        background: selected ? 'rgba(49,106,197,0.75)' : 'transparent',
        borderRadius: 2,
        display: 'block',
        maxWidth: 106,
        wordBreak: 'break-word',
      }}>
        {label}
      </span>
    </div>
  )
}
