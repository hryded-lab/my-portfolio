'use client'

import { experiences } from '@/content/experience'
import { useTheme } from '@/lib/themeContext'

export default function ExperienceWindow() {
  const { t } = useTheme()

  return (
    <div style={{ padding: 20, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, height: '100%', overflowY: 'auto', background: t.bg, color: t.text, transition: 'background 0.2s' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 18 }}>Experience & Education</div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 24 }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: t.border, borderRadius: 1 }}/>

        {experiences.map((exp, i) => (
          <div key={exp.id} style={{ position: 'relative', marginBottom: i < experiences.length - 1 ? 24 : 0 }}>
            {/* Timeline dot */}
            <div style={{ position: 'absolute', left: -21, top: 16, width: 12, height: 12, borderRadius: '50%', background: exp.accentColor, border: `2px solid ${t.bg}`, boxShadow: `0 0 0 2px ${exp.accentColor}40` }}/>

            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderLeft: `3px solid ${exp.accentColor}`, borderRadius: 8, overflow: 'hidden', transition: 'border-color 0.15s' }}>
              {/* Header */}
              <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 2 }}>{exp.role}</div>
                  <div style={{ fontWeight: 500, fontSize: 13, color: t.accent }}>{exp.company}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: t.textSecondary, marginBottom: 4 }}>{exp.startDate} — {exp.endDate}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{exp.location}</div>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${exp.accentColor}18`, color: exp.accentColor, border: `1px solid ${exp.accentColor}30` }}>{exp.type}</span>
                    {exp.current && (
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: t.successBg, color: t.success, border: `1px solid ${t.success}40` }}>Current</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bullets */}
              <div style={{ padding: '12px 16px' }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {exp.description.map((d, j) => (
                    <li key={j} style={{ display: 'flex', gap: 8, color: t.textSecondary, lineHeight: 1.6, fontSize: 12 }}>
                      <span style={{ color: exp.accentColor, flexShrink: 0, marginTop: 2, fontSize: 10 }}>▸</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
