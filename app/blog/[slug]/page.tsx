import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { getPost, getAllPosts } from '@/lib/posts'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Hryday Lath`,
    description: post.excerpt,
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const blocks = post.content.trim().split('\n\n')

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors mb-12 text-sm">
          <ArrowLeft size={14} />
          Back to blog
        </Link>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-xs px-2 py-0.5 bg-amber-400/10 text-amber-400 rounded-full">{post.category}</span>
          <span className="flex items-center gap-1 text-xs text-white/30">
            <Calendar size={10} />{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/30">
            <Clock size={10} />{post.readingTime}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 leading-tight">{post.title}</h1>

        <div className="prose prose-lg max-w-none">
          {blocks.map((para, i) => {
            const p = para.trim()
            if (!p || p.startsWith('# ')) return null
            if (p.startsWith('## ')) {
              return <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{p.replace(/^## /, '')}</h2>
            }
            if (p === '---') {
              return <hr key={i} className="border-white/10 my-8" />
            }
            const lines = p.split('\n')
            if (lines.length > 1 && lines.every(l => /^[-*]\s/.test(l))) {
              return (
                <ul key={i} className="list-disc pl-5 mb-6 space-y-1">
                  {lines.map((l, j) => <li key={j} className="text-white/70">{l.replace(/^[-*]\s/, '')}</li>)}
                </ul>
              )
            }
            if (lines.length > 1 && lines.every(l => /^\d+\.\s/.test(l))) {
              return (
                <ol key={i} className="list-decimal pl-5 mb-6 space-y-1">
                  {lines.map((l, j) => <li key={j} className="text-white/70">{l.replace(/^\d+\.\s/, '')}</li>)}
                </ol>
              )
            }
            if (p.startsWith('*') && p.endsWith('*') && !p.startsWith('**')) {
              return <p key={i} className="text-white/40 italic text-sm mb-4">{p.slice(1, -1)}</p>
            }
            return <p key={i} className="text-white/70 leading-relaxed mb-6">{p}</p>
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <Link href="/blog" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm">
            <ArrowLeft size={14} />
            Back to all posts
          </Link>
        </div>
      </div>
    </div>
  )
}
