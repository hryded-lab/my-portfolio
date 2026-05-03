'use client'

import { useState } from 'react'
import { projects, type Project } from '@/content/projects'
import { BrutalTag, BrutalHeader, BrutalBody, brutalFonts as bf, brutal as b } from '@/components/brutal'

const COLOR = '#4ed670'
const categories = ['All', 'Web App', 'Mobile', 'Tool', 'Other'] as const

export default function ProjectsWindow() {
  const [filter, setFilter] = useState<typeof categories[number]>('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <div
      className="projects-layout"
      style={{
        display: 'flex', height: '100%',
        background: `linear-gradient(180deg, ${b.bg} 0%, ${b.bgDeep} 100%)`,
        color: b.text,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        className="projects-sidebar"
        style={{
          width: 230,
          borderRight: `1.5px solid ${b.border}`,
          background: b.surface,
          display: 'flex', flexDirection: 'column',
          flexShrink: 0,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        {/* Filter */}
        <div style={{ padding: '14px 12px 10px', borderBottom: `1.5px solid ${b.border}` }}>
          <div
            style={{
              fontSize: 10, fontFamily: bf.mono, fontWeight: 700,
              color: COLOR, textTransform: 'uppercase',
              letterSpacing: 1.6, marginBottom: 10,
            }}
          >
            ▸ Filter
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {categories.map(c => {
              const active = filter === c
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  style={{
                    padding: '7px 10px',
                    textAlign: 'left',
                    background: active ? COLOR : b.surfaceRaised,
                    color: active ? b.bgDeep : b.text,
                    border: `1.5px solid ${active ? COLOR : b.border}`,
                    borderRadius: b.radiusSm,
                    cursor: 'pointer',
                    fontFamily: bf.mono,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                  }}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {filtered.map((p, i) => {
            const isActive = selected?.id === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  marginBottom: 8,
                  background: isActive ? COLOR : b.surfaceRaised,
                  color: isActive ? b.bgDeep : b.text,
                  border: `1.5px solid ${isActive ? COLOR : b.border}`,
                  borderRadius: b.radiusSm,
                  cursor: 'pointer',
                  boxShadow: isActive ? b.shadow() : 'none',
                  fontFamily: 'inherit',
                }}
              >
                <div
                  style={{
                    fontFamily: bf.mono, fontSize: 9.5, fontWeight: 700,
                    letterSpacing: 1.4, textTransform: 'uppercase',
                    color: isActive ? b.bgDeep : COLOR,
                  }}
                >
                  / {String(i + 1).padStart(2, '0')} · {p.year}
                </div>
                <div
                  style={{
                    fontFamily: bf.display,
                    fontSize: 14, fontWeight: 900,
                    letterSpacing: -0.3,
                    textTransform: 'uppercase',
                    marginTop: 3,
                    lineHeight: 1.1,
                  }}
                >
                  {p.title}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {selected ? (
          <div style={{ padding: '22px 26px 32px' }}>
            <BrutalHeader
              title={selected.title}
              subtitle={`${selected.category} · ${selected.year}`}
              color={COLOR}
            />

            <p
              style={{
                fontSize: 14, color: b.textDim, lineHeight: 1.75,
                margin: '0 0 26px',
                padding: '0 14px',
                borderLeft: `3px solid ${COLOR}`,
              }}
            >
              {selected.longDescription}
            </p>

            {(selected.github || (selected.live && selected.live !== '#')) && (
              <div style={{ display: 'flex', gap: 10 }}>
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      padding: '10px 18px',
                      background: b.surface,
                      color: b.text,
                      border: `1.5px solid ${b.borderStrong}`,
                      borderRadius: b.radiusSm,
                      boxShadow: b.shadow(COLOR),
                      fontFamily: bf.mono,
                      fontSize: 12, fontWeight: 700,
                      letterSpacing: 1.4,
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                    }}
                  >
                    GitHub →
                  </a>
                )}
                {selected.live && selected.live !== '#' && (
                  <a
                    href={selected.live}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      padding: '10px 18px',
                      background: COLOR,
                      color: b.bgDeep,
                      border: `1.5px solid ${COLOR}`,
                      borderRadius: b.radiusSm,
                      boxShadow: b.shadow(),
                      fontFamily: bf.mono,
                      fontSize: 12, fontWeight: 700,
                      letterSpacing: 1.4,
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    Live →
                  </a>
                )}
              </div>
            )}
          </div>
        ) : (
          <BrutalBody style={{ padding: 0 }}>
            <div
              style={{
                height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 64, height: 64,
                  border: `1.5px solid ${b.borderStrong}`,
                  borderRadius: b.radius,
                  background: b.surface,
                  boxShadow: b.shadow(COLOR),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              >
                <span style={{ fontFamily: bf.display, fontSize: 26, fontWeight: 900, color: COLOR }}>P</span>
              </div>
              <BrutalTag color={b.text}>Select a project to view details</BrutalTag>
            </div>
          </BrutalBody>
        )}
      </div>
    </div>
  )
}
