'use client'

import { useState, useEffect } from 'react'
import { BrutalTag, BrutalHeader, BrutalBody, brutalFonts as bf, brutal as b } from '@/components/brutal'

type PostMeta = { slug: string; title: string; date: string; readingTime: string; category: string; excerpt: string }
type Post = PostMeta & { content: string }

const CAT_COLORS: Record<string, string> = {
  'Dev Log': '#4ab8ff',
  'Life':    '#4ed670',
  'Career':  '#ffb83a',
}

const COLOR = '#4ee8e8'

export default function BlogWindow() {
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
    const c = CAT_COLORS[selected.category] ?? COLOR
    return (
      <BrutalBody>
        <button
          onClick={() => setSelected(null)}
          style={{
            display: 'inline-flex', alignItems: 'center',
            marginBottom: 22,
            padding: '8px 14px',
            background: b.surface,
            color: b.text,
            border: `1.5px solid ${b.borderStrong}`,
            borderRadius: b.radiusSm,
            boxShadow: b.shadow(c),
            cursor: 'pointer',
            fontFamily: bf.mono,
            fontSize: 11, fontWeight: 700,
            letterSpacing: 1.4, textTransform: 'uppercase',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          ← Back to Posts
        </button>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <BrutalTag color={c} filled>{selected.category}</BrutalTag>
          <span style={{ fontFamily: bf.mono, fontSize: 11, color: b.textDim, letterSpacing: 0.4 }}>
            {selected.readingTime} · {new Date(selected.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <h1
          style={{
            fontSize: 32, fontWeight: 800, color: b.text, lineHeight: 1.05,
            letterSpacing: -1.2, fontFamily: bf.display,
            margin: '0 0 24px',
          }}
        >
          {selected.title}
        </h1>

        <div style={{ color: b.textDim, lineHeight: 1.8, fontSize: 14 }}>
          {selected.content.split('\n\n').filter(Boolean).map((para, i) => {
            const p = para.trim()
            if (p.startsWith('# ') || p === '---') return null
            if (p.startsWith('## '))
              return (
                <h2
                  key={i}
                  style={{
                    fontSize: 12, fontWeight: 700, color: b.text,
                    margin: '26px 0 12px',
                    paddingBottom: 8,
                    fontFamily: bf.mono, letterSpacing: 1.6,
                    textTransform: 'uppercase',
                    borderBottom: `1.5px solid ${c}`,
                  }}
                >
                  ▸ {p.replace(/^## /, '')}
                </h2>
              )
            return <p key={i} style={{ margin: '10px 0' }}>{p}</p>
          })}
        </div>
      </BrutalBody>
    )
  }

  return (
    <BrutalBody>
      <BrutalHeader title="Blog" subtitle={posts.length ? `${posts.length} posts` : 'Loading…'} color={COLOR} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {posts.map((post, i) => {
          const c = CAT_COLORS[post.category] ?? COLOR
          return (
            <button
              key={post.slug}
              onClick={() => selectPost(post.slug)}
              disabled={loadingPost}
              style={{
                position: 'relative',
                textAlign: 'left',
                background: b.surface,
                border: `1.5px solid ${b.border}`,
                borderRadius: b.radius,
                boxShadow: b.shadow(c),
                padding: '16px 18px',
                cursor: loadingPost ? 'default' : 'pointer',
                opacity: loadingPost ? 0.6 : 1,
                fontFamily: 'inherit',
                color: 'inherit',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -10, left: 14,
                  background: b.bgDeep,
                  color: c,
                  fontFamily: bf.mono, fontWeight: 700,
                  fontSize: 10, letterSpacing: 1.4,
                  padding: '2px 8px',
                  border: `1.5px solid ${c}`,
                  borderRadius: 4,
                }}
              >
                №{String(i + 1).padStart(2, '0')}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, marginBottom: 10, gap: 8 }}>
                <BrutalTag color={c} filled>{post.category}</BrutalTag>
                <span style={{ fontFamily: bf.mono, fontSize: 10.5, color: b.textDim, letterSpacing: 0.4 }}>
                  {post.readingTime} · {new Date(post.date).toLocaleDateString()}
                </span>
              </div>

              <div
                style={{
                  fontSize: 20, fontWeight: 800, color: b.text, lineHeight: 1.15,
                  fontFamily: bf.display, letterSpacing: -0.7,
                  marginBottom: 10,
                }}
              >
                {post.title}
              </div>
              <div style={{ fontSize: 13.5, color: b.textDim, lineHeight: 1.6 }}>
                {post.excerpt}
              </div>
            </button>
          )
        })}
      </div>
    </BrutalBody>
  )
}
