import { getProfile, proficiencyLabel } from '@/lib/profile'

// Plain semantic rendering of /content. Shared by the no-JS fallback on / and the
// /profile route so the two can never describe Hryday differently.
export default function ProfileDocument() {
  const p = getProfile()

  const skillsByCategory = p.skills.reduce<Record<string, typeof p.skills>>((acc, s) => {
    ;(acc[s.category] ??= []).push(s)
    return acc
  }, {})

  return (
    <main className="profile-doc">
      <header>
        <h1>{p.name}</h1>
        <p className="lede">{p.title}</p>
        <ul className="inline">
          <li>{p.location}</li>
          <li><a href={`mailto:${p.email}`}>{p.email}</a></li>
          <li><a href={p.github} rel="me noopener noreferrer">GitHub</a></li>
          <li><a href={p.linkedin} rel="me noopener noreferrer">LinkedIn</a></li>
          <li><a href="/resume.pdf">Résumé (PDF)</a></li>
        </ul>
      </header>

      <section aria-labelledby="h-about">
        <h2 id="h-about">About</h2>
        <p>{p.description}</p>
        <dl className="stats">
          {p.stats.map(s => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="h-now">
        <h2 id="h-now">Currently</h2>
        <dl>
          {p.currently.map(c => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd>{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="h-exp">
        <h2 id="h-exp">Experience</h2>
        {p.work.map(e => (
          <article key={e.id}>
            <h3>{e.role}, {e.company}</h3>
            <p className="meta">
              {e.startDate} – {e.endDate} · {e.location} · {e.type}
            </p>
            <ul>{e.description.map((d, i) => <li key={i}>{d}</li>)}</ul>
          </article>
        ))}
      </section>

      <section aria-labelledby="h-edu">
        <h2 id="h-edu">Education</h2>
        {p.education.map(e => (
          <article key={e.id}>
            <h3>{e.role}, {e.company}</h3>
            <p className="meta">{e.startDate} – {e.endDate} · {e.location}</p>
            <ul>{e.description.map((d, i) => <li key={i}>{d}</li>)}</ul>
          </article>
        ))}
      </section>

      <section aria-labelledby="h-proj">
        <h2 id="h-proj">Projects</h2>
        {p.projects.map(pr => (
          <article key={pr.id}>
            <h3>
              {pr.live
                ? <a href={pr.live} rel="noopener noreferrer">{pr.title}</a>
                : pr.title}
            </h3>
            <p className="meta">{pr.year} · {pr.category}</p>
            <p>{pr.longDescription}</p>
            <p className="meta">Tech: {pr.tech.join(', ')}</p>
            {pr.github && (
              <p><a href={pr.github} rel="noopener noreferrer">Source on GitHub</a></p>
            )}
          </article>
        ))}
      </section>

      <section aria-labelledby="h-skills">
        <h2 id="h-skills">Skills</h2>
        {Object.entries(skillsByCategory).map(([category, list]) => (
          <div key={category}>
            <h3>{category}</h3>
            <ul>
              {list.map(s => (
                <li key={s.name}>{s.name}: {proficiencyLabel(s.proficiency)}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {p.posts.length > 0 && (
        <section aria-labelledby="h-writing">
          <h2 id="h-writing">Writing</h2>
          <ul>
            {p.posts.map(post => (
              <li key={post.slug}>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
                <span className="meta"> · {post.date} · {post.readingTime}</span>
                <p>{post.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
