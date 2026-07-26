'use client'

import { experiences } from '@/content/experience'
import { AppFrame, CommandBar, GroupHeading, Panel, ui, FONT } from '@/components/aeroApp'

export default function ExperienceWindow() {
  return (
    <AppFrame>
      <CommandBar>
        <span style={{ color: ui.textDim }}>Experience</span>
        <span style={{ color: ui.textMute }}>{experiences.length} entries</span>
      </CommandBar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 22px' }}>
        {experiences.map(exp => (
          <section key={exp.id}>
            <GroupHeading label={exp.company} />
            <Panel style={{ padding: '12px 14px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: FONT, fontSize: 14.5, fontWeight: 600,
                    color: ui.text, lineHeight: 1.3,
                  }}
                >
                  {exp.role}
                </span>
                {exp.current && (
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontFamily: FONT, fontSize: 11.5, color: '#3fae63',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'radial-gradient(circle at 35% 30%, #b6f5c8, #3fae63)',
                        boxShadow: '0 0 5px rgba(80,200,120,0.7)',
                      }}
                    />
                    Current
                  </span>
                )}
              </div>

              <div
                style={{
                  fontFamily: FONT, fontSize: 12, color: ui.textMute,
                  marginTop: 4, marginBottom: 10,
                }}
              >
                {exp.startDate} to {exp.endDate} · {exp.location} · {exp.type}
              </div>

              <ul
                style={{
                  margin: 0, padding: 0, listStyle: 'none',
                  display: 'flex', flexDirection: 'column', gap: 7,
                }}
              >
                {exp.description.map((d, j) => (
                  <li
                    key={j}
                    style={{
                      display: 'flex', gap: 9, alignItems: 'flex-start',
                      fontFamily: FONT, fontSize: 12.5,
                      color: ui.textDim, lineHeight: 1.6,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        flexShrink: 0, marginTop: 7,
                        width: 4, height: 4, borderRadius: '50%',
                        background: exp.accentColor,
                      }}
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </section>
        ))}
      </div>
    </AppFrame>
  )
}
