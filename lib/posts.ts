import fs from 'fs'
import path from 'path'

export type PostMeta = {
  slug: string
  title: string
  date: string
  readingTime: string
  category: string
  excerpt: string
}

export type Post = PostMeta & { content: string }

function parseFrontmatter(raw: string): { meta: Record<string, string>; content: string } {
  const normalized = raw.replace(/\r\n/g, '\n')
  // Match opening ---, capture frontmatter (lazy), closing ---, then rest
  const match = normalized.match(/^---([\s\S]*?)---([\s\S]*)$/)
  if (!match) return { meta: {}, content: normalized.trim() }

  const meta: Record<string, string> = {}
  for (const line of match[1].trim().split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    let val = line.slice(colon + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (key) meta[key] = val
  }

  return { meta, content: match[2].trim() }
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')

export function getAllPosts(): PostMeta[] {
  try {
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'))
    return files
      .map(file => {
        const slug = file.replace('.mdx', '')
        const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
        const { meta } = parseFrontmatter(raw)
        return {
          slug,
          title: meta.title ?? '',
          date: meta.date ?? '',
          readingTime: meta.readingTime ?? '',
          category: meta.category ?? '',
          excerpt: meta.excerpt ?? '',
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export function getPost(slug: string): Post | null {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { meta, content } = parseFrontmatter(raw)
    return {
      slug,
      title: meta.title ?? '',
      date: meta.date ?? '',
      readingTime: meta.readingTime ?? '',
      category: meta.category ?? '',
      excerpt: meta.excerpt ?? '',
      content,
    }
  } catch {
    return null
  }
}
