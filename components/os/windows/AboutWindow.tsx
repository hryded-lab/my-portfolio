'use client'

import { siteConfig } from '@/content/siteConfig'
import {
  BrutalCard, BrutalTag, BrutalSection, BrutalHeader, BrutalBody, brutalFonts as bf, brutal as b,
} from '@/components/brutal'

const COLOR = '#4ab8ff'

export default function AboutWindow() {
  return (
    <BrutalBody>
      <BrutalHeader title="About" subtitle="Profile · 01" color={COLOR} />

      {/* Identity card */}
      <BrutalCard accent={COLOR} padded={false} style={{ marginBottom: 22, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div
            style={{
              width: 110, height: 110,
              borderRight: `1.5px solid ${b.border}`,
              flexShrink: 0,
              overflow: 'hidden',
              background: b.bgDeep,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/me.jpg" alt={siteConfig.name}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'grayscale(0.15) contrast(1.05)',
                display: 'block',
              }}
            />
          </div>
          <div style={{ padding: '14px 18px', flex: 1, minWidth: 0 }}>
            <BrutalTag color={COLOR} style={{ marginBottom: 8 }}>
              ID · 1395
            </BrutalTag>
            <div
              style={{
                fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.05,
                fontFamily: bf.display, letterSpacing: -0.5,
                textTransform: 'uppercase',
              }}
            >
              {siteConfig.name}
            </div>
            <div
              style={{
                fontSize: 12, color: COLOR, fontWeight: 700, lineHeight: 1.4,
                fontFamily: bf.mono, marginTop: 6,
                textTransform: 'uppercase', letterSpacing: 0.6,
              }}
            >
              {siteConfig.title}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <BrutalTag color="#fff">▸ {siteConfig.location}</BrutalTag>
              <BrutalTag color="#4ed670" filled>● Working for Growth</BrutalTag>
            </div>
          </div>
        </div>
      </BrutalCard>

      <p
        style={{
          fontSize: 14, color: b.textDim, lineHeight: 1.75,
          margin: '0 0 26px',
          padding: '0 14px',
          fontFamily: "'Inter', system-ui, sans-serif",
          borderLeft: `3px solid ${COLOR}`,
        }}
      >
        {siteConfig.description}
      </p>

      <BrutalSection title="Stats" color={COLOR} count={siteConfig.stats.length}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {siteConfig.stats.map((s, i) => (
            <BrutalCard key={s.label} accent={i % 2 === 0 ? COLOR : '#ffffff'}>
              <div
                style={{
                  fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 0.95,
                  fontFamily: bf.display, letterSpacing: -1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 10, color: COLOR, marginTop: 8,
                  fontFamily: bf.mono, fontWeight: 700, letterSpacing: 1.4,
                  textTransform: 'uppercase',
                }}
              >
                {s.label}
              </div>
            </BrutalCard>
          ))}
        </div>
      </BrutalSection>

      <BrutalSection title="Currently" color="#fff">
        <BrutalCard>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {siteConfig.currently.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: 'flex', gap: 16, padding: '12px 0',
                  borderBottom: i < siteConfig.currently.length - 1 ? `1px solid ${b.border}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 100, fontSize: 10,
                    color: COLOR,
                    fontFamily: bf.mono, fontWeight: 700, letterSpacing: 1.4,
                    textTransform: 'uppercase',
                    paddingTop: 3, flexShrink: 0,
                  }}
                >
                  ▸ {item.label}
                </div>
                <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.55 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </BrutalCard>
      </BrutalSection>

      <BrutalSection title="Links" color={COLOR}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <DeskLink label="LinkedIn" hint="hryday-lath" href={siteConfig.linkedin} />
          <DeskLink label="Resume"   hint="PDF · Open" href={siteConfig.resume} />
          <DeskLink label="GitHub"   hint="@Hryday-7765" href={siteConfig.github} />
          <DeskLink label="Email"    hint={siteConfig.email} href={`mailto:${siteConfig.email}`} />
        </div>
      </BrutalSection>
    </BrutalBody>
  )
}

function DeskLink({ label, href, hint }: { label: string; href: string; hint: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 14px',
        background: b.surface,
        border: `1.5px solid ${b.border}`,
        borderRadius: b.radiusSm,
        boxShadow: b.shadow(COLOR),
        color: b.text,
        textDecoration: 'none',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 9.5, color: COLOR, fontFamily: bf.mono, fontWeight: 700,
            letterSpacing: 1.4, textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 3 }}>
          {hint}
        </div>
      </div>
      <span style={{ fontFamily: bf.mono, fontSize: 18, fontWeight: 700, color: COLOR }}>→</span>
    </a>
  )
}
