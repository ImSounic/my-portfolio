'use client'

import { NOTES } from '@/themes/contributions/data'

// ─── NOTES ON THE WALL: six opinions, each with the work behind it ────
export function Notes() {
  return (
    <section id="notes" className="dk-section" aria-labelledby="notes-title">
      <h2 id="notes-title" className="dk-head" data-reveal style={{ marginBottom: 'clamp(28px, 4vw, 48px)' }}>
        Notes on the wall
      </h2>
      <ul className="dk-notes">
        {NOTES.map((n, i) => (
          <li key={n.title} data-reveal style={{ ['--i' as string]: i }}>
            <h3 className="dk-notes__title">{n.title}</h3>
            <p>{n.body}</p>
            <p className="dk-notes__from">{n.from}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
