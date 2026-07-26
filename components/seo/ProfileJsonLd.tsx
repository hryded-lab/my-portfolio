import { buildPersonJsonLd, buildWebsiteJsonLd } from '@/lib/profile'

// Emitted server-side on every render, derived from /content. Editing a project or
// experience file updates the structured data with no separate step.
export default function ProfileJsonLd() {
  const graph = [buildPersonJsonLd(), buildWebsiteJsonLd()]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
