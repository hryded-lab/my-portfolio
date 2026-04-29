'use client'

import { siteConfig } from '@/content/siteConfig'
import { useTheme } from '@/lib/themeContext'

export default function AboutWindow() {
  const { t } = useTheme()

  return (
    <div style={{ padding: 20, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, height: '100%', overflowY: 'auto', background: t.bg, color: t.text, transition: 'background 0.2s, color 0.2s' }}>

      {/* Profile header */}
      <div className="about-header" style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 20, padding: 18, background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, boxShadow: t.mode === 'dark' ? '0 1px 8px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', boxShadow: `0 4px 14px ${t.accentBg}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/me.jpg" alt="Hryday" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 3, letterSpacing: -0.3 }}>{siteConfig.name}</div>
          <div style={{ fontSize: 13, color: t.accent, fontWeight: 500, marginBottom: 6 }}>{siteConfig.title}</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: t.textSecondary }}>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M5 0.5C3 0.5 1.5 2 1.5 4c0 2.5 3.5 7 3.5 7s3.5-4.5 3.5-7C8.5 2 7 0.5 5 0.5z" fill={t.textMuted}/><circle cx="5" cy="4" r="1.3" fill={t.bg}/></svg>
              {siteConfig.location}
            </span>
            <a href={`mailto:${siteConfig.email}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: t.accent, textDecoration: 'none' }}>
              <svg width="13" height="10" viewBox="0 0 13 10" fill="none"><rect x="0.5" y="0.5" width="12" height="9" rx="1.5" stroke={t.accent} strokeWidth="1"/><path d="M0.5 2l6 4 6-4" stroke={t.accent} strokeWidth="1"/></svg>
              {siteConfig.email}
            </a>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: t.successBg, border: `1px solid ${t.success}50`, color: t.success, fontSize: 11, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
          <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill={t.success}/></svg>
          Working for Growth
        </div>
      </div>

      {/* Bio */}
      <Section title="About" t={t}>
        <p style={{ color: t.textSecondary, lineHeight: 1.75, fontSize: 13, borderLeft: `3px solid ${t.accent}`, paddingLeft: 12, margin: 0 }}>
          {siteConfig.description}
        </p>
      </Section>

      {/* Stats */}
      <Section title="Stats" t={t}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {siteConfig.stats.map(s => (
            <div key={s.label} style={{ padding: '12px 16px', background: t.bgSecondary, border: `1px solid ${t.borderLight}`, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: t.accent }}>{s.value}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Currently */}
      <Section title="Currently" t={t}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {siteConfig.currently.map((item, i) => (
            <div key={item.label} style={{ display: 'flex', gap: 0, borderBottom: i < siteConfig.currently.length - 1 ? `1px solid ${t.borderLight}` : 'none', padding: '9px 0' }}>
              <div style={{ width: 90, fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, paddingTop: 1, flexShrink: 0 }}>{item.label}</div>
              <div style={{ color: t.text, fontSize: 13 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Links */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {[
          { label: 'LinkedIn', href: siteConfig.linkedin, icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0.5" y="0.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1"/><rect x="2.5" y="5" width="1.5" height="5.5" fill="currentColor"/><circle cx="3.25" cy="3.25" r="1" fill="currentColor"/><path d="M6 5v5.5M6 7c0-1.5 4.5-2 4.5 1v2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
          { label: 'Resume', href: siteConfig.resume, icon: <svg width="11" height="13" viewBox="0 0 11 13" fill="none"><rect x="0.5" y="0.5" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1"/><path d="M2.5 4h6M2.5 6.5h6M2.5 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg> },
        ].map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 6, background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accent, fontSize: 12, fontWeight: 500, textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = t.selectedBg)}
            onMouseLeave={e => (e.currentTarget.style.background = t.accentBg)}
          >
            {l.icon} {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}

function Section({ title, children, t }: { title: string; children: React.ReactNode; t: import('@/lib/themeContext').AppTheme }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${t.borderLight}` }}>
        {title}
      </div>
      {children}
    </div>
  )
}
