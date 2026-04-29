'use client'

import { useTheme } from '@/lib/themeContext'
import { siteConfig } from '@/content/siteConfig'

export default function ResumeWindow() {
  const { t } = useTheme()

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: t.bg, transition: 'background 0.2s' }}>
      {/* Toolbar */}
      <div style={{ padding: '8px 14px', background: t.bgSecondary, borderBottom: `1px solid ${t.border}`, display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accent, fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none"><rect x="0.5" y="0.5" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1"/><path d="M2.5 4h6M2.5 6.5h6M2.5 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
          Download PDF
        </a>
        <span style={{ color: t.textMuted, fontSize: 11 }}>Resume_Hryday_Lath.pdf</span>
      </div>

      {/* PDF iframe preview */}
      <iframe
        src={siteConfig.resume}
        style={{ flex: 1, border: 'none', width: '100%' }}
        title="Hryday Nitin Lath — Resume"
      />
    </div>
  )
}
