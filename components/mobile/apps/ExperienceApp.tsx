'use client'

import MobileAppShell, { BrutalistTag } from '../MobileAppShell'
import { experiences } from '@/content/experience'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#b783ff'

export default function ExperienceApp() {
  return (
    <MobileAppShell title="Experience" color={COLOR} subtitle={`${experiences.length} entries`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {experiences.map((exp, idx) => (
          <article
            key={exp.id}
            style={{
              position: 'relative',
              background: b.surface,
              border: `1.5px solid ${b.border}`,
              borderRadius: b.radius,
              boxShadow: b.shadow(exp.accentColor),
              padding: 14,
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -10, right: 12,
                background: b.bgDeep,
                border: `1.5px solid ${exp.accentColor}`,
                borderRadius: 4,
                color: exp.accentColor,
                fontFamily: t.fontMono, fontWeight: 700,
                fontSize: 10, letterSpacing: 1.4,
                padding: '2px 8px',
                textTransform: 'uppercase',
              }}
            >
              No. {String(idx + 1).padStart(2, '0')}
            </div>

            <div
              style={{
                fontSize: 20, fontWeight: 800, color: b.text, lineHeight: 1.1,
                fontFamily: t.fontDisplay, letterSpacing: -0.6,
                marginBottom: 6,
                paddingRight: 70,
              }}
            >
              {exp.role}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: t.fontMono, fontSize: 12, fontWeight: 700,
                  color: exp.accentColor, letterSpacing: 0.4,
                }}
              >
                {exp.company}
              </span>
              <span style={{ width: 4, height: 4, background: b.borderStrong, borderRadius: 999, flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: t.fontMono, fontSize: 11, color: b.textDim,
                  letterSpacing: 0.3,
                }}
              >
                {exp.startDate} → {exp.endDate}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              <BrutalistTag color={exp.accentColor}>{exp.type}</BrutalistTag>
              {exp.current && (
                <BrutalistTag color="#4ed670" filled>NOW</BrutalistTag>
              )}
            </div>

            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {exp.description.map((d, j) => (
                <li
                  key={j}
                  style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    color: b.textDim, fontSize: 12.5, lineHeight: 1.65,
                    fontFamily: t.fontUi,
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
    </MobileAppShell>
  )
}
