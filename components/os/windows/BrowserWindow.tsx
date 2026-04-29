'use client'

import { useState } from 'react'

type Tool = { name: string; url: string; category: string; desc: string }

const TOOLS: Tool[] = [
  { name: 'Claude',       url: 'https://claude.ai',                                                                    category: 'AI',          desc: "Anthropic's AI assistant — what powers this portfolio's chat." },
  { name: 'Gemini',       url: 'https://gemini.google.com',                                                            category: 'AI',          desc: "Google's multimodal AI assistant." },
  { name: 'ChatGPT',      url: 'https://chat.openai.com',                                                              category: 'AI',          desc: "OpenAI's conversational AI model." },
  { name: 'Figma',        url: 'https://figma.com',                                                                    category: 'Design',      desc: 'Collaborative interface and product design.' },
  { name: 'Canva',        url: 'https://canva.com',                                                                    category: 'Design',      desc: 'Visual design for marketing and collateral.' },
  { name: 'Photoshop',    url: 'https://adobe.com/products/photoshop.html',                                            category: 'Design',      desc: 'Industry-standard image editing and compositing.' },
  { name: 'Fusion 360',   url: 'https://autodesk.com/products/fusion-360',                                             category: 'Engineering', desc: '3D CAD/CAM/CAE for product design.' },
  { name: 'LTspice',      url: 'https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html', category: 'Engineering', desc: 'High-performance circuit simulation.' },
  { name: 'KiCad',        url: 'https://kicad.org',                                                                    category: 'Engineering', desc: 'Open-source PCB design suite.' },
  { name: 'MATLAB',       url: 'https://mathworks.com/products/matlab.html',                                           category: 'Engineering', desc: 'Numerical computing and simulation.' },
  { name: 'GitHub',       url: 'https://github.com',                                                                   category: 'Dev',         desc: 'Code hosting, version control, and collaboration.' },
  { name: 'Groq Console', url: 'https://console.groq.com',                                                             category: 'Dev',         desc: 'Groq API console — powers this portfolio\'s AI chat.' },
  { name: 'Clay',         url: 'https://clay.com',                                                                     category: 'Business',    desc: 'Outreach automation and data enrichment.' },
  { name: 'Notion',       url: 'https://notion.so',                                                                    category: 'Business',    desc: 'Notes, docs, and project planning.' },
]

const CATEGORIES = ['AI', 'Design', 'Engineering', 'Dev', 'Business']

const CAT_COLOR: Record<string, string> = {
  AI:          '#6366f1',
  Design:      '#ec4899',
  Engineering: '#f59e0b',
  Dev:         '#10b981',
  Business:    '#3b82f6',
}

