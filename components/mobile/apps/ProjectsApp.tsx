'use client'

import MobileAppShell from '../MobileAppShell'
import { projects } from '@/content/projects'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#4ed670'

export default function ProjectsApp() {
  return (
    <MobileAppShell title="Projects" color={COLOR} subtitle={`Selected · ${projects.length}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {projects.map((proj, idx) => (
          <article
            key={proj.id}
            style={{
              position: 'relative',
              background: b.surface,
              border: `1.5px solid ${b.border}`,
              borderRadius: b.radius,
              boxShadow: b.shadow(COLOR),
              overflow: 'hidden',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                height: 4,
                background: COLOR,
              }}
            />

            <div style={{ padding: 14, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: -10, right: 12,
                  background: b.bgDeep,
                  color: COLOR,
                  fontFamily: t.fontMono, fontWeight: 700,
                  fontSize: 10, letterSpacing: 1.4,
                  padding: '2px 8px',
                  border: `1.5px solid ${COLOR}`,
                  borderRadius: 4,
                }}
              >
                {proj.year}
              </div>

              <div
                style={{
                  fontFamily: t.fontMono,
                  fontSize: 11, fontWeight: 700,
                  color: COLOR,
                  letterSpacing: 1.6,
                  marginBottom: 6,
                }}
              >
                / {String(idx + 1).padStart(2, '0')}
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20, fontWeight: 800, color: b.text, lineHeight: 1.1,
                  fontFamily: t.fontDisplay, letterSpacing: -0.6,
                  marginBottom: 10,
                  paddingRight: 60,
                }}
              >
                {proj.title}
              </h3>

              <p
                style={{
                  fontSize: 13, color: b.textDim, lineHeight: 1.65,
                  margin: '0 0 14px',
                  fontFamily: t.fontUi,
                }}
              >
                {proj.description}
              </p>

              {(proj.github || proj.live) && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {proj.github && <ProjectLink label="Github" href={proj.github} />}
                  {proj.live && <ProjectLink label="Live" href={proj.live} filled />}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </MobileAppShell>
  )
}

function ProjectLink({ label, href, filled }: { label: string; href: string; filled?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        flex: 1,
        textAlign: 'center',
        padding: '8px 12px',
        fontFamily: 'Space Mono, ui-monospace, monospace',
        fontSize: 12, fontWeight: 700,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        background: filled ? COLOR : b.surfaceRaised,
        color: filled ? b.bgDeep : b.text,
        border: `1.5px solid ${filled ? COLOR : b.borderStrong}`,
        borderRadius: b.radiusSm,
        textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {label} →
    </a>
  )
}
