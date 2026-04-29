'use client'

import { useState } from 'react'

export default function NotepadWindow() {
  const [text, setText] = useState('Welcome to Notepad!\n\nYou can type anything here...\n\nTip: File > Save As to download as .txt')
  const [font, setFont] = useState('VT323, Courier New, monospace')
  const [fontSize, setFontSize] = useState(16)

  const handleSave = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSelectAll = () => {
    const ta = document.getElementById('notepad-textarea') as HTMLTextAreaElement
    if (ta) { ta.focus(); ta.select() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Silkscreen', 'Courier New', monospace", fontSize: 11 }}>
      {/* Custom menu bar for Notepad */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: '1px solid #d4d0c8',
        background: 'linear-gradient(to bottom, #ece9d8, #d4d0c8)',
        padding: '2px 4px',
        flexShrink: 0,
      }}>
        <NotepadMenu label="File" items={[
          { label: 'New', onClick: () => setText('') },
          { label: '---' },
          { label: 'Save As...', onClick: handleSave },
        ]} />
        <NotepadMenu label="Edit" items={[
          { label: 'Select All', onClick: handleSelectAll },
          { label: '---' },
          { label: 'Word Wrap', onClick: () => {} },
        ]} />
        <NotepadMenu label="Format" items={[
          { label: 'Font: Courier New', onClick: () => setFont('Courier New') },
          { label: 'Font: Tahoma', onClick: () => setFont('Tahoma') },
          { label: 'Font: Arial', onClick: () => setFont('Arial') },
          { label: '---' },
          { label: 'Size: 10', onClick: () => setFontSize(10) },
          { label: 'Size: 12', onClick: () => setFontSize(12) },
          { label: 'Size: 14', onClick: () => setFontSize(14) },
        ]} />
        <NotepadMenu label="Help" items={[
          { label: 'About Notepad', onClick: () => alert('Notepad - Portfolio Edition\n\nType your thoughts here!') },
        ]} />
      </div>

      {/* Text area */}
      <textarea
        id="notepad-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          padding: 6,
          fontFamily: font,
          fontSize: fontSize,
          resize: 'none',
          background: '#fff',
          color: '#000',
          lineHeight: 1.5,
        }}
      />

      {/* Status */}
      <div style={{
        height: 18, background: '#d4d0c8', borderTop: '1px solid #a0a0a0',
        display: 'flex', alignItems: 'center', padding: '0 6px',
        fontSize: 10, color: '#333', gap: 12, flexShrink: 0,
      }}>
        <span>Ln 1, Col 1</span>
        <span>{text.length} chars</span>
        <span style={{ marginLeft: 'auto' }}>{font} {fontSize}pt</span>
      </div>
    </div>
  )
}

function NotepadMenu({ label, items }: { label: string; items: { label: string; onClick?: () => void }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <span
        onClick={() => setOpen(!open)}
        style={{
          padding: '2px 8px', cursor: 'default', fontSize: 11,
          background: open ? '#316ac5' : 'transparent',
          color: open ? '#fff' : '#000',
          borderRadius: 2,
          userSelect: 'none',
        }}
      >
        {label}
      </span>
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute', top: '100%', left: 0, zIndex: 100,
            background: '#ece9d8', border: '1px solid #8e8e8e',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            minWidth: 140,
          }}>
            {items.map((item, i) => item.label === '---'
              ? <div key={i} style={{ height: 1, background: '#a0a0a0', margin: '2px 0' }} />
              : (
                <div
                  key={i}
                  onClick={() => { item.onClick?.(); setOpen(false) }}
                  style={{ padding: '4px 20px', cursor: 'default', fontSize: 11, fontFamily: "'Silkscreen', 'Courier New', monospace" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#316ac5'; (e.currentTarget as HTMLDivElement).style.color = '#fff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = '#000' }}
                >
                  {item.label}
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}