function faviconUrl(url: string) {
  const domain = new URL(url).hostname
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

export default function BrowserWindow() {
  const [selected, setSelected] = useState<Tool>(TOOLS[0])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 12, background: '#fff' }}>

      {/* IE toolbar */}
      <div style={{
        background: 'linear-gradient(to bottom, #ece8d8, #d4d0c8)',
        borderBottom: '1px solid #aca899',
        padding: '4px 8px',
        display: 'flex', alignItems: 'center', gap: 4,
        flexShrink: 0,
      }}>
        {(['◄', '►', '↻'] as const).map(btn => (
          <div key={btn} style={{
            width: 24, height: 22,
            background: 'linear-gradient(to bottom, #f4f0e4, #d4d0c8)',
            border: '1px solid #aca899', borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, color: '#888', userSelect: 'none',
          }}>{btn}</div>
        ))}
        <div style={{ width: 1, height: 18, background: '#aca899', margin: '0 3px' }} />
        <span style={{ fontSize: 10, color: '#555', whiteSpace: 'nowrap' }}>Address</span>
        <div style={{
          flex: 1, height: 20, background: '#fff',
          border: '2px inset #999', padding: '0 6px',
          display: 'flex', alignItems: 'center', fontSize: 11, color: '#1a4caa',
          overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          {selected.url}
        </div>
        <button
          onClick={() => window.open(selected.url, '_blank')}
          style={{
            padding: '2px 12px', height: 22,
            background: 'linear-gradient(to bottom, #f4f0e4, #d4d0c8)',
            border: '1px solid #aca899', borderRadius: 2,
            fontSize: 11, cursor: 'pointer', color: '#222', fontFamily: 'Tahoma, Arial, sans-serif',
          }}
        >Go</button>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Favorites sidebar */}
        <div style={{
          width: 178, flexShrink: 0,
          background: '#f0ece0',
          borderRight: '1px solid #d0ccc0',
          overflowY: 'auto',
          paddingTop: 4,
        }}>
          <div style={{ padding: '4px 10px 6px', fontSize: 10, fontWeight: 'bold', color: '#555', letterSpacing: 0.3, borderBottom: '1px solid #d0ccc0', marginBottom: 4 }}>
            FAVORITES
          </div>
          {CATEGORIES.map(cat => (
            <div key={cat}>
              <div style={{
                padding: '5px 10px 3px',
                fontSize: 9, fontWeight: 'bold',
                color: CAT_COLOR[cat],
                textTransform: 'uppercase', letterSpacing: 0.6,
              }}>{cat}</div>
              {TOOLS.filter(t => t.category === cat).map(tool => (
                <button
                  key={tool.name}
                  onClick={() => setSelected(tool)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '4px 10px 4px 16px',
                    background: selected.name === tool.name ? '#316ac5' : 'transparent',
                    color: selected.name === tool.name ? '#fff' : '#222',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: 11, fontFamily: 'Tahoma, Arial, sans-serif',
                  }}
                  onMouseEnter={e => { if (selected.name !== tool.name) e.currentTarget.style.background = '#dde8f8' }}
                  onMouseLeave={e => { if (selected.name !== tool.name) e.currentTarget.style.background = 'transparent' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={faviconUrl(tool.url)} alt="" width={14} height={14} style={{ flexShrink: 0, borderRadius: 2 }} />
                  {tool.name}
                </button>
              ))}
              <div style={{ height: 6 }} />
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div style={{
          flex: 1, overflow: 'auto',
          background: '#fff',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '32px 24px', gap: 16,
        }}>
          {/* Favicon */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faviconUrl(selected.url)}
            alt={selected.name}
            width={52} height={52}
            style={{ borderRadius: 12, border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />

          {/* Name */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 8, fontFamily: 'Tahoma, Arial' }}>
              {selected.name}
            </div>
            <span style={{
              display: 'inline-block', padding: '2px 12px', borderRadius: 20,
              background: CAT_COLOR[selected.category] + '18',
              border: `1px solid ${CAT_COLOR[selected.category]}44`,
              color: CAT_COLOR[selected.category],
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6,
            }}>{selected.category}</span>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: '#555', textAlign: 'center', maxWidth: 340, margin: 0, lineHeight: 1.6 }}>
            {selected.desc}
          </p>

          {/* URL pill */}
          <div style={{
            fontSize: 11, color: '#1a4caa', background: '#f0f4ff',
            padding: '5px 14px', borderRadius: 4,
            border: '1px solid #c8d8f8', maxWidth: '100%',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {selected.url}
          </div>

          {/* Open button */}
          <button
            onClick={() => window.open(selected.url, '_blank')}
            style={{
              padding: '9px 32px',
              background: 'linear-gradient(to bottom, #4a90e8, #1a5cc8)',
              border: '1px solid #1040a8', borderRadius: 3,
              color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Tahoma, Arial, sans-serif',
              boxShadow: '0 2px 6px rgba(0,60,180,0.3)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(to bottom, #5aa0f8, #2a6cd8)'}
            onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(to bottom, #4a90e8, #1a5cc8)'}
          >
            Open {selected.name} ↗
          </button>

          <span style={{ fontSize: 10, color: '#bbb' }}>Opens in your default browser</span>
        </div>
      </div>

      {/* IE status bar */}
      <div style={{
        background: 'linear-gradient(to bottom, #ece8d8, #d4d0c8)',
        borderTop: '1px solid #aca899',
        padding: '2px 8px',
        fontSize: 10, color: '#555',
        display: 'flex', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span>Done</span>
        <span>🔒 Internet</span>
      </div>
    </div>
  )
}
