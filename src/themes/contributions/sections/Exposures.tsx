'use client'

import { EXPOSURES } from '@/themes/contributions/data'

// ─── After the hero: four exposures from real projects, darkest to brightest.
export function Exposures() {
  return (
    <section className="dk-section" aria-labelledby="expo-title">
      <h2 id="expo-title" className="dk-expo__title" data-reveal>
        Most of my work lives at the unglamorous end.
      </h2>
      <p className="dk-expo__lede" data-reveal style={{ ['--i' as string]: 1 }}>
        A model is only as honest as the data under it. Four levels from projects I shipped, darkest green to brightest, like the graph above.
      </p>
      <ol className="dk-expo__steps">
        {EXPOSURES.map((e, i) => (
          <li key={e.big} className="dk-expo__step" data-reveal style={{ ['--i' as string]: i }}>
            <span className="dk-expo__big">{e.big}</span>
            <p className="dk-expo__body">{e.body}</p>
            <p className="dk-expo__from">{e.from}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
