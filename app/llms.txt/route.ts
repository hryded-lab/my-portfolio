import { buildProfileText } from '@/lib/profile'

// /llms.txt — the emerging convention for handing AI crawlers a clean, complete
// summary instead of making them execute the client-side OS.
export function GET() {
  return new Response(buildProfileText(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
