import { getPost } from '@/lib/posts'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const post = getPost(slug)
  if (!post) return new NextResponse('Not found', { status: 404 })
  return NextResponse.json(post)
}
