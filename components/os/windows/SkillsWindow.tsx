'use client'

import { useState } from 'react'
import { skills, type Skill } from '@/content/skills'
import { BrutalHeader, BrutalBody, brutalFonts as bf, brutal as b } from '@/components/brutal'

const COLOR = '#ffb83a'
const categories = ['All', 'Engineering', 'Programming', 'Design', 'Finance', 'AI'] as const
const LEVEL_NAMES = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']

export default function SkillsWindow() {
  const [filter, setFilter] = useState<typeof categories[number]>('All')
  const filtered = filter === 'All' ? skills : skills.filter(s => s.category === filter)

  return (
    <BrutalBody>
      <BrutalHeader title="Skills" subtitle={`Stack · ${skills.length}`} color={COLOR} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
        {categories.map(cat => {
          const active = filter === cat
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 14px',
                background: active ? COLOR : b.surface,
                color: active ? b.bgDeep : b.text,
                border: `1.5px solid ${active ? COLOR : b.border}`,
                borderRadius: b.radiusSm,
                cursor: 'pointer',
                fontFamily: bf.mono,
                fontSize: 11, fontWeight: 700,
                letterSpacing: 1.4, textTransform: 'uppercase',
                boxShadow: active ? b.shadow() : 'none',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Skill grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 14,
        }}
      >
        {filtered.map((s, i) => <SkillCard key={s.name} skill={s} idx={i} />)}
      </div>
    </BrutalBody>
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
        padding: '14px 16px',
        position: 'relative',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://cdn.simpleicons.org/${skill.icon}/${skill.color.replace('#', '')}`}
          alt={skill.name}
          style={{
            width: 22, height: 22, objectFit: 'contain', flexShrink: 0,
            filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.3))',
          }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <span
          style={{
            flex: 1,
            fontFamily: bf.display,
            fontSize: 16, fontWeight: 900,
            letterSpacing: -0.3,
            color: '#fff',
            textTransform: 'uppercase',
            lineHeight: 1.1,
          }}
        >
          {skill.name}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 8,
                background: i <= skill.proficiency ? skill.color : b.surfaceRaised,
                border: `1px solid ${i <= skill.proficiency ? skill.color : b.border}`,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: bf.mono,
            fontSize: 11, fontWeight: 700,
            color: b.textDim,
            minWidth: 28, textAlign: 'right',
          }}
        >
          {skill.proficiency}/5
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: bf.mono, fontSize: 9.5, fontWeight: 700,
            letterSpacing: 1.4, textTransform: 'uppercase',
            color: skill.color,
            border: `1.5px solid ${skill.color}`,
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          {level}
        </span>
        <span
          style={{
            fontFamily: bf.mono, fontSize: 9, color: b.textMute,
            letterSpacing: 1.2, textTransform: 'uppercase',
          }}
        >
          {skill.category}
        </span>
      </div>
    </div>
  )
}
