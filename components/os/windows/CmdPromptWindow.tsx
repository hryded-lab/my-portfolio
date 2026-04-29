'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useWindowManager } from '@/lib/windowManager'
import { siteConfig } from '@/content/siteConfig'
import { projects } from '@/content/projects'
import { experiences } from '@/content/experience'
import { skills } from '@/content/skills'

const PROMPT = 'C:\\Users\\Hryday>'

const COLORS: Record<string, string> = {
  white:  '#c0c0c0',
  green:  '#00ff41',
  cyan:   '#00ffff',
  yellow: '#ffff55',
  red:    '#ff5555',
  blue:   '#8be9fd',
  pink:   '#ff79c6',
  orange: '#ffb86c',
}

const LEVELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']

const BOOT_LINES = [
  'Microsoft Windows XP [Version 5.1.2600]',
  '(C) Copyright 1985-2001 Microsoft Corp.',
  '',
]

export default function CmdPromptWindow() {
  const { closeWindow } = useWindowManager()
  const [lines, setLines] = useState<string[]>(BOOT_LINES)
  const [input, setInput] = useState('')
  const [textColor, setTextColor] = useState(COLORS.white)
  const [locked, setLocked] = useState(false)
  const cmdHistoryRef = useRef<string[]>([])
  const historyIdxRef = useRef(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => { timerIdsRef.current.forEach(clearTimeout) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [lines])

  const push = useCallback((...newLines: string[]) => {
    setLines(prev => [...prev, ...newLines])
  }, [])

  const runCommand = useCallback((raw: string) => {
    const full = raw.trim()
    const cmd = full.toLowerCase()

    if (cmd === 'cls' || cmd === 'clear') {
      setLines([...BOOT_LINES])
      return
    }

    if (cmd === 'exit') {
      closeWindow('cmdprompt')
      return
    }

    push(`${PROMPT} ${full}`)
    if (!cmd) return

    const h = cmdHistoryRef.current
    cmdHistoryRef.current = [full, ...h.filter(c => c !== full)]
    historyIdxRef.current = -1

    if (cmd === 'help') {
      push(
        '',
        'Available commands:',
        '',
        '  whoami      About Hryday',
        '  skills      Tech stack and proficiency',
        '  projects    Project portfolio',
        '  experience  Work and education history',
        '  contact     Contact information',
        '  resume      Open resume PDF',
        '  dir         List portfolio files',
        '  color       Change text color',
        '  date        Current date',
        '  ver         System version',
        '  echo [text] Print text to screen',
        '  cls         Clear the screen',
        '  exit        Close this window',
        '',
        "  Psst: try something creative...",
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
        ...siteConfig.currently.map(c => `${c.label}: ${c.value}`),
        '',
      )
    } else if (cmd === 'skills') {
      const cats = ['Engineering', 'Programming', 'Design', 'Finance', 'AI'] as const
      const out: string[] = ['']
      for (const cat of cats) {
        const items = skills.filter(s => s.category === cat)
        if (items.length) out.push(`${cat.padEnd(14)}${items.map(s => `${s.name} (${LEVELS[s.proficiency]})`).join('  ·  ')}`)
      }
      out.push('')
      push(...out)
    } else if (cmd === 'projects') {
      push(
        '',
        ...projects.map(p => `[${p.year}]  ${p.title.padEnd(20)} ${p.description}`),
        '',
      )
    } else if (cmd === 'experience') {
      push(
        '',
        ...experiences.map(e =>
          `${(e.startDate + ' – ' + e.endDate).padEnd(26)} ${e.role} · ${e.company}`
        ),
        '',
      )
    } else if (cmd === 'contact') {
      push(
        '',
        `Email    : ${siteConfig.email}`,
        `LinkedIn : ${siteConfig.linkedin}`,
        '',
      )
    } else if (cmd === 'resume') {
      window.open(siteConfig.resume, '_blank')
      push('', 'Opening resume.pdf...', '')
    } else if (cmd === 'dir') {
      const d = new Date()
      const ds = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`
      push(
        '',
        ' Volume in drive C has no label.',
        ' Volume Serial Number is H4YD-2026',
        '',
        ' Directory of C:\\Users\\Hryday\\Portfolio',
        '',
        `${ds}  10:30 AM    <DIR>          .`,
        `${ds}  10:30 AM    <DIR>          ..`,
        `${ds}  10:30 AM             2,048 about.txt`,
        `${ds}  10:30 AM             4,096 projects.txt`,
        `${ds}  10:30 AM             1,024 skills.txt`,
        `${ds}  10:30 AM             3,072 experience.txt`,
        `${ds}  10:30 AM           512,000 resume.pdf`,
        `${ds}  10:30 AM             1,024 contact.txt`,
        '               6 File(s)        523,264 bytes',
        '               2 Dir(s)   ∞ bytes free',
        '',
      )
    } else if (cmd === 'date') {
      const d = new Date()
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      push('', `The current date is: ${days[d.getDay()]} ${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`, '')
    } else if (cmd === 'ver') {
      push('', 'Microsoft Windows XP [Version 5.1.2600]', '')
    } else if (cmd.startsWith('echo')) {
      const text = full.slice(4).trim()
      push('', text || 'ECHO is on.', '')
    } else if (cmd === 'color') {
      push(
        '',
        `Available colors: ${Object.keys(COLORS).join(', ')}`,
        '',
        'Usage: color <name>   e.g. color green',
        '',
      )
    } else if (cmd.startsWith('color ')) {
      const name = cmd.slice(6).trim()
      if (COLORS[name]) {
        setTextColor(COLORS[name])
        push('', `Text color changed to ${name}.`, '')
      } else {
        push('', `Unknown color "${name}". Type "color" to see options.`, '')
      }
    } else if (cmd === 'sudo hire hryday' || cmd === 'hire hryday') {
      setLocked(true)
      const seq = [
        { text: '',                                                  delay: 0    },
        { text: 'sudo: this is not a unix system... but fine.',     delay: 400  },
        { text: '',                                                  delay: 500  },
        { text: 'Verifying qualifications...',                       delay: 700  },
        { text: '  [■■■■■■■■■■■■■■■■■■■■] 100%',                 delay: 1500 },
        { text: '',                                                  delay: 500  },
        { text: '  ✓ Solid project portfolio',                      delay: 400  },
        { text: '  ✓ Full-stack experience',                        delay: 350  },
        { text: '  ✓ Ships things fast',                            delay: 300  },
        { text: '  ✓ Available and interested',                     delay: 300  },
        { text: '',                                                  delay: 500  },
        { text: 'ACCESS GRANTED. Initiating hire sequence...',      delay: 800  },
        { text: "Opening LinkedIn... good luck, he's worth it.",    delay: 1000 },
        { text: '',                                                  delay: 300  },
      ]
      let t = 0
      timerIdsRef.current.forEach(clearTimeout)
      timerIdsRef.current = []
      seq.forEach(({ text, delay }, i) => {
        t += delay
        const id = setTimeout(() => {
          setLines(prev => [...prev, text])
          if (i === seq.length - 1) {
            window.open(siteConfig.linkedin, '_blank')
            setLocked(false)
          }
        }, t)
        timerIdsRef.current.push(id)
      })
    } else {
      push(
        '',
        `'${full}' is not recognized as an internal or external command,`,
        'operable program or batch file.',
        '',
      )
    }
  }, [push, closeWindow])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = input
      setInput('')
      historyIdxRef.current = -1
      runCommand(val)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const h = cmdHistoryRef.current
      const next = Math.min(historyIdxRef.current + 1, h.length - 1)
      historyIdxRef.current = next
      if (h[next] !== undefined) setInput(h[next])
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdxRef.current - 1, -1)
      historyIdxRef.current = next
      setInput(next === -1 ? '' : cmdHistoryRef.current[next] ?? '')
    }
  }, [input, runCommand])

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        width: '100%',
        height: '100%',
        background: '#0d0d0d',
        fontFamily: "'Lucida Console', 'Courier New', monospace",
        fontSize: 12,
        color: textColor,
        padding: '8px 10px',
        overflowY: 'auto',
        boxSizing: 'border-box',
        cursor: 'text',
        userSelect: 'text',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, minHeight: '1.6em' }}>
            {line || ' '}
          </div>
        ))}
      </div>

      {!locked && (
        <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1.6 }}>
          <span style={{ userSelect: 'none', whiteSpace: 'pre' }}>{PROMPT} </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: textColor,
              caretColor: textColor,
              fontFamily: "'Lucida Console', 'Courier New', monospace",
              fontSize: 12,
              padding: 0,
              margin: 0,
            }}
          />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
