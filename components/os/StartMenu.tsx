'use client'

import { useEffect, useRef } from 'react'
import { useWindowManager, type WindowId } from '@/lib/windowManager'
import { siteConfig } from '@/content/siteConfig'
import {
  IconUser, IconFolder, IconLaptopSkills as IconLaptop, IconGradCap,
  IconBlog, IconEnvelope, IconResume, IconMine, IconNotepad, IconPaint,
  IconMusicPlayer, IconCmdPrompt, IconIE, IconMinecraft,
} from './XPIcons'

type MenuEntry = {
  Icon: React.ComponentType<{ size?: number }>
  label: string
  windowId: WindowId
}

const portfolioItems: MenuEntry[] = [
  { Icon: IconUser,     label: 'About Me',      windowId: 'about' },
  { Icon: IconFolder,   label: 'My Projects',   windowId: 'projects' },
  { Icon: IconLaptop,   label: 'Skills & Tech', windowId: 'skills' },
  { Icon: IconGradCap,  label: 'Experience',    windowId: 'experience' },
  { Icon: IconBlog,     label: 'Blog',          windowId: 'blog' },
  { Icon: IconEnvelope, label: 'Contact Me',    windowId: 'contact' },
  { Icon: IconResume,   label: 'Resume',        windowId: 'resume' },
]

const desktopItems: MenuEntry[] = [
  { Icon: IconMine,        label: 'Minesweeper',    windowId: 'minesweeper' },
  { Icon: IconNotepad,     label: 'Notepad',        windowId: 'notepad' },
  { Icon: IconPaint,       label: 'Paint',          windowId: 'paint' },
  { Icon: IconMusicPlayer, label: 'Media Player',   windowId: 'mediaplayer' },
  { Icon: IconCmdPrompt,   label: 'Command Prompt', windowId: 'cmdprompt' },
  { Icon: IconIE,          label: 'My Tools',       windowId: 'browser' },
  { Icon: IconMinecraft,   label: 'Minecraft',      windowId: 'minecraft' },
]

export default function StartMenu({ onClose, onShutdown }: { onClose: () => void; onShutdown?: () => void }) {
  const { openWindow } = useWindowManager()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    setTimeout(() => document.addEventListener('mousedown', handleClick), 10)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const handleOpen = (id: WindowId) => {
    openWindow(id)
    onClose()
  }

  return (
    <div
      ref={ref}
      className="xp-start-menu"
      style={{
        position: 'fixed',
        bottom: 40,
        left: 0,
        width: 420,
        background: '#fff',
        border: '2px solid #0054e3',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        zIndex: 99998,
        boxShadow: '4px -4px 16px rgba(0,0,0,0.5)',
        animation: 'startMenuSlide 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(to bottom, #0f6fd8, #0847ac)',
        padding: '12px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.5)', flexShrink: 0,
          overflow: 'hidden',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/me.jpg" alt="Hryday" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 13, fontFamily: "'Silkscreen', 'Courier New', monospace" }}>
            {siteConfig.shortName}
          </div>
          <div style={{ color: '#b8d4f0', fontSize: 10, fontFamily: "'Silkscreen', 'Courier New', monospace" }}>
            {siteConfig.title}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex' }}>
        {/* Left column */}
        <div style={{ flex: 1, background: '#fff', borderRight: '1px solid #d4d0c8', padding: '4px 0', overflowY: 'auto', maxHeight: 480 }}>
          <div style={{ padding: '2px 10px', fontSize: 10, fontWeight: 'bold', color: '#555', fontFamily: "'Silkscreen', 'Courier New', monospace", borderBottom: '1px solid #d4d0c8', marginBottom: 4 }}>
            Portfolio
          </div>
          {portfolioItems.map(item => (
            <StartMenuItem
              key={item.windowId}
              Icon={item.Icon}
              label={item.label}
              onClick={() => handleOpen(item.windowId)}
            />
          ))}
          <div style={{ padding: '6px 10px 2px', fontSize: 10, fontWeight: 'bold', color: '#555', fontFamily: "'Silkscreen', 'Courier New', monospace", borderBottom: '1px solid #d4d0c8', borderTop: '1px solid #d4d0c8', marginBottom: 4, marginTop: 4 }}>
            Desktop Features
          </div>
          {desktopItems.map(item => (
            <StartMenuItem
              key={item.windowId}
              Icon={item.Icon}
              label={item.label}
              onClick={() => handleOpen(item.windowId)}
            />
          ))}
        </div>

        {/* Right column */}
        <div style={{ width: 130, background: '#e8e4d8', padding: '4px 0' }}>
          <div style={{ padding: '2px 8px', fontSize: 10, fontWeight: 'bold', color: '#555', fontFamily: "'Silkscreen', 'Courier New', monospace", borderBottom: '1px solid #c8c4bc', marginBottom: 4 }}>
            Links
          </div>
          <RightMenuItem emoji="💼" label="LinkedIn"   href={siteConfig.linkedin} />
          <RightMenuItem emoji="📬" label="Email"      href={`mailto:${siteConfig.email}`} />
          <RightMenuItem emoji="📄" label="Resume PDF" href={siteConfig.resume} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: 'linear-gradient(to bottom, #0f6fd8, #0847ac)',
        padding: '5px 8px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 4,
      }}>
        {[
          { label: 'Log Off',   action: () => { onClose(); onShutdown?.() } },
          { label: 'Restart',   action: () => { onClose(); window.location.reload() } },
          { label: 'Shut Down', action: () => { onClose(); onShutdown?.() } },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              padding: '3px 12px',
              background: 'linear-gradient(to bottom, #4a80e8, #1a4fc8)',
              border: '1px solid #0040a0',
              borderRadius: 3,
              color: '#fff',
              fontSize: 10,
              fontFamily: "'Silkscreen', 'Courier New', monospace",
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function StartMenuItem({ Icon, label, onClick }: {
  Icon: React.ComponentType<{ size?: number }>
  label: string
  onClick: () => void
}) {
  return (
    <button
      className="xp-start-menu-btn"
      onClick={onClick}
    >
      <div style={{ width: 28, height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={28} />
      </div>
      <span className="xp-start-menu-label" style={{ fontSize: 14, fontFamily: "'Silkscreen', 'Courier New', monospace" }}>
        {label}
      </span>
    </button>
  )
}

function RightMenuItem({ emoji, label, href }: { emoji: string; label: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="xp-right-menu-link"
    >
      <span style={{ fontSize: 14 }}>{emoji}</span>
      <span className="xp-right-menu-label" style={{ fontSize: 11, fontFamily: "'Silkscreen', 'Courier New', monospace" }}>
        {label}
      </span>
    </a>
  )
}
