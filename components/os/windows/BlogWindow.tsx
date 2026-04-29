'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/themeContext'

type PostMeta = { slug: string; title: string; date: string; readingTime: string; category: string; excerpt: string }
type Post = PostMeta & { content: string }

const categoryColors: Record<string, string> = {
  'Dev Log': '#58a6ff',
  'Life': '#3fb950',
  'Career': '#f0a020',
}

export default function BlogWindow() {
  const { t } = useTheme()
  const [posts, setPosts] = useState<PostMeta[]>([])
  const [selected, setSelected] = useState<Post | null>(null)
  const [loadingPost, setLoadingPost] = useState(false)

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then((data: PostMeta[]) => setPosts(data))
      .catch(() => {})
  }, [])

  async function selectPost(slug: string) {
    if (loadingPost) return
    setLoadingPost(true)
    try {
      const res = await fetch(`/api/posts/${slug}`)
      setSelected(await res.json())
    } catch { /* ignore */ }
    setLoadingPost(false)
  }

  if (selected) {
    return (
      <div style={{ padding: 20, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, height: '100%', overflowY: 'auto', background: t.bg, color: t.text, transition: 'background 0.2s' }}>
        <button onClick={() => setSelected(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '6px 14px', borderRadius: 6, background: 'transparent', border: `1px solid ${t.border}`, color: t.textSecondary, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back to Posts
        </button>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${categoryColors[selected.category] ?? t.accent}18`, color: categoryColors[selected.category] ?? t.accent }}>{selected.category}</span>
            <span style={{ fontSize: 11, color: t.textMuted }}>{selected.readingTime} · {new Date(selected.date).toLocaleDateString()}</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: '0 0 18px', lineHeight: 1.3, letterSpacing: -0.3 }}>{selected.title}</h1>
          <div style={{ color: t.textSecondary, lineHeight: 1.8 }}>
            {selected.content.split('\n\n').filter(Boolean).map((para, i) => {
              const p = para.trim()
              if (p.startsWith('# ') || p === '---') return null
              if (p.startsWith('## '))
                return <h2 key={i} style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: '20px 0 8px', paddingBottom: 6, borderBottom: `1px solid ${t.borderLight}` }}>{p.replace(/^## /, '')}</h2>
              return <p key={i} style={{ margin: '8px 0' }}>{p}</p>
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 20, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, height: '100%', overflowY: 'auto', background: t.bg, color: t.text, transition: 'background 0.2s' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${t.border}` }}>
        {posts.length > 0 ? `Recent Posts (${posts.length})` : 'Loading…'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posts.map(post => (
          <div
            key={post.slug}
            onClick={() => selectPost(post.slug)}
            style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderLeft: `3px solid ${categoryColors[post.category] ?? t.accent}`, borderRadius: 8, padding: '14px 16px', cursor: loadingPost ? 'default' : 'pointer', opacity: loadingPost ? 0.6 : 1, transition: 'border-color 0.15s, background 0.15s' }}
            onMouseEnter={e => { if (!loadingPost) { e.currentTarget.style.background = t.bgCardHover; e.currentTarget.style.borderLeftColor = t.accent } }}
            onMouseLeave={e => { e.currentTarget.style.background = t.bgCard; e.currentTarget.style.borderLeftColor = categoryColors[post.category] ?? t.accent }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${categoryColors[post.category] ?? t.accent}18`, color: categoryColors[post.category] ?? t.accent }}>{post.category}</span>
              <span style={{ fontSize: 11, color: t.textMuted }}>{post.readingTime} · {new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: t.text, marginBottom: 5 }}>{post.title}</div>
            <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>{post.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
