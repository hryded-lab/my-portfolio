'use client'

import { siteConfig } from '@/content/siteConfig'
import {
  AppFrame, CommandBar, GroupHeading, Panel, PropRow, ui, FONT,
} from '@/components/aeroApp'

export default function AboutWindow() {
  return (
    <AppFrame>
      <CommandBar>
        <span style={{ color: ui.textDim }}>Profile</span>
      </CommandBar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 22px' }}>
        {/* Identity header */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 6 }}>
          <div
            style={{
              width: 76, height: 76, flexShrink: 0,
              borderRadius: ui.radius,
              border: `1px solid ${ui.border}`,
              boxShadow: `inset 0 1px 0 ${ui.ridge}, 0 1px 3px rgba(0,40,70,0.22)`,
              overflow: 'hidden',
              background: ui.pane,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/me.jpg" alt={siteConfig.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: FONT, fontSize: 19, fontWeight: 600,
                color: ui.text, lineHeight: 1.2,
              }}
            >
              {siteConfig.name}
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12.5, color: ui.heading, marginTop: 3 }}>
              {siteConfig.title}
            </div>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                fontFamily: FONT, fontSize: 12, color: ui.textMute, marginTop: 6,
              }}
            >
              <span>{siteConfig.location}</span>
              <span aria-hidden>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span
                  aria-hidden
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, #b6f5c8, #3fae63)',
                    boxShadow: '0 0 5px rgba(80,200,120,0.7)',
                  }}
                />
                Open to internships
              </span>
            </div>
          </div>
        </div>

        <GroupHeading label="Summary" />
        <p
          style={{
            margin: 0, fontFamily: FONT, fontSize: 12.5,
            color: ui.textDim, lineHeight: 1.7,
          }}
        >
          {siteConfig.description}
        </p>

        <GroupHeading label="At a glance" />
        <Panel>
          {siteConfig.stats.map((s, i) => (
            <PropRow key={s.label} label={s.label} last={i === siteConfig.stats.length - 1}>
              {s.value}
            </PropRow>
          ))}
        </Panel>

        <GroupHeading label="Currently" />
        <Panel>
          {siteConfig.currently.map((item, i) => (
            <PropRow key={item.label} label={item.label} last={i === siteConfig.currently.length - 1}>
              {item.value}
            </PropRow>
          ))}
        </Panel>

        <GroupHeading label="Links" />
        <Panel>
          <PropRow label="LinkedIn"><Ext href={siteConfig.linkedin}>hryday-lath</Ext></PropRow>
          <PropRow label="GitHub"><Ext href={siteConfig.github}>@Hryday-7765</Ext></PropRow>
          <PropRow label="Email"><Ext href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Ext></PropRow>
          <PropRow label="Resume" last><Ext href={siteConfig.resume}>Open PDF</Ext></PropRow>
        </Panel>
      </div>
    </AppFrame>
  )
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: ui.heading, textDecoration: 'none', fontFamily: FONT, fontSize: 12.5 }}
    >
      {children}
    </a>
  )
}
