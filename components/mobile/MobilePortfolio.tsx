'use client'

import { useState, useEffect } from 'react'
import { siteConfig } from '@/content/siteConfig'
import { experiences } from '@/content/experience'
import { projects } from '@/content/projects'
import { skills } from '@/content/skills'

type PostMeta = { slug: string; title: string; date: string; readingTime: string; category: string; excerpt: string }
type Post = PostMeta & { content: string }

const m = {
  bg: '#0c1626',
  bgCard: '#0f1e38',
  bgCardHover: '#162440',
  border: '#1e3356',
  borderLight: '#243d69',
  text: '#e8edf8',
  textSec: 'rgba(210,220,240,0.75)',
  textMuted: 'rgba(160,180,220,0.5)',
  accent: '#4d8ef5',
  accentBg: 'rgba(77,142,245,0.12)',
  accentBorder: 'rgba(77,142,245,0.3)',
  success: '#3fb950',
  successBg: 'rgba(63,185,80,0.12)',
}

const CAT_COLORS: Record<string, string> = {
  'Dev Log': '#58a6ff',
  'Life': '#3fb950',
  'Career': '#f0a020',
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: m.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${m.border}` }}>
      {title}
    </div>
  )
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

function PostReader({ post, onBack }: { post: Post; onBack: () => void }) {
  const blocks = post.content.split('\n\n').filter(Boolean)
  return (
    <div style={{ position: 'fixed', inset: 0, background: m.bg, overflowY: 'auto', padding: '20px 16px 80px', zIndex: 100, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24, background: 'transparent', border: `1px solid ${m.border}`, borderRadius: 8, color: m.textSec, fontSize: 13, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
        ← Back
      </button>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${CAT_COLORS[post.category] ?? m.accent}18`, color: CAT_COLORS[post.category] ?? m.accent }}>{post.category}</span>
        <span style={{ fontSize: 11, color: m.textMuted }}>{post.readingTime} · {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: m.text, lineHeight: 1.3, marginBottom: 24 }}>{post.title}</h1>
      <div>
        {blocks.map((para, i) => {
          const t = para.trim()
          if (t.startsWith('# ')) return null
          if (t.startsWith('## ')) return <h2 key={i} style={{ fontSize: 16, fontWeight: 700, color: m.text, margin: '22px 0 10px', paddingBottom: 6, borderBottom: `1px solid ${m.border}` }}>{t.replace(/^## /, '')}</h2>
          if (t === '---') return <hr key={i} style={{ border: 'none', borderTop: `1px solid ${m.border}`, margin: '16px 0' }} />
          const lines = t.split('\n')
          if (lines.length > 1 && lines.every(l => /^[-*]\s/.test(l))) {
            return <ul key={i} style={{ margin: '8px 0 12px', paddingLeft: 18 }}>{lines.map((l, j) => <li key={j} style={{ color: m.textSec, fontSize: 13, lineHeight: 1.7, marginBottom: 3 }}>{renderInline(l.replace(/^[-*]\s/, ''))}</li>)}</ul>
          }
          if (lines.length > 1 && lines.every(l => /^\d+\.\s/.test(l))) {
            return <ol key={i} style={{ margin: '8px 0 12px', paddingLeft: 18 }}>{lines.map((l, j) => <li key={j} style={{ color: m.textSec, fontSize: 13, lineHeight: 1.7, marginBottom: 3 }}>{renderInline(l.replace(/^\d+\.\s/, ''))}</li>)}</ol>
          }
          if (t.startsWith('*') && t.endsWith('*') && !t.startsWith('**')) {
            return <p key={i} style={{ color: m.textMuted, fontSize: 12, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 10 }}>{t.slice(1, -1)}</p>
          }
          return <p key={i} style={{ color: m.textSec, fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>{renderInline(t)}</p>
        })}
      </div>
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'home', label: 'About', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke={a ? m.accent : m.textMuted} strokeWidth="1.5"/><path d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={a ? m.accent : m.textMuted} strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { id: 'work', label: 'Work', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="7" width="16" height="10" rx="2" stroke={a ? m.accent : m.textMuted} strokeWidth="1.5"/><path d="M7 7V6a3 3 0 016 0v1" stroke={a ? m.accent : m.textMuted} strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { id: 'projects', label: 'Projects', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke={a ? m.accent : m.textMuted} strokeWidth="1.4"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke={a ? m.accent : m.textMuted} strokeWidth="1.4"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke={a ? m.accent : m.textMuted} strokeWidth="1.4"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke={a ? m.accent : m.textMuted} strokeWidth="1.4"/></svg> },
  { id: 'blog', label: 'Blog', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2" stroke={a ? m.accent : m.textMuted} strokeWidth="1.5"/><path d="M7 7h6M7 10h6M7 13h4" stroke={a ? m.accent : m.textMuted} strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'contact', label: 'Contact', icon: (a: boolean) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke={a ? m.accent : m.textMuted} strokeWidth="1.5"/><path d="M2 7l8 5 8-5" stroke={a ? m.accent : m.textMuted} strokeWidth="1.3" strokeLinecap="round"/></svg> },
]

export default function MobilePortfolio() {
  const [posts, setPosts] = useState<PostMeta[]>([])
  const [openPost, setOpenPost] = useState<Post | null>(null)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then((data: PostMeta[]) => setPosts(data)).catch(() => {})
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveTab(id)
  }

  async function openPostDetail(slug: string) {
    try {
      const res = await fetch(`/api/posts/${slug}`)
      setOpenPost(await res.json())
    } catch { /* ignore */ }
  }

  if (openPost) return <PostReader post={openPost} onBack={() => setOpenPost(null)} />

  return (
    <div style={{ background: m.bg, minHeight: '100dvh', color: m.text, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>

      {/* Hero */}
      <section id="home" style={{ padding: '28px 16px 20px', borderBottom: `1px solid ${m.border}` }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 14 }}>
          <img src="/me.jpg" alt={siteConfig.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${m.accentBorder}`, boxShadow: `0 0 0 3px ${m.accentBg}` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.text, marginBottom: 3, letterSpacing: -0.3 }}>{siteConfig.name}</div>
            <div style={{ fontSize: 12, color: m.accent, fontWeight: 500, marginBottom: 10, lineHeight: 1.4 }}>{siteConfig.title}</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: m.successBg, border: `1px solid rgba(63,185,80,0.3)`, color: m.success, fontSize: 11, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.success, display: 'inline-block', flexShrink: 0 }} />
              Working for Growth
            </span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: m.textSec, lineHeight: 1.75, margin: '0 0 16px' }}>{siteConfig.description}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px 8px', borderRadius: 8, background: m.accent, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>LinkedIn</a>
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px 8px', borderRadius: 8, background: m.bgCard, border: `1px solid ${m.border}`, color: m.text, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>GitHub</a>
          <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px 16px', borderRadius: 8, background: m.bgCard, border: `1px solid ${m.border}`, color: m.text, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Resume</a>
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: m.border, borderBottom: `1px solid ${m.border}` }}>
        {siteConfig.stats.map(s => (
          <div key={s.label} style={{ padding: '14px 6px', textAlign: 'center', background: m.bgCard }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: m.accent }}>{s.value}</div>
            <div style={{ fontSize: 9, color: m.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Currently */}
      <section style={{ padding: '16px', borderBottom: `1px solid ${m.border}` }}>
        <SectionHeader title="Currently" />
        {siteConfig.currently.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: i < siteConfig.currently.length - 1 ? `1px solid ${m.borderLight}` : 'none' }}>
            <div style={{ width: 70, fontSize: 10, color: m.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, paddingTop: 2, flexShrink: 0 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: m.text, lineHeight: 1.5 }}>{item.value}</div>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section id="work" style={{ padding: '16px', borderBottom: `1px solid ${m.border}` }}>
        <SectionHeader title="Experience & Education" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {experiences.map(exp => (
            <div key={exp.id} style={{ background: m.bgCard, border: `1px solid ${m.border}`, borderLeft: `3px solid ${exp.accentColor}`, borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: m.text, marginBottom: 2, lineHeight: 1.3 }}>{exp.role}</div>
                  <div style={{ fontSize: 12, color: exp.accentColor, fontWeight: 500 }}>{exp.company}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: m.textMuted, marginBottom: 4, whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.endDate}</div>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: 9, fontWeight: 600, background: `${exp.accentColor}18`, color: exp.accentColor }}>{exp.type}</span>
                    {exp.current && <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: 9, fontWeight: 600, background: m.successBg, color: m.success }}>Now</span>}
                  </div>
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {exp.description.map((d, j) => (
                  <li key={j} style={{ display: 'flex', gap: 7, color: m.textSec, fontSize: 11, lineHeight: 1.6 }}>
                    <span style={{ color: exp.accentColor, flexShrink: 0, fontSize: 9, marginTop: 4 }}>▸</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" style={{ padding: '16px', borderBottom: `1px solid ${m.border}` }}>
        <SectionHeader title="Projects" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.filter(p => p.featured).map(proj => (
            <div key={proj.id} style={{ background: m.bgCard, border: `1px solid ${m.border}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: 4, background: proj.gradient }} />
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: m.text }}>{proj.title}</div>
                  <div style={{ fontSize: 10, color: m.textMuted }}>{proj.year}</div>
                </div>
                <p style={{ fontSize: 12, color: m.textSec, lineHeight: 1.6, margin: '0 0 10px' }}>{proj.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: (proj.github || proj.live) ? 10 : 0 }}>
                  {proj.tech.slice(0, 4).map(t => (
                    <span key={t} style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, background: m.accentBg, color: m.accent, border: `1px solid ${m.accentBorder}` }}>{t}</span>
                  ))}
                </div>
                {(proj.github || proj.live) && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: m.accent, textDecoration: 'none', fontWeight: 600 }}>GitHub →</a>}
                    {proj.live && <a href={proj.live} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: m.accent, textDecoration: 'none', fontWeight: 600 }}>Live →</a>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section style={{ padding: '16px', borderBottom: `1px solid ${m.border}` }}>
        <SectionHeader title="Skills" />
        {(['Engineering', 'Programming', 'Design', 'Finance', 'AI'] as const).map(cat => {
          const catSkills = skills.filter(s => s.category === cat)
          if (!catSkills.length) return null
          return (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: m.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>{cat}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {catSkills.map(skill => (
                  <span key={skill.name} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, background: `${skill.color}15`, color: skill.color, border: `1px solid ${skill.color}30`, fontWeight: 500 }}>{skill.name}</span>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Blog */}
      <section id="blog" style={{ padding: '16px', borderBottom: `1px solid ${m.border}` }}>
        <SectionHeader title="Blog" />
        {posts.length === 0
          ? <div style={{ color: m.textMuted, fontSize: 13 }}>Loading posts…</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {posts.map(post => (
                <div key={post.slug} onClick={() => openPostDetail(post.slug)} style={{ background: m.bgCard, border: `1px solid ${m.border}`, borderLeft: `3px solid ${CAT_COLORS[post.category] ?? m.accent}`, borderRadius: 8, padding: 14, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: CAT_COLORS[post.category] ?? m.accent, fontWeight: 600 }}>{post.category}</span>
                    <span style={{ fontSize: 10, color: m.textMuted }}>{post.readingTime} · {new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: m.text, marginBottom: 4, lineHeight: 1.3 }}>{post.title}</div>
                  <div style={{ fontSize: 12, color: m.textSec, lineHeight: 1.5 }}>{post.excerpt}</div>
                </div>
              ))}
            </div>
          )
        }
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '16px' }}>
        <SectionHeader title="Get in Touch" />
        <p style={{ fontSize: 13, color: m.textSec, lineHeight: 1.75, marginBottom: 16 }}>
          Open to PM, finance, and startup internships — remote, Mumbai, or abroad.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href={`mailto:${siteConfig.email}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, background: m.accent, color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Send an Email
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, background: m.bgCard, border: `1px solid ${m.border}`, color: m.text, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Connect on LinkedIn
          </a>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: m.bgCard, borderTop: `1px solid ${m.border}`, display: 'flex', alignItems: 'stretch', paddingBottom: 'env(safe-area-inset-bottom, 0px)', zIndex: 50 }}>
        {NAV_ITEMS.map(tab => (
          <button key={tab.id} onClick={() => scrollTo(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, border: 'none', background: 'transparent', padding: '10px 4px', color: activeTab === tab.id ? m.accent : m.textMuted, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent' }}>
            {tab.icon(activeTab === tab.id)}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
