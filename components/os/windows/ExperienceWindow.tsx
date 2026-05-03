'use client'

import { experiences } from '@/content/experience'
import { BrutalTag, BrutalHeader, BrutalBody, brutalFonts as bf, brutal as b } from '@/components/brutal'

const COLOR = '#b783ff'

export default function ExperienceWindow() {
  return (
    <BrutalBody>
      <BrutalHeader title="Experience" subtitle={`${experiences.length} entries`} color={COLOR} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {experiences.map((exp, idx) => (
          <article
            key={exp.id}
            style={{
              position: 'relative',
              background: b.surface,
              border: `1.5px solid ${b.border}`,
              borderRadius: b.radius,
              boxShadow: b.shadow(exp.accentColor),
              padding: 18,
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -10, right: 14,
                background: b.bgDeep,
                border: `1.5px solid ${exp.accentColor}`,
                borderRadius: 4,
                color: exp.accentColor,
                fontFamily: bf.mono, fontWeight: 700,
                fontSize: 10, letterSpacing: 1.4,
                padding: '2px 8px',
                textTransform: 'uppercase',
              }}
            >
              No. {String(idx + 1).padStart(2, '0')}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.05,
                    fontFamily: bf.display, letterSpacing: -0.7,
                    textTransform: 'uppercase',
                    paddingRight: 60,
                    marginBottom: 8,
                  }}
                >
                  {exp.role}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: bf.mono, fontSize: 13, fontWeight: 700, color: exp.accentColor, letterSpacing: 0.4 }}>
                    {exp.company}
                  </span>
                  <span style={{ width: 4, height: 4, background: b.borderStrong, borderRadius: 999 }} />
                  <span style={{ fontFamily: bf.mono, fontSize: 12, color: b.textDim }}>
                    {exp.startDate} → {exp.endDate}
                  </span>
                  <span style={{ width: 4, height: 4, background: b.borderStrong, borderRadius: 999 }} />
                  <span style={{ fontFamily: bf.mono, fontSize: 12, color: b.textMute }}>
                    {exp.location}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <BrutalTag color={exp.accentColor}>{exp.type}</BrutalTag>
              {exp.current && <BrutalTag color="#4ed670" filled>NOW</BrutalTag>}
            </div>

            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {exp.description.map((d, j) => (
                <li
                  key={j}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    color: b.textDim, fontSize: 13.5, lineHeight: 1.65,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 6, height: 6,
                      background: exp.accentColor,
                      borderRadius: 999,
                      marginTop: 8,
                    }}
                  />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </BrutalBody>
  )
}
