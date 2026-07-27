'use client'

import { useState } from 'react'
import { projects, type Project } from '@/content/projects'
import {
  AppFrame, CommandBar, TaskPane, PaneHeading, PaneItem,
  GroupHeading, Panel, BluePanel, BlueHeading, BlueSub, ui, FONT,
} from '@/components/aeroApp'

const CATEGORIES = ['Web App', 'Mobile', 'Tool', 'Other']

export default function ProjectsWindow() {
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered = category === 'All'
    ? projects
    : projects.filter(p => p.category === category)

  const countIn = (c: string) =>
    c === 'All' ? projects.length : projects.filter(p => p.category === c).length

  return (
    <AppFrame>
      <CommandBar>
        <span style={{ color: ui.textDim }}>
          {selected ? selected.title : category === 'All' ? 'All projects' : category}
        </span>
        {selected && (
          <button
            type="button"
            onClick={() => setSelected(null)}
            style={{
              marginLeft: 6,
              padding: '3px 12px',
              borderRadius: ui.radius,
              border: `1px solid ${ui.border}`,
              background: 'var(--aw-btn)',
              color: ui.text,
              fontFamily: FONT, fontSize: 12.5, cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 1px rgba(40,60,80,0.14)',
            }}
          >
            Back to list
          </button>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ color: ui.textMute }}>{filtered.length} of {projects.length}</span>
      </CommandBar>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <TaskPane>
          <PaneHeading>Categories</PaneHeading>
          <PaneItem
            label="All"
            count={countIn('All')}
            selected={category === 'All'}
            onClick={() => { setCategory('All'); setSelected(null) }}
          />
          {CATEGORIES.map(c => (
            <PaneItem
              key={c}
              label={c}
              count={countIn(c)}
              selected={category === c}
              onClick={() => { setCategory(c); setSelected(null) }}
            />
          ))}
        </TaskPane>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 20px' }}>
          {selected ? (
            <>
              <BluePanel style={{ padding: '16px 18px' }}>
                <BlueHeading>{selected.title}</BlueHeading>
                <BlueSub>{selected.category} · {selected.year}</BlueSub>
              </BluePanel>

              <GroupHeading label="Overview" />
              <p
                style={{
                  margin: 0, fontFamily: FONT, fontSize: 12.5,
                  color: ui.textDim, lineHeight: 1.7,
                }}
              >
                {selected.longDescription}
              </p>

              <GroupHeading label="Built with" />
              <Panel style={{ padding: '10px 12px' }}>
                <div style={{ fontFamily: FONT, fontSize: 12.5, color: ui.text }}>
                  {selected.tech.join(' · ')}
                </div>
              </Panel>

              {(selected.github || (selected.live && selected.live !== '#')) && (
                <>
                  <GroupHeading label="Links" />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selected.github && <LinkButton href={selected.github}>View source</LinkButton>}
                    {selected.live && selected.live !== '#' && (
                      <LinkButton href={selected.live}>Open live site</LinkButton>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <BluePanel style={{ padding: '14px 18px' }}>
                <BlueHeading>Things I have built</BlueHeading>
                <BlueSub>Startups, tools and experiments. Pick one for the detail.</BlueSub>
              </BluePanel>

              <GroupHeading label={category === 'All' ? 'All projects' : category} count={filtered.length} />
              <Panel style={{ padding: 6 }}>
                {filtered.map(p => (
                  <div
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(p)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(p) }
                    }}
                    className="aero-list-row"
                    style={{
                      display: 'block',
                      padding: '10px 10px',
                      borderRadius: ui.radius,
                      border: '1px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: ui.text }}>
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT, fontSize: 12, color: ui.textDim,
                        marginTop: 3, lineHeight: 1.5,
                      }}
                    >
                      {p.description}
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 11.5, color: ui.textMute, marginTop: 5 }}>
                      {p.year} · {p.tech.join(', ')}
                    </div>
                  </div>
                ))}
              </Panel>
            </>
          )}
        </div>
      </div>
    </AppFrame>
  )
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        padding: '6px 16px',
        borderRadius: ui.radius,
        border: `1px solid ${ui.border}`,
        background: 'var(--aw-btn)',
        color: ui.text,
        fontFamily: FONT, fontSize: 12.5,
        textDecoration: 'none',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 1px rgba(40,60,80,0.14)',
      }}
    >
      {children}
    </a>
  )
}
