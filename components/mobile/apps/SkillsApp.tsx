'use client'

import MobileAppShell, { BrutalistSection } from '../MobileAppShell'
import { skills, type Skill } from '@/content/skills'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#ffb83a'
const CATEGORIES = ['Engineering', 'Programming', 'Design', 'Finance', 'AI'] as const
const LEVEL_NAMES = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']

export default function SkillsApp() {
  const total = skills.length
  return (
    <MobileAppShell title="Skills" color={COLOR} subtitle={`Stack · ${total}`}>
      {CATEGORIES.map((cat, ci) => {
        const list = skills.filter(s => s.category === cat)
        if (!list.length) return null
        return (
          <BrutalistSection key={cat} title={cat} color={ci % 2 === 0 ? COLOR : b.text} count={list.length}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {list.map((skill, si) => (
                <SkillCard key={skill.name} skill={skill} idx={si} />
              ))}
            </div>
          </BrutalistSection>
        )
      })}
    </MobileAppShell>
  )
}

function SkillCard({ skill, idx }: { skill: Skill; idx: number }) {
  const level = LEVEL_NAMES[skill.proficiency] ?? ''
  return (
    <div
      style={{
        background: b.surface,
        border: `1.5px solid ${b.border}`,
        borderRadius: b.radius,
        boxShadow: b.shadow(idx % 2 === 0 ? skill.color : undefined),
        padding: '12px 14px',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
        <span
          style={{
            fontFamily: t.fontDisplay,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: -0.3,
            color: b.text,
          }}
        >
          {skill.name}
        </span>
        <span
          style={{
            fontFamily: t.fontMono,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: skill.color,
            border: `1.5px solid ${skill.color}`,
            borderRadius: 4,
            padding: '2px 6px',
            flexShrink: 0,
          }}
        >
          {level}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 7,
                background: i <= skill.proficiency ? skill.color : b.surfaceRaised,
                border: `1px solid ${i <= skill.proficiency ? skill.color : b.border}`,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: t.fontMono,
            fontSize: 11,
            fontWeight: 700,
            color: b.textDim,
            letterSpacing: 0.6,
            minWidth: 24, textAlign: 'right',
          }}
        >
          {skill.proficiency}/5
        </span>
      </div>
    </div>
  )
}
