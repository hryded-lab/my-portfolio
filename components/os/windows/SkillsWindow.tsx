'use client'

import { useMemo, useState } from 'react'
import { skills, type Skill } from '@/content/skills'
import {
  AppFrame, CommandBar, SearchBox, TaskPane, PaneHeading, PaneItem,
  GroupHeading, ListRow, LevelBar, ui, FONT,
} from '@/components/aeroApp'

const CATEGORIES = ['Engineering', 'Programming', 'Design', 'Finance', 'AI'] as const
const LEVEL_NAMES = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']

export default function SkillsWindow() {
  const [category, setCategory] = useState<string>('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return skills.filter(s =>
      (category === 'All' || s.category === category) &&
      (!q || s.name.toLowerCase().includes(q)),
    )
  }, [category, query])

  // Grouped so the list reads like Explorer's "group by" rather than a card grid.
  const groups = useMemo(() => {
    const order = category === 'All' ? CATEGORIES : [category]
    return order
      .map(cat => ({ cat, items: filtered.filter(s => s.category === cat) }))
      .filter(g => g.items.length > 0)
  }, [filtered, category])

  const countIn = (cat: string) =>
    cat === 'All' ? skills.length : skills.filter(s => s.category === cat).length

  return (
    <AppFrame>
      <CommandBar>
        <span style={{ color: ui.textDim }}>
          {category === 'All' ? 'All skills' : category}
        </span>
        <span style={{ color: ui.textMute }}>
          {filtered.length} of {skills.length}
        </span>
        <div style={{ flex: 1 }} />
        <SearchBox value={query} onChange={setQuery} placeholder="Search skills" />
      </CommandBar>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <TaskPane>
          <PaneHeading>Categories</PaneHeading>
          <PaneItem
            label="All"
            count={countIn('All')}
            selected={category === 'All'}
            onClick={() => setCategory('All')}
          />
          {CATEGORIES.map(c => (
            <PaneItem
              key={c}
              label={c}
              count={countIn(c)}
              selected={category === c}
              onClick={() => setCategory(c)}
            />
          ))}
        </TaskPane>

        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 16px' }}>
          {groups.length === 0 ? (
            <div style={{ padding: '28px 4px', color: ui.textMute, fontSize: 12.5 }}>
              No skills match {query ? `"${query}"` : 'this filter'}.
            </div>
          ) : (
            groups.map(g => (
              <section key={g.cat}>
                <GroupHeading label={g.cat} count={g.items.length} />
                {g.items.map((s, i) => <SkillRow key={s.name} skill={s} alt={i % 2 === 1} />)}
              </section>
            ))
          )}
        </div>
      </div>
    </AppFrame>
  )
}

function SkillRow({ skill, alt }: { skill: Skill; alt: boolean }) {
  return (
    <ListRow alt={alt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${skill.icon}/${skill.color.replace('#', '')}`}
        alt=""
        style={{ width: 16, height: 16, objectFit: 'contain', flexShrink: 0 }}
        onError={e => { (e.target as HTMLImageElement).style.visibility = 'hidden' }}
      />
      <span style={{ flex: 1, minWidth: 0, fontFamily: FONT, fontSize: 12.5 }}>
        {skill.name}
      </span>
      <span
        style={{
          width: 74, flexShrink: 0, textAlign: 'right',
          fontSize: 11.5, color: ui.textDim,
        }}
      >
        {LEVEL_NAMES[skill.proficiency]}
      </span>
      <LevelBar value={skill.proficiency} />
    </ListRow>
  )
}
