'use client'

import { siteConfig } from '@/content/siteConfig'
import { brutalFonts as bf, brutal as b } from '@/components/brutal'

const COLOR = '#5d8aff'

export default function ResumeWindow() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex', flexDirection: 'column',
        background: `linear-gradient(180deg, ${b.bg} 0%, ${b.bgDeep} 100%)`,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: '12px 16px',
          background: b.surface,
          borderBottom: `1.5px solid ${b.border}`,
          display: 'flex', alignItems: 'center', gap: 12,
          flexShrink: 0,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <a
          href={siteConfig.resume}
          target="_blank" rel="noopener noreferrer"
          style={{
            padding: '8px 16px',
            background: COLOR,
            color: b.bgDeep,
            border: `1.5px solid ${COLOR}`,
            borderRadius: b.radiusSm,
            boxShadow: b.shadow(),
            fontFamily: bf.mono,
            fontSize: 11, fontWeight: 700,
            letterSpacing: 1.4, textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ↓ Download PDF
        </a>
        <span
          style={{
            color: b.textDim,
            fontFamily: bf.mono,
            fontSize: 10.5,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          ▸ Resume_Hryday_Lath.pdf
        </span>
      </div>

      {/* PDF iframe */}
      <div style={{ flex: 1, padding: 18, minHeight: 0 }}>
        <div
          style={{
            width: '100%', height: '100%',
            border: `1.5px solid ${b.borderStrong}`,
            borderRadius: b.radius,
            boxShadow: b.shadow(COLOR),
            background: '#fff',
            overflow: 'hidden',
          }}
        >
          <iframe
            src={siteConfig.resume}
            title="Hryday Nitin Lath — Resume"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </div>
  )
}
