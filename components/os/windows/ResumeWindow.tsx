'use client'

import { siteConfig } from '@/content/siteConfig'
import { AppFrame, CommandBar, ui, FONT } from '@/components/aeroApp'

export default function ResumeWindow() {
  return (
    <AppFrame>
      <CommandBar>
        <a
          href={siteConfig.resume}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '4px 14px',
            borderRadius: ui.radius,
            border: `1px solid ${ui.border}`,
            background: 'var(--aw-btn)',
            color: ui.text,
            fontFamily: FONT,
            fontSize: 12.5,
            textDecoration: 'none',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 1px rgba(40,60,80,0.14)',
          }}
        >
          Download PDF
        </a>
        <span style={{ color: ui.textMute }}>Resume_Hryday_Lath.pdf</span>
      </CommandBar>

      <div style={{ flex: 1, minHeight: 0, padding: 12 }}>
        <div
          style={{
            width: '100%', height: '100%',
            border: `1px solid ${ui.border}`,
            borderRadius: ui.radius,
            boxShadow: ui.inset,
            background: '#fff',
            overflow: 'hidden',
          }}
        >
          <iframe
            src={siteConfig.resume}
            title="Hryday Nitin Lath resume"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </AppFrame>
  )
}
