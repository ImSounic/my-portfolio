'use client'

import { profile } from '@/data/portfolio'
import { LETTER } from '@/themes/contributions/data'

// ─── ABOUT ME: a portrait print, and the letter on the back of it ─────
export function About() {
  return (
    <section id="about" className="dk-section" aria-labelledby="about-title">
      <h2 id="about-title" className="dk-head" data-reveal style={{ marginBottom: 'clamp(32px, 4vw, 56px)' }}>
        About me
      </h2>
      <div className="dk-about">
        <figure className="dk-about__print" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/contrib/me.jpg" alt={`Portrait of ${profile.name}`} width={312} height={330} loading="lazy" />
          <figcaption><p>{profile.firstName}, Enschede</p></figcaption>
        </figure>
        <div className="dk-about__back" data-reveal style={{ ['--i' as string]: 1 }}>
          {LETTER.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
