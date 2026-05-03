'use client'

import MobileAppShell from '../MobileAppShell'
import { siteConfig } from '@/content/siteConfig'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

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
          <iframe
            src={siteConfig.resume}
            title="Hryday's Resume"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay"
          />
        </div>
        <a
          href={siteConfig.resume}
          target="_blank"
          rel="noopener noreferrer"
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
          Open ↗
        </a>
      </div>
    </MobileAppShell>
  )
}
