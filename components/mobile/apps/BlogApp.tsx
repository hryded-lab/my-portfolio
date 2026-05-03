'use client'

import { useEffect, useState } from 'react'
import MobileAppShell, { BrutalistTag } from '../MobileAppShell'
import { mobileTheme as t } from '../mobileTheme'
import { brutal as b } from '../../brutal'

const COLOR = '#4ee8e8'

const CAT_COLORS: Record<string, string> = {
  'Dev Log': '#4ab8ff',
  'Life':    '#4ed670',
  'Career':  '#ffb83a',
}

type PostMeta = {
  slug: string; title: string; date: string;
  readingTime: string; category: string; excerpt: string
}
type Post = PostMeta & { content: string }

export default function BlogApp() {
  const [posts, setPosts]       = useState<PostMeta[]>([])
  const [openPost, setOpenPost] = useState<Post | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then((data: PostMeta[]) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function openDetail(slug: string) {
    try {
      const res = await fetch(`/api/posts/${slug}`)
      setOpenPost(await res.json())
    } catch { /* ignore */ }
  }

  if (openPost) {
    const c = CAT_COLORS[openPost.category] ?? COLOR
    return (
      <MobileAppShell
        title={openPost.title.length > 22 ? openPost.title.slice(0, 22) + '…' : openPost.title}
        color={c}
        subtitle={openPost.category}
        onInternalBack={() => setOpenPost(null)}
      >
        <PostBody post={openPost} />
      </MobileAppShell>
    )
  }

  return (
    <MobileAppShell title="Blog" color={COLOR} subtitle={posts.length ? `${posts.length} posts` : undefined}>
      {loading ? (
        <div style={{ color: b.textMute, fontFamily: t.fontMono, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase' }}>
          Loading…
        </div>
      ) : posts.length === 0 ? (
        <div style={{ color: b.textMute, fontFamily: t.fontMono, fontSize: 12 }}>No posts yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map((post, idx) => {
            const c = CAT_COLORS[post.category] ?? COLOR
            return (
              <button
                key={post.slug}
                onClick={() => openDetail(post.slug)}
                style={{
                  textAlign: 'left',
                  background: b.surface,
                  border: `1.5px solid ${b.border}`,
                  borderRadius: b.radius,
                  boxShadow: b.shadow(c),
                  padding: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  WebkitTapHighlightColor: 'transparent',
                  position: 'relative',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -10, left: 12,
                    background: b.bgDeep,
                    color: c,
                    fontFamily: t.fontMono, fontWeight: 700,
                    fontSize: 10, letterSpacing: 1.4,
                    padding: '2px 8px',
                    border: `1.5px solid ${c}`,
                    borderRadius: 4,
                  }}
                >
                  №{String(idx + 1).padStart(2, '0')}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, marginBottom: 8 }}>
                  <BrutalistTag color={c} filled>{post.category}</BrutalistTag>
                  <span style={{ fontFamily: t.fontMono, fontSize: 10, color: b.textMute, letterSpacing: 0.4 }}>
                    {post.readingTime} · {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 18, fontWeight: 800, color: b.text, lineHeight: 1.15,
                    fontFamily: t.fontDisplay, letterSpacing: -0.6,
                    marginBottom: 8,
                  }}
                >
                  {post.title}
                </div>
                <div style={{ fontSize: 12.5, color: b.textDim, lineHeight: 1.55, fontFamily: t.fontUi }}>
                  {post.excerpt}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </MobileAppShell>
  )
}

function PostBody({ post }: { post: Post }) {
  const blocks = post.content.split('\n\n').filter(Boolean)
  const c = CAT_COLORS[post.category] ?? COLOR

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <BrutalistTag color={c} filled>{post.category}</BrutalistTag>
        <span style={{ fontFamily: t.fontMono, fontSize: 10.5, color: b.textDim, letterSpacing: 0.4 }}>
          {post.readingTime} · {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <h1
        style={{
          fontSize: 26, fontWeight: 800, color: b.text, lineHeight: 1.1,
          marginBottom: 22, fontFamily: t.fontDisplay, letterSpacing: -0.9,
        }}
      >
        {post.title}
      </h1>
      <div>
        {blocks.map((para, i) => {
          const txt = para.trim()
          if (txt.startsWith('# ')) return null
          if (txt.startsWith('## '))
            return (
              <h2
                key={i}
                style={{
                  fontSize: 12, fontWeight: 700, color: b.text,
                  margin: '24px 0 10px',
                  paddingBottom: 6,
                  fontFamily: t.fontMono, letterSpacing: 1.6,
                  textTransform: 'uppercase',
                  borderBottom: `1.5px solid ${c}`,
                }}
              >
                ▸ {txt.replace(/^## /, '')}
              </h2>
            )
          if (txt === '---') return <hr key={i} style={{ border: 'none', borderTop: `1px solid ${b.border}`, margin: '18px 0' }} />
          const lines = txt.split('\n')
          if (lines.length > 1 && lines.every(l => /^[-*]\s/.test(l)))
            return (
              <ul key={i} style={{ margin: '8px 0 14px', paddingLeft: 14, listStyle: 'none' }}>
                {lines.map((l, j) => (
                  <li
                    key={j}
                    style={{
                      color: b.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 6,
                      fontFamily: t.fontUi,
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ width: 5, height: 5, background: c, borderRadius: 999, marginTop: 9, flexShrink: 0 }} />
                    <span>{renderInline(l.replace(/^[-*]\s/, ''))}</span>
                  </li>
                ))}
              </ul>
            )
          if (txt.startsWith('*') && txt.endsWith('*') && !txt.startsWith('**'))
            return (
              <p key={i} style={{ color: b.textMute, fontSize: 12, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 12, fontFamily: t.fontMono }}>
                {txt.slice(1, -1)}
              </p>
            )
          return (
            <p key={i} style={{ color: b.textDim, fontSize: 13.5, lineHeight: 1.8, marginBottom: 16, fontFamily: t.fontUi }}>
              {renderInline(txt)}
            </p>
          )
        })}
      </div>
    </div>
  )
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} style={{ color: b.text }}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*')  && part.endsWith('*'))  return <em     key={i}>{part.slice(1, -1)}</em>
    return part
  })
}
