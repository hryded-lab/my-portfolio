'use client'

import { useState } from 'react'
import { projects, type Project } from '@/content/projects'
import { useTheme } from '@/lib/themeContext'

const categories = ['All', 'Web App', 'Mobile', 'Tool', 'Other'] as const

export default function ProjectsWindow() {
  const { t } = useTheme()
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <div className="projects-layout" style={{ display: 'flex', height: '100%', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, background: t.bg, color: t.text, transition: 'background 0.2s' }}>

      {/* Sidebar */}
      <div className="projects-sidebar" style={{ width: 210, borderRight: `1px solid ${t.border}`, background: t.bgSecondary, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Filter */}
        <div style={{ padding: '12px 10px 8px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Filter</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ padding: '5px 10px', textAlign: 'left', background: filter === c ? t.selectedBg : 'transparent', color: filter === c ? t.accent : t.textSecondary, border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 12, fontWeight: filter === c ? 600 : 400, fontFamily: 'inherit' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{ padding: '8px 10px', borderRadius: 6, cursor: 'pointer', background: selected?.id === p.id ? t.selectedBg : 'transparent', border: `1px solid ${selected?.id === p.id ? t.accentBorder : 'transparent'}`, marginBottom: 2, transition: 'background 0.1s' }}
              onMouseEnter={e => { if (selected?.id !== p.id) e.currentTarget.style.background = t.bgCardHover }}
              onMouseLeave={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="15" height="13" viewBox="0 0 18 16" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M1 3.5h6l1.5 1.5H17v9H1z" fill={selected?.id === p.id ? t.accent : '#f0d060'} stroke={selected?.id === p.id ? t.accentBorder : '#c8a820'} strokeWidth="1" strokeLinejoin="round"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: selected?.id === p.id ? t.accent : t.text }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{p.year}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {selected ? (
          <div>
            {/* Header */}
            <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${t.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ padding: '3px 10px', borderRadius: 20, background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accent, fontSize: 11, fontWeight: 600 }}>{selected.category}</span>
                <span style={{ fontSize: 12, color: t.textMuted }}>{selected.year}</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: '0 0 10px', letterSpacing: -0.3 }}>{selected.title}</h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.7, margin: 0, fontSize: 13 }}>{selected.longDescription}</p>
            </div>

            {/* Tech stack */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Technologies</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.tech.map(tech => (
                  <span key={tech} style={{ padding: '4px 12px', borderRadius: 20, background: t.tagBg, border: `1px solid ${t.tagBorder}`, color: t.tagText, fontSize: 11, fontWeight: 500 }}>{tech}</span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 8 }}>
              {selected.github && (
                <a href={selected.github} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 6, background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accent, fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1"/><path d="M4.5 9.5c0-1 .5-1.5 1-1.5H7c.5 0 1 .5 1 1.5" stroke="currentColor" strokeWidth="1" fill="none"/><circle cx="6.5" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1"/></svg>
                  GitHub
                </a>
              )}
              {selected.live && selected.live !== '#' && (
                <a href={selected.live} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 6, background: t.bgSecondary, border: `1px solid ${t.border}`, color: t.text, fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/><path d="M3.5 6h5M6 3.5l2.5 2.5-2.5 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: t.textMuted }}>
            <svg width="52" height="46" viewBox="0 0 52 46" fill="none">
              <path d="M2 10h18l4 4h26v28H2z" fill={t.mode === 'dark' ? '#2d333b' : '#f0d060'} stroke={t.mode === 'dark' ? '#444c56' : '#c8a820'} strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontSize: 13, color: t.textSecondary }}>Select a project to view details</div>
          </div>
        )}
      </div>
    </div>
  )
}
