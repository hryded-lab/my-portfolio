'use client'

import { useState } from 'react'
import { projects, type Project } from '@/content/projects'
import { AeroTag, AeroHeader, AeroBody, AeroCard, aero as a, aeroFonts as af } from '@/components/aero'

const COLOR = '#2fbf71'
const categories = ['All', 'Web App', 'Mobile', 'Tool', 'Other']

export default function ProjectsWindow() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <div
      className="projects-layout"
      style={{
        display: 'flex', height: '100%',
        background: `linear-gradient(180deg, ${a.sky1} 0%, ${a.sky2} 100%)`,
        color: a.text,
        fontFamily: af.ui,
      }}
    >
      {/* Sidebar */}
      <div
        className="projects-sidebar"
        style={{
          width: 230,
          borderRight: `1px solid ${a.edge}`,
          background: a.glass,
          display: 'flex', flexDirection: 'column',
          flexShrink: 0,
          backdropFilter: 'blur(14px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
          boxShadow: `inset -1px 0 0 var(--aero-bevel-top)`,
        }}
      >
        <div style={{ padding: '14px 12px 12px', borderBottom: `1px solid ${a.edge}` }}>
          <div
            style={{
              fontSize: 12, fontWeight: 600,
              color: a.textMute, marginBottom: 10,
            }}
          >
            Filter
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {categories.map(c => {
              const on = filter === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  style={{
                    padding: '8px 11px',
                    textAlign: 'left',
                    borderRadius: a.radiusSm,
                    cursor: 'pointer',
                    fontFamily: af.ui,
                    fontSize: 12.5,
                    fontWeight: on ? 600 : 500,
                    color: on ? '#fff' : a.textDim,
                    border: `1px solid ${on ? 'transparent' : a.edge}`,
                    background: on
                      ? `linear-gradient(180deg,
                          color-mix(in srgb, ${COLOR} 88%, #fff) 0%,
                          ${COLOR} 48%,
                          color-mix(in srgb, ${COLOR} 74%, #000) 50%,
                          ${COLOR} 100%)`
                      : a.glass,
                    boxShadow: on
                      ? `inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 4px rgba(0,30,45,0.28)`
                      : a.bevel(),
                    textShadow: on ? '0 1px 1px rgba(0,30,45,0.35)' : 'none',
                    transition: 'background 0.18s ease, color 0.18s ease',
                  }}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {filtered.map(p => {
            const on = selected?.id === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '11px 12px',
                  marginBottom: 7,
                  borderRadius: a.radiusSm,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: on ? '#fff' : a.text,
                  border: `1px solid ${on ? 'transparent' : a.edge}`,
                  background: on
                    ? `linear-gradient(180deg,
                        color-mix(in srgb, ${COLOR} 88%, #fff) 0%,
                        ${COLOR} 48%,
                        color-mix(in srgb, ${COLOR} 74%, #000) 50%,
                        ${COLOR} 100%)`
                    : a.glass,
                  boxShadow: on
                    ? `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(0,30,45,0.3)`
                    : a.bevel(),
                  transition: 'background 0.18s ease',
                }}
              >
                <div style={{ fontSize: 11, color: on ? 'rgba(255,255,255,0.85)' : a.textMute }}>
                  {p.year}
                </div>
                <div
                  style={{
                    fontFamily: af.display,
                    fontSize: 14.5, fontWeight: 600,
                    letterSpacing: -0.2,
                    marginTop: 2,
                    lineHeight: 1.2,
                    textShadow: on ? '0 1px 1px rgba(0,30,45,0.35)' : 'none',
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
          <div style={{ padding: '24px 26px 32px' }}>
            <AeroHeader
              title={selected.title}
              subtitle={`${selected.category} · ${selected.year}`}
              color={COLOR}
            />

            <AeroCard accent={COLOR} style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 14, color: a.textDim, lineHeight: 1.75 }}>
                {selected.longDescription}
              </p>
            </AeroCard>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
              {selected.tech.map(tech => (
                <AeroTag key={tech} color={COLOR} style={{ fontSize: 11, padding: '3px 10px' }}>
                  {tech}
                </AeroTag>
              ))}
            </div>

            {(selected.github || (selected.live && selected.live !== '#')) && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {selected.github && <LinkButton href={selected.github} label="View source" />}
                {selected.live && selected.live !== '#' && (
                  <LinkButton href={selected.live} label="Open live site" filled />
                )}
              </div>
            )}
          </div>
        ) : (
          <AeroBody style={{ padding: 0 }}>
            <div
              style={{
                height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 16,
              }}
            >
              {/* Aero gel orb */}
              <div
                aria-hidden
                style={{
                  width: 68, height: 68, borderRadius: '50%',
                  background: `radial-gradient(circle at 34% 28%,
                    #ffffff 0%,
                    color-mix(in srgb, ${COLOR} 55%, #fff) 22%,
                    ${COLOR} 60%,
                    color-mix(in srgb, ${COLOR} 55%, #000) 100%)`,
                  boxShadow: `0 6px 20px -6px ${COLOR}, inset 0 -6px 12px -6px rgba(0,0,0,0.5)`,
                }}
              />
              <span style={{ fontFamily: af.ui, fontSize: 13.5, color: a.textMute }}>
                Pick a project from the list
              </span>
            </div>
          </AeroBody>
        )}
      </div>
    </div>
  )
}

function LinkButton({ href, label, filled = false }: { href: string; label: string; filled?: boolean }) {
  const tint = COLOR
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        padding: '10px 18px',
        borderRadius: 999,
        fontFamily: af.ui,
        fontSize: 13,
        fontWeight: 600,
        textDecoration: 'none',
        color: filled ? '#fff' : a.text,
        border: `1px solid ${filled ? 'transparent' : a.edge}`,
        background: filled
          ? `linear-gradient(180deg,
              color-mix(in srgb, ${tint} 88%, #fff) 0%,
              ${tint} 48%,
              color-mix(in srgb, ${tint} 74%, #000) 50%,
              ${tint} 100%)`
          : a.glass,
        boxShadow: filled
          ? `inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(0,30,45,0.3)`
          : a.bevel(),
        textShadow: filled ? '0 1px 1px rgba(0,30,45,0.35)' : 'none',
      }}
    >
      {label}
    </a>
  )
}
