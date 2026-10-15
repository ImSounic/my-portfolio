'use client'

// The Contributions theme's loader. No assets to preload: it draws Sounic's
// real last-year GitHub graph (the hero's data) week by week, in CSS so it
// runs from first paint, while an odometer rolls the count up to the total.
// When the graph is complete a shimmer runs across it and it holds a beat.
// It leaves once the theme has mounted and the fonts are in, never before
// that (about 3.5 s) and never later than 7 s, by zooming into the graph;
// the hero then plays its entrance (CONTRIB_INTRO).

import { useEffect, useRef, useState } from 'react'
import snapshot from '@/data/contributions.json'
import { clash } from '@/themes/fonts'
import styles from './ContribLoader.module.css'

const LEVELS = snapshot.levels as number[][] // 7 rows (days) x weeks
const WEEKS = snapshot.weeks
const TOTAL = snapshot.total
const LEGEND = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']

// From first paint, as the CSS timeline.
const DRAWN_MS = 3500 // drawn (~2.8 s), shimmered (~3.4 s), held a beat
const DRAWN_MS_STILL = 700
const COUNT_FROM = 600 // the odometer rolls with the fill
const COUNT_TO = 2700
const LEAVE_MS = 780
const MAX_MS = 7000

/** Set by the Contributions theme when it has mounted. */
export const CONTRIB_READY = 'contributions:ready'
/** Fired when the loader starts to leave: the hero plays its entrance. */
export const CONTRIB_INTRO = 'contributions:intro'
declare global {
  interface Window {
    __contribReady?: boolean
    __contribIntro?: boolean
  }
}

const DIGITS = String(TOTAL).length
const PLACES = Array.from({ length: DIGITS }, (_, k) => 10 ** (DIGITS - 1 - k)) // 100, 10, 1
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// Wheel position of the digit at `place` for a (continuous) value: the ones
// wheel follows the value; a higher wheel moves only while the wheel below
// rolls over from 9 to 0.
const wheelAt = (v: number, place: number) =>
  place === 1 ? v : Math.floor(v / place) + Math.min(1, Math.max(0, (v % place) - (place - 1)))

const cells: { c: number; r: number; l: number }[] = []
for (let c = 0; c < WEEKS; c++) for (let r = 0; r < 7; r++) cells.push({ c, r, l: LEVELS[r]?.[c] ?? -1 })

export default function ContribLoader() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in')
  const odometer = useRef<HTMLSpanElement>(null)
  const strips = useRef<(HTMLSpanElement | null)[]>([])
  const wheels = useRef<(HTMLSpanElement | null)[]>([])

  // The odometer, on the CSS clock (first paint), so it is in step with the
  // fill even though the script starts later. Three style writes a frame.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      odometer.current?.classList.add(styles.landed)
      return
    }
    const paint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? performance.getEntriesByName('first-paint')[0]?.startTime ?? 0
    let raf = 0
    let lastOnes = 0
    let lastNow = performance.now()
    const frame = (now: number) => {
      const t = (now - paint - COUNT_FROM) / (COUNT_TO - COUNT_FROM)
      const v = TOTAL * easeInOut(Math.min(1, Math.max(0, t)))
      PLACES.forEach((place, k) => {
        const pos = wheelAt(v, place) % 10
        const strip = strips.current[k]
        if (strip) strip.style.transform = `translate3d(0, ${(-pos * 1.2).toFixed(3)}em, 0)`
        const wheel = wheels.current[k]
        // leading zeros stay dim until their wheel has something to show
        if (wheel) wheel.style.opacity = place === 1 || v >= place ? '1' : '0.3'
      })
      // the fast-spinning ones wheel blurs a little, like a real one
      const speed = Math.abs(v - lastOnes) / Math.max(1, now - lastNow) // digits per ms
      lastOnes = v
      lastNow = now
      const ones = strips.current[DIGITS - 1]
      if (ones) ones.style.filter = speed > 0.02 ? `blur(${Math.min(1.6, speed * 12).toFixed(2)}px)` : ''
      if (t < 1) raf = requestAnimationFrame(frame)
      else odometer.current?.classList.add(styles.landed)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

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
      window.__contribIntro = true
      window.dispatchEvent(new Event(CONTRIB_INTRO))
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
          <span className={styles.count}>
            <span ref={odometer} className={styles.odometer}>
              {PLACES.map((place, k) => (
                <span
                  key={place}
                  ref={(el) => {
                    wheels.current[k] = el
                  }}
                  className={styles.wheel}
                  style={{ opacity: place === 1 ? 1 : 0.3 }}
                >
                  <span
                    ref={(el) => {
                      strips.current[k] = el
                    }}
                    className={styles.strip}
                    style={{ ['--final' as string]: Math.floor(TOTAL / place) % 10 }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
            contributions in the last year
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
