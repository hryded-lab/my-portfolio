'use client'

import { useState, useEffect } from 'react'
import { AppFrame, CommandBar, GroupHeading, Panel, ListRow, BluePanel, BlueHeading, BlueSub, ui, FONT } from '@/components/aeroApp'

type PostMeta = { slug: string; title: string; date: string; readingTime: string; category: string; excerpt: string }
type Post = PostMeta & { content: string }

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
    return (
      <AppFrame>
        <CommandBar>
          <BackButton onClick={() => setSelected(null)} />
          <span style={{ color: ui.textMute }}>{selected.category}</span>
        </CommandBar>

        <article style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 26px' }}>
          <BluePanel style={{ padding: '16px 18px' }}>
            <BlueHeading>{selected.title}</BlueHeading>
            <div style={{ fontFamily: FONT, fontSize: 12, marginTop: 6, color: 'rgba(255,255,255,0.80)' }}>
              {formatDate(selected.date)} · {selected.readingTime}
            </div>
          </BluePanel>

          <div style={{ marginTop: 18 }}>
            {selected.content.trim().split('\n\n').map((block, i) => (
              <Block key={i} raw={block.trim()} />
            ))}
          </div>
        </article>
      </AppFrame>
    )
  }

  return (
    <AppFrame>
      <CommandBar>
        <span style={{ color: ui.textDim }}>Blog</span>
        <span style={{ color: ui.textMute }}>
          {posts.length ? `${posts.length} posts` : 'Loading'}
        </span>
      </CommandBar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 22px' }}>
        <BluePanel style={{ padding: '14px 18px' }}>
          <BlueHeading>Writing</BlueHeading>
          <BlueSub>Notes on what I am building, and on student life at BITS Pilani.</BlueSub>
        </BluePanel>

        <GroupHeading label="All posts" count={posts.length || undefined} />
        <Panel style={{ padding: 6 }}>
          {posts.map((post, i) => (
            <div
              key={post.slug}
              role="button"
              tabIndex={0}
              onClick={() => selectPost(post.slug)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPost(post.slug) }
              }}
              style={{ cursor: 'pointer' }}
            >
              <ListRow alt={i % 2 === 1} style={{ alignItems: 'flex-start', padding: '9px 10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: ui.text }}>
                    {post.title}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 12, color: ui.textDim, marginTop: 3, lineHeight: 1.5 }}>
                    {post.excerpt}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 11.5, color: ui.textMute, marginTop: 5 }}>
                    {formatDate(post.date)} · {post.readingTime} · {post.category}
                  </div>
                </div>
              </ListRow>
            </div>
          ))}
        </Panel>
      </div>
    </AppFrame>
  )
}

function formatDate(d: string) {
  if (!d) return ''
  const parsed = new Date(d)
  if (Number.isNaN(parsed.getTime())) return d
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back to all posts"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 12px',
        borderRadius: ui.radius,
        border: `1px solid ${ui.border}`,
        background: 'var(--aw-btn)',
        color: ui.text,
        fontFamily: FONT, fontSize: 12.5,
        cursor: 'pointer',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 1px rgba(40,60,80,0.14)',
      }}
    >
      Back
    </button>
  )
}

// The API returns markdown-ish blocks; render the handful of shapes actually used.
function Block({ raw }: { raw: string }) {
  if (!raw || raw.startsWith('# ')) return null

  if (raw.startsWith('## ')) {
    return (
      <h2
        style={{
          fontFamily: FONT, fontSize: 15, fontWeight: 600,
          color: ui.text, margin: '22px 0 8px',
        }}
      >
        {raw.replace(/^## /, '')}
      </h2>
    )
  }

  if (raw === '---') {
    return <hr style={{ border: 'none', borderTop: `1px solid ${ui.borderSoft}`, margin: '20px 0' }} />
  }

  const lines = raw.split('\n')
  if (lines.length > 1 && lines.every(l => /^[-*]\s/.test(l))) {
    return (
      <ul style={{ margin: '0 0 14px 1.1rem', padding: 0 }}>
        {lines.map((l, i) => (
          <li key={i} style={{ fontFamily: FONT, fontSize: 12.5, color: ui.textDim, lineHeight: 1.7 }}>
            {l.replace(/^[-*]\s/, '')}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <p style={{ fontFamily: FONT, fontSize: 12.5, color: ui.textDim, lineHeight: 1.75, margin: '0 0 14px' }}>
      {raw}
    </p>
  )
}
