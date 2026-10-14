'use client'

import { CHEMISTRY } from '@/themes/contributions/data'

// ─── STACK: skills only ──────────────────────────────────────────
export function Chemistry() {
  return (
    <section id="chemistry" className="dk-section" aria-labelledby="chem-title">
      <div className="dk-section__intro" data-reveal>
        <h2 id="chem-title" className="dk-head">Stack</h2>
        <p>What I build with.</p>
      </div>
      <ul className="dk-chem">
        {CHEMISTRY.map((g, i) => (
          <li key={g.name} data-reveal style={{ ['--i' as string]: i }}>
            <h3 className="dk-chem__name dk-small" style={{ fontSize: 'var(--t-body)' }}>{g.name}</h3>
            <p className="dk-chem__items">
              {g.items.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
