'use client'

// The Contributions theme's loader. No assets to preload: it draws Sounic's
// real last-year GitHub graph (the hero's data) week by week while the count
// climbs, all in CSS so it runs from first paint. It leaves once the theme has
// mounted and the fonts are in, never before the graph has finished drawing
// (about 1.6 s) and never later than 6 s, by zooming into the graph, which
// hands over to the hero opening on the same graph.

import { useEffect, useState } from 'react'
import snapshot from '@/data/contributions.json'
import { clash } from '@/themes/fonts'
import styles from './ContribLoader.module.css'

const LEVELS = snapshot.levels as number[][] // 7 rows (days) x weeks
const WEEKS = snapshot.weeks
const TOTAL = snapshot.total
const LEGEND = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']

const DRAWN_MS = 1650 // the CSS fill finishes by then
const DRAWN_MS_STILL = 400
const LEAVE_MS = 780
const MAX_MS = 6000

/** Set by the Contributions theme when it has mounted. */
export const CONTRIB_READY = 'contributions:ready'
declare global {
  interface Window {
    __contribReady?: boolean
  }
}

const cells: { c: number; r: number; l: number }[] = []
for (let c = 0; c < WEEKS; c++) for (let r = 0; r < 7; r++) cells.push({ c, r, l: LEVELS[r]?.[c] ?? -1 })

export default function ContribLoader() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in')

  useEffect(() => {
    let alive = true
    const html = document.documentElement
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    html.style.overflow = 'hidden' // nothing scrolls the page behind the loader

    const mounted = new Promise<void>((resolve) => {
      if (window.__contribReady) return resolve()
      window.addEventListener(CONTRIB_READY, () => resolve(), { once: true })
    })
    const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve()
    // performance.now() counts from navigation, as does the CSS animation from first paint.
    const drawn = new Promise<void>((r) => setTimeout(r, Math.max(0, (still ? DRAWN_MS_STILL : DRAWN_MS) - performance.now())))
    const cap = new Promise<void>((r) => setTimeout(r, MAX_MS))

    let leaveTimer = 0
    Promise.race([Promise.all([mounted, fonts, drawn]), cap]).then(() => {
      if (!alive) return
      setPhase('out')
      html.style.overflow = ''
      leaveTimer = window.setTimeout(() => alive && setPhase('gone'), still ? 220 : LEAVE_MS)
    })
    return () => {
      alive = false
      window.clearTimeout(leaveTimer)
      html.style.overflow = ''
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      className={`${styles.root} ${clash.variable} ${phase === 'out' ? styles.leaving : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={phase === 'in'}
      aria-label="Loading Sounic Akkaraju's portfolio"
    >
      <div className={styles.inner} aria-hidden="true">
        <p className={styles.name}>Sounic Akkaraju</p>
        <div className={styles.stage} style={{ ['--cols' as string]: WEEKS }}>
          <div className={styles.graph}>
            {cells.map(({ c, r, l }) => (
              <span key={`${c}-${r}`} className={styles.cell} data-l={l} style={{ ['--c' as string]: c, ['--r' as string]: r }} />
            ))}
          </div>
          <span className={styles.playhead} />
        </div>
        <div className={styles.meta}>
          <span className={styles.count} style={{ ['--total' as string]: TOTAL }}>
            {' '}contributions in the last year
          </span>
          <span className={styles.legend}>
            Less
            {LEGEND.map((bg) => (
              <i key={bg} style={{ background: bg }} />
            ))}
            More
          </span>
        </div>
      </div>
    </div>
  )
}
