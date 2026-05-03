'use client'

import { useMemo, useState } from 'react'
import MobileAppShell, { BrutalistTag } from '../MobileAppShell'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#7cd0ff'

type Tool = { name: string; url: string; category: 'AI' | 'Design' | 'Engineering' | 'Dev' | 'Business'; desc: string }

const TOOLS: Tool[] = [
  { name: 'Claude',       url: 'https://claude.ai',                                                                    category: 'AI',          desc: "Anthropic's AI assistant — what powers this portfolio's chat." },
  { name: 'Gemini',       url: 'https://gemini.google.com',                                                            category: 'AI',          desc: "Google's multimodal AI assistant." },
  { name: 'ChatGPT',      url: 'https://chat.openai.com',                                                              category: 'AI',          desc: "OpenAI's conversational AI." },
  { name: 'Figma',        url: 'https://figma.com',                                                                    category: 'Design',      desc: 'Collaborative interface and product design.' },
  { name: 'Canva',        url: 'https://canva.com',                                                                    category: 'Design',      desc: 'Visual design for marketing and collateral.' },
  { name: 'Photoshop',    url: 'https://adobe.com/products/photoshop.html',                                            category: 'Design',      desc: 'Image editing and compositing.' },
  { name: 'Fusion 360',   url: 'https://autodesk.com/products/fusion-360',                                             category: 'Engineering', desc: '3D CAD/CAM/CAE for product design.' },
  { name: 'LTspice',      url: 'https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html', category: 'Engineering', desc: 'Circuit simulation.' },
  { name: 'KiCad',        url: 'https://kicad.org',                                                                    category: 'Engineering', desc: 'Open-source PCB design.' },
  { name: 'MATLAB',       url: 'https://mathworks.com/products/matlab.html',                                           category: 'Engineering', desc: 'Numerical computing.' },
  { name: 'GitHub',       url: 'https://github.com',                                                                   category: 'Dev',         desc: 'Code hosting + version control.' },
  { name: 'Groq Console', url: 'https://console.groq.com',                                                             category: 'Dev',         desc: "Powers this portfolio's AI chat." },
  { name: 'Clay',         url: 'https://clay.com',                                                                     category: 'Business',    desc: 'Outreach + data enrichment.' },
  { name: 'Notion',       url: 'https://notion.so',                                                                    category: 'Business',    desc: 'Notes, docs, planning.' },
]

const CAT_COLOR: Record<Tool['category'], string> = {
  AI:          '#a78bfa',
  Design:      '#ff7ec5',
  Engineering: '#ffb83a',
  Dev:         '#4ed670',
  Business:    '#7cd0ff',
}

const CATEGORIES = ['All', 'AI', 'Design', 'Engineering', 'Dev', 'Business'] as const

function faviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return ''
  }
}

export default function BrowserApp() {
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>('All')

  const visible = useMemo(
    () => filter === 'All' ? TOOLS : TOOLS.filter(t => t.category === filter),
    [filter]
  )

  return (
    <MobileAppShell title="My Tools" color={COLOR} subtitle={`${TOOLS.length} bookmarks`}>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {CATEGORIES.map(cat => {
          const active = filter === cat
          const accent = cat === 'All' ? COLOR : CAT_COLOR[cat as Tool['category']]
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '7px 12px',
                background: active ? accent : b.surface,
                color: active ? b.bgDeep : b.text,
                border: `1.5px solid ${active ? accent : b.border}`,
                borderRadius: b.radiusSm,
                cursor: 'pointer',
                fontFamily: t.fontMono,
                fontSize: 10.5, fontWeight: 700,
                letterSpacing: 1.4, textTransform: 'uppercase',
                boxShadow: active ? b.shadow() : 'none',
                WebkitTapHighlightColor: 'transparent',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Tool list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.map(tool => (
          <ToolRow key={tool.url} tool={tool} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
        <BrutalistTag color={COLOR}>External · opens in new tab</BrutalistTag>
      </div>
    </MobileAppShell>
  )
}

function ToolRow({ tool }: { tool: Tool }) {
  const accent = CAT_COLOR[tool.category]
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: '12px 14px',
        background: b.surface,
        border: `1.5px solid ${b.border}`,
        borderRadius: b.radius,
        boxShadow: b.shadow(accent),
        color: b.text,
        textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          width: 38, height: 38, flexShrink: 0,
          borderRadius: 8,
          background: '#fff',
          border: `1.5px solid ${b.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl(tool.url)}
          alt=""
          style={{ width: 24, height: 24, objectFit: 'contain' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 14, fontWeight: 700,
              color: b.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {tool.name}
          </span>
          <span
            style={{
              fontFamily: 'Space Mono, ui-monospace, monospace',
              fontSize: 9, fontWeight: 700,
              letterSpacing: 1.2, textTransform: 'uppercase',
              color: accent,
              border: `1px solid ${accent}`,
              borderRadius: 3,
              padding: '1px 5px',
              flexShrink: 0,
            }}
          >
            {tool.category}
          </span>
        </div>
        <div
          style={{
            fontSize: 11.5, color: b.textDim, lineHeight: 1.4,
            fontFamily: t.fontUi,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {tool.desc}
        </div>
      </div>
      <span style={{ color: accent, fontFamily: 'Space Mono, ui-monospace, monospace', fontWeight: 700, fontSize: 16 }}>
        →
      </span>
    </a>
  )
}
