'use client'

import { useState } from 'react'
import { skills, type Skill } from '@/content/skills'
import { AeroHeader, AeroBody, AeroCard, AeroTag, AeroTabs, AeroMeter, aero as a, aeroFonts as af } from '@/components/aero'

const COLOR = '#12a7d4'
const categories = ['All', 'Engineering', 'Programming', 'Design', 'Finance', 'AI']
const LEVEL_NAMES = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']

export default function SkillsWindow() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? skills : skills.filter(s => s.category === filter)

  return (
    <AeroBody>
      <AeroHeader title="Skills" subtitle={`${skills.length} in the stack`} color={COLOR} />

      <AeroTabs tabs={categories} active={filter} onChange={setFilter} color={COLOR} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 14,
        }}
      >
        {filtered.map(s => <SkillCard key={s.name} skill={s} />)}
      </div>
    </AeroBody>
  )
}

function SkillCard({ skill }: { skill: Skill }) {
  const level = LEVEL_NAMES[skill.proficiency] ?? ''
  return (
    <AeroCard accent={skill.color} style={{ padding: '15px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://cdn.simpleicons.org/${skill.icon}/${skill.color.replace('#', '')}`}
          alt=""
          style={{
            width: 24, height: 24, objectFit: 'contain', flexShrink: 0,
            filter: `drop-shadow(0 1px 3px ${skill.color}55)`,
          }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <span
          style={{
            flex: 1,
            fontFamily: af.display,
            fontSize: 15.5,
            fontWeight: 600,
            letterSpacing: -0.2,
            color: a.text,
            lineHeight: 1.2,
          }}
        >
          {skill.name}
        </span>
      </div>

      <AeroMeter value={skill.proficiency} color={skill.color} label={level} />

      <div style={{ marginTop: 12 }}>
        <AeroTag color={skill.color} style={{ fontSize: 10.5, padding: '3px 9px' }}>
          {skill.category}
        </AeroTag>
      </div>
    </AeroCard>
  )
}
