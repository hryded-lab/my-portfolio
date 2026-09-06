'use client'

import MobileAppShell from '../MobileAppShell'
import { siteConfig } from '@/content/siteConfig'
import { mobileTheme as t } from '../mobileTheme'
import { aero as b } from '../aeroKit'

const COLOR = '#5d8aff'

export default function ResumeApp() {
  return (
    <MobileAppShell title="Resume" color={COLOR} subtitle="CV preview" bare>
      <div
        style={{
          position: 'relative',
          width: '100%', height: '100%',
          padding: '0 14px 14px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%', height: '100%',
            border: `1.5px solid ${b.borderStrong}`,
            borderRadius: b.radius,
            boxShadow: b.shadow(COLOR),
            background: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* object, not iframe: iOS Safari will not render an inline PDF, and the
              children keep that from being a blank white card. */}
          <object
            data={siteConfig.resume}
            type="application/pdf"
            aria-label="Hryday's Resume"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          >
            <div style={{ padding: 20, fontFamily: t.fontMono, fontSize: 12, color: b.text, lineHeight: 1.6 }}>
              This browser cannot show PDFs inline. Use the download button below.
            </div>
          </object>
        </div>
        <a
          href={siteConfig.resume}
          download={siteConfig.resumeFileName}
          style={{
            position: 'absolute',
            bottom: 22, right: 22,
            padding: '8px 14px',
            background: b.surface,
            color: b.text,
            border: `1.5px solid ${b.borderStrong}`,
            borderRadius: b.radiusSm,
            boxShadow: b.shadow(COLOR),
            fontFamily: t.fontMono,
            fontSize: 11, fontWeight: 700,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            textDecoration: 'none',
            WebkitTapHighlightColor: 'transparent',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          Download
        </a>
      </div>
    </MobileAppShell>
  )
}
