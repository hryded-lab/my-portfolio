'use client'

import { siteConfig } from '@/content/siteConfig'
import {
  AppFrame, CommandBar, GroupHeading, Panel, PropRow, BluePanel, BlueHeading, BlueSub, ui, FONT,
} from '@/components/aeroApp'

export default function AboutWindow() {
  return (
    <AppFrame>
      <CommandBar>
        <span style={{ color: ui.textDim }}>Profile</span>
      </CommandBar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 22px' }}>
        {/* Identity slab */}
        <BluePanel style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                width: 74, height: 74, flexShrink: 0,
                borderRadius: 7,
                border: '1px solid rgba(255,255,255,0.55)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 6px rgba(10,40,70,0.3)',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/me.jpg" alt={siteConfig.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <BlueHeading>{siteConfig.name}</BlueHeading>
              <BlueSub>{siteConfig.title}</BlueSub>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap',
                  fontFamily: FONT, fontSize: 12, marginTop: 7,
                  color: 'rgba(255,255,255,0.82)',
                }}
              >
                <span>{siteConfig.location}</span>
                <span aria-hidden>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span
                    aria-hidden
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 30%, #d8ffe6, #57cf85)',
                      boxShadow: '0 0 6px rgba(140,240,180,0.9)',
                    }}
                  />
                  Open to internships
                </span>
              </div>
            </div>
          </div>
        </BluePanel>

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
          <PropRow label="GitHub"><Ext href={siteConfig.github}>@hryded-lab</Ext></PropRow>
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
