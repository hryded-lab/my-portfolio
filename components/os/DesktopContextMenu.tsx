'use client'

import { useEffect, useRef, useState } from 'react'
import { useWindowManager } from '@/lib/windowManager'

const MENU_STYLE = {
  background: '#ece9d8',
  border: '1px solid #888',
  borderRadius: 2,
  boxShadow: '3px 3px 8px rgba(0,0,0,0.4)',
  minWidth: 170,
  padding: '2px 0',
  fontFamily: "'Silkscreen', 'Courier New', monospace",
  fontSize: 11,
} as const

export default function DesktopContextMenu({
  x, y, onClose
}: { x: number; y: number; onClose: () => void }) {
  const { openWindow } = useWindowManager()
  const ref = useRef<HTMLDivElement>(null)
  const [activeSubmenu, setActiveSubmenu] = useState<'arrange' | 'new' | null>(null)

  useEffect(() => {
    const handleClick = () => onClose()
    setTimeout(() => document.addEventListener('mousedown', handleClick), 10)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const adjustedX = Math.min(x, window.innerWidth - 200)
  const adjustedY = Math.min(y, window.innerHeight - 200)

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: adjustedY,
        left: adjustedX,
        zIndex: 99990,
        animation: 'contextMenuIn 0.14s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        transformOrigin: 'top left',
        ...MENU_STYLE,
      }}
    >
      {/* Refresh */}
      <div
        className="xp-context-item"
        onClick={() => { onClose(); window.location.reload() }}
      >
        🔃 Refresh
      </div>

      <div style={{ height: 1, background: '#d4d0c8', margin: '3px 4px' }} />

      {/* Arrange Icons By — submenu on hover */}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setActiveSubmenu('arrange')}
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <div className="xp-context-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span>📐 Arrange Icons By</span><span>▶</span>
        </div>
        {activeSubmenu === 'arrange' && (
          <div style={{ position: 'absolute', left: '100%', top: 0, zIndex: 99991, ...MENU_STYLE }}>
            {(['Name', 'Type', 'Date Modified', 'Auto Arrange'] as const).map(label => (
              <div
                key={label}
                className="xp-context-item"
                onClick={() => onClose()}
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New — submenu on hover */}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setActiveSubmenu('new')}
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <div className="xp-context-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span>📌 New</span><span>▶</span>
        </div>
        {activeSubmenu === 'new' && (
          <div style={{ position: 'absolute', left: '100%', top: 0, zIndex: 99991, ...MENU_STYLE }}>
            <div
              className="xp-context-item"
              onClick={() => { openWindow('notepad'); onClose() }}
            >
              📋 Text Document
            </div>
            <div
              className="xp-context-item"
              onClick={() => { openWindow('paint'); onClose() }}
            >
              🎨 Bitmap Image
            </div>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: '#d4d0c8', margin: '3px 4px' }} />

      {/* Properties */}
      <div
        className="xp-context-item"
        onClick={() => {
          onClose()
          alert('Desktop Properties\n\nTheme: Windows\nBackground: Bliss\n\nHryday Lath\'s Portfolio')
        }}
      >
        ⚙️ Properties
      </div>
    </div>
  )
}
