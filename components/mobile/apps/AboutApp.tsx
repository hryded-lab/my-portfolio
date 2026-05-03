'use client'

import MobileAppShell, { BrutalistCard, BrutalistSection, BrutalistTag } from '../MobileAppShell'
import { siteConfig } from '@/content/siteConfig'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#4ab8ff'

export default function AboutApp() {
  return (
    <MobileAppShell title="About" color={COLOR} subtitle="Profile · 01">
      {/* Identity card — asymmetric, photo offset */}
      <BrutalistCard accent={COLOR} padded={false} style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div
            style={{
              width: 92, height: 92,
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
          <div style={{ padding: '10px 14px', flex: 1, minWidth: 0 }}>
            <BrutalistTag color={COLOR} style={{ marginBottom: 6 }}>
              ID · 1395
            </BrutalistTag>
            <div
              style={{
                fontSize: 18, fontWeight: 800, color: b.text, lineHeight: 1.1,
                fontFamily: t.fontDisplay, letterSpacing: -0.4,
              }}
            >
              {siteConfig.name}
            </div>
            <div
              style={{
                fontSize: 11, color: COLOR, fontWeight: 700, lineHeight: 1.35,
                fontFamily: t.fontMono, marginTop: 4,
              }}
            >
              {siteConfig.title}
            </div>
          </div>
        </div>
      </BrutalistCard>

      {/* Bio */}
      <p
        style={{
          fontSize: 13.5,
          color: b.textDim,
          lineHeight: 1.7,
          margin: '0 0 26px',
          padding: '0 2px',
          fontFamily: t.fontUi,
          borderLeft: `3px solid ${COLOR}`,
          paddingLeft: 12,
        }}
      >
        {siteConfig.description}
      </p>

      {/* Stats — overlapping accent block as backdrop */}
      <BrutalistSection title="Stats" color={COLOR} count={siteConfig.stats.length}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {siteConfig.stats.map((s, i) => (
            <BrutalistCard key={s.label} accent={i % 2 === 0 ? COLOR : undefined}>
              <div
                style={{
                  fontSize: 28, fontWeight: 800, color: b.text, lineHeight: 0.95,
                  fontFamily: t.fontDisplay, letterSpacing: -1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 9.5, color: COLOR, marginTop: 6,
                  fontFamily: t.fontMono, fontWeight: 700, letterSpacing: 1.4,
                  textTransform: 'uppercase',
                }}
              >
                {s.label}
              </div>
            </BrutalistCard>
          ))}
        </div>
      </BrutalistSection>

      {/* Currently */}
      <BrutalistSection title="Currently" color={b.text}>
        <BrutalistCard>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {siteConfig.currently.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: 'flex', gap: 14, padding: '11px 0',
                  borderBottom: i < siteConfig.currently.length - 1 ? `1px solid ${b.border}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 78, fontSize: 9.5,
                    color: COLOR,
                    fontFamily: t.fontMono, fontWeight: 700, letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    paddingTop: 3, flexShrink: 0,
                  }}
                >
                  ▸ {item.label}
                </div>
                <div style={{ fontSize: 13, color: b.text, lineHeight: 1.5, fontFamily: t.fontUi }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </BrutalistCard>
      </BrutalistSection>

      {/* Quick Links */}
      <BrutalistSection title="Links" color={COLOR}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <LinkRow label="LinkedIn" hint="hryday-lath" href={siteConfig.linkedin} />
          <LinkRow label="GitHub"   hint="@Hryday-7765" href={siteConfig.github} />
          <LinkRow label="Email"    hint={siteConfig.email} href={`mailto:${siteConfig.email}`} />
        </div>
      </BrutalistSection>
    </MobileAppShell>
  )
}

function LinkRow({ label, href, hint }: { label: string; href: string; hint: string }) {
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
        WebkitTapHighlightColor: 'transparent',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 9.5, color: COLOR, fontFamily: t.fontMono, fontWeight: 700,
            letterSpacing: 1.4, textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 14, fontWeight: 600, color: b.text, marginTop: 2,
            fontFamily: t.fontUi,
          }}
        >
          {hint}
        </div>
      </div>
      <span
        style={{
          fontFamily: t.fontMono,
          fontSize: 18, fontWeight: 700,
          color: COLOR,
        }}
      >
        →
      </span>
    </a>
  )
}
