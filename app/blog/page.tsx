import Link from 'next/link'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { getAllPosts } from '@/lib/posts'

export const metadata = {
  title: 'Blog — Hryday Lath',
  description: 'Thoughts on development, design, and life at BITS Pilani.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-amber-400 transition-colors mb-12 text-sm">
          <ArrowLeft size={14} />
          Back home
        </Link>
        <h1 className="text-5xl font-bold text-white mb-2">Blog<span className="text-amber-400">.</span></h1>
        <p className="text-white/40 mb-12">Thoughts, tutorials, and life updates.</p>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="glass rounded-2xl p-6 hover:border-amber-400/20 transition-all duration-300 hover:-translate-y-0.5 group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-2 py-0.5 bg-amber-400/10 text-amber-400 rounded-full">{post.category}</span>
                  <span className="flex items-center gap-1 text-xs text-white/30">
                    <Calendar size={10} />{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/30">
                    <Clock size={10} />{post.readingTime}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">{post.title}</h2>
                <p className="text-white/50 text-sm">{post.excerpt}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
