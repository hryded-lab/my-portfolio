'use client'

import { useEffect, useRef, useState } from 'react'
import MobileAppShell from '../MobileAppShell'
import { siteConfig } from '@/content/siteConfig'
import { projects } from '@/content/projects'
import { experiences } from '@/content/experience'
import { skills } from '@/content/skills'

const ACCENT = '#00ff7f'
const PROMPT = 'hryday@phone:~$'
const LEVELS = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']

const QUICK_COMMANDS = ['help', 'whoami', 'skills', 'projects', 'experience', 'contact', 'clear']

const BANNER = [
  '┌─────────────────────────────────────┐',
  '│  hryday@phone — portfolio terminal  │',
  '│  type "help" for available commands │',
  '└─────────────────────────────────────┘',
  '',
]

export default function TerminalApp() {
  const [lines, setLines] = useState<string[]>([...BANNER])
  const [input, setInput] = useState('')
  const inputRef  = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<string[]>([])
  const histIdxRef = useRef(-1)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'auto' }) }, [lines])

  const push = (...l: string[]) => setLines(prev => [...prev, ...l])

  const run = (raw: string) => {
    const full = raw.trim()
    const cmd  = full.toLowerCase()

    if (cmd === 'clear' || cmd === 'cls') { setLines([...BANNER]); return }

    push(`${PROMPT} ${full}`)
    if (!cmd) return

    historyRef.current = [full, ...historyRef.current.filter(c => c !== full)].slice(0, 30)
    histIdxRef.current = -1

    if (cmd === 'help') {
      push(
        '',
        '  help        list commands',
        '  whoami      about hryday',
        '  skills      tech stack + levels',
        '  projects    portfolio entries',
        '  experience  roles + dates',
        '  contact     email + linkedin',
        '  resume      open resume pdf',
        '  date        current date',
        "  echo <text> print <text>",
        '  clear       clear screen',
        '',
      )
    } else if (cmd === 'whoami') {
      push(
        '',
        siteConfig.name,
        siteConfig.title,
        '',
        siteConfig.description,
        '',
        ...siteConfig.currently.map(c => `${c.label.padEnd(11)} ${c.value}`),
        '',
      )
    } else if (cmd === 'skills') {
      const out: string[] = ['']
      const cats = ['Engineering', 'Programming', 'Design', 'Finance', 'AI'] as const
      for (const cat of cats) {
        const items = skills.filter(s => s.category === cat)
        if (!items.length) continue
        out.push(`${cat}:`)
        for (const s of items) out.push(`  ${s.name.padEnd(16)} ${LEVELS[s.proficiency]}`)
        out.push('')
      }
      push(...out)
    } else if (cmd === 'projects') {
      push(
        '',
        ...projects.map(p => `[${p.year}] ${p.title}`),
        '',
        '  hint: "projects" on the desktop has full details.',
        '',
      )
    } else if (cmd === 'experience') {
      push(
        '',
        ...experiences.map(e => `${e.startDate} → ${e.endDate}  ${e.role} · ${e.company}`),
        '',
      )
    } else if (cmd === 'contact') {
      push(
        '',
        `email     ${siteConfig.email}`,
        `linkedin  ${siteConfig.linkedin}`,
        `github    ${siteConfig.github}`,
        '',
      )
    } else if (cmd === 'resume') {
      window.open(siteConfig.resume, '_blank')
      push('', 'opening resume.pdf …', '')
    } else if (cmd === 'date') {
      push('', new Date().toString(), '')
    } else if (cmd === 'sudo hire hryday' || cmd === 'hire hryday') {
      push(
        '',
        'sudo: this is not a unix system... but fine.',
        '',
        'verifying qualifications …',
        '  [■■■■■■■■■■] 100%',
        '',
        '  ✓ Solid project portfolio',
        '  ✓ Ships things fast',
        '  ✓ Available and interested',
        '',
        "ACCESS GRANTED. opening linkedin — good luck.",
        '',
      )
      window.open(siteConfig.linkedin, '_blank')
    } else if (cmd.startsWith('echo')) {
      const text = full.slice(4).trim()
      push('', text || 'echo is on.', '')
    } else {
      push(
        '',
        `${full.split(' ')[0]}: command not found`,
        "  type 'help' for available commands",
        '',
      )
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const v = input
      setInput('')
      run(v)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const h = historyRef.current
      const next = Math.min(histIdxRef.current + 1, h.length - 1)
      histIdxRef.current = next
      if (h[next] !== undefined) setInput(h[next])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdxRef.current - 1, -1)
      histIdxRef.current = next
      setInput(next === -1 ? '' : (historyRef.current[next] ?? ''))
    }
  }

  const tap = (cmd: string) => {
    if (cmd === 'clear') { run('clear'); return }
    setInput(cmd)
    inputRef.current?.focus()
  }

  return (
    <MobileAppShell title="Terminal" color={ACCENT} subtitle="bash · v1">
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          background: '#000',
          border: '1px solid rgba(0,255,127,0.18)',
          borderRadius: 8,
          boxShadow: '0 0 0 1px rgba(0,255,127,0.08), 0 6px 18px rgba(0,0,0,0.35), inset 0 0 80px rgba(0,255,127,0.04)',
          minHeight: '52vh',
          padding: '12px 12px 8px',
          fontFamily: "'Space Mono', ui-monospace, Menlo, Consolas, monospace",
          fontSize: 12.5,
          lineHeight: 1.55,
          color: ACCENT,
          overflowY: 'auto',
          cursor: 'text',
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', minHeight: '1em' }}>{line || ' '}</div>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ userSelect: 'none' }}>{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: ACCENT,
              caretColor: ACCENT,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              padding: 0,
            }}
          />
        </div>

        <div ref={bottomRef} />
      </div>

      <div
        style={{
          marginTop: 14,
          display: 'flex', flexWrap: 'wrap', gap: 6,
        }}
      >
        {QUICK_COMMANDS.map(c => (
          <button
            key={c}
            onClick={() => tap(c)}
            style={{
              padding: '6px 10px',
              background: 'rgba(0,255,127,0.06)',
              color: ACCENT,
              border: `1px solid rgba(0,255,127,0.32)`,
              borderRadius: 4,
              fontFamily: "'Space Mono', ui-monospace, monospace",
              fontSize: 10.5, fontWeight: 700,
              letterSpacing: 1.2, textTransform: 'uppercase',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </MobileAppShell>
  )
}
