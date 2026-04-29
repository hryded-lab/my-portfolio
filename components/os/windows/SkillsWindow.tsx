'use client'

import { useState } from 'react'
import { skills } from '@/content/skills'
import { useTheme } from '@/lib/themeContext'

const categories = ['All', 'Engineering', 'Programming', 'Design', 'Finance', 'AI'] as const
const levels = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']

export default function SkillsWindow() {
  const { t } = useTheme()
  const [filter, setFilter] = useState<string>('All')
  const filtered = filter === 'All' ? skills : skills.filter(s => s.category === filter)

  return (
    <div style={{ padding: 20, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, height: '100%', overflowY: 'auto', background: t.bg, color: t.text, transition: 'background 0.2s' }}>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: `1px solid ${t.border}`, paddingBottom: 0 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '6px 14px', border: 'none', borderBottom: filter === cat ? `2px solid ${t.accent}` : '2px solid transparent', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: filter === cat ? 600 : 400, color: filter === cat ? t.accent : t.textSecondary, marginBottom: -1, transition: 'color 0.15s', outline: 'none' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
        {filtered.map(skill => (
          <div key={skill.name} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, transition: 'border-color 0.15s, background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = t.accentBorder)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://cdn.simpleicons.org/${skill.icon}/${skill.color.replace('#', '')}`} alt={skill.name} style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}/>
              <span style={{ fontWeight: 600, color: t.text, fontSize: 13 }}>{skill.name}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: t.textMuted, background: t.bgSecondary, padding: '2px 6px', borderRadius: 4 }}>{skill.category}</span>
            </div>

            {/* Progress bar */}
            <div style={{ background: t.progressTrack, height: 4, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(skill.proficiency / 5) * 100}%`, background: skill.color, borderRadius: 4, transition: 'width 0.4s ease' }}/>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= skill.proficiency ? skill.color : t.border, transition: 'background 0.2s' }}/>
                ))}
              </div>
              <span style={{ fontSize: 10, color: t.textMuted }}>{levels[skill.proficiency]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
