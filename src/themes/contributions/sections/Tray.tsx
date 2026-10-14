'use client'

import { useEffect, useRef } from 'react'
import { PRINTS } from '@/themes/contributions/data'

export const TRAY_SECONDS = 15

// ─── THE TRAY: one print at a time, every 15 seconds ─────────────────
// Holds while hovered or focused, when off screen or the tab is hidden;
// under reduced motion it only changes with Previous and Next.
export function Tray({ index, setIndex }: { index: number; setIndex: (i: number) => void }) {
  const root = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement | null>(null)
  const state = useRef({ elapsed: 0, hover: false, focus: false, inView: false })
  const p = PRINTS[index]
  const n = PRINTS.length

  // restart the clock whenever the print changes
  useEffect(() => {
    state.current.elapsed = 0
  }, [index])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const io = new IntersectionObserver(([e]) => { state.current.inView = e.isIntersecting }, { threshold: 0.35 })
    io.observe(el)
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      const s = state.current
      const running = !reduce.matches && s.inView && !s.hover && !s.focus && !document.hidden
      if (running) {
        s.elapsed += dt
        if (s.elapsed >= TRAY_SECONDS * 1000) {
          s.elapsed = 0
          setIndex(-1) // advance; the parent wraps
        }
      }
      if (fill.current) fill.current.style.transform = `scaleX(${Math.min(1, s.elapsed / (TRAY_SECONDS * 1000))})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [setIndex])

  return (
    <div className="dk-tray-wrap">
      <div
        ref={root}
        id="tray"
        className="dk-tray"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured project"
        onPointerEnter={() => { state.current.hover = true }}
        onPointerLeave={() => { state.current.hover = false }}
        onFocus={() => { state.current.focus = true }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) state.current.focus = false }}
      >
        <div className="dk-tray__pic">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={p.id} className="dk-fade" src={p.image} alt={p.alt} width={700} height={440} decoding="async" />
        </div>
        <div key={p.id} className="dk-tray__text dk-fade">
          <span className="dk-tray__big">{p.big}</span>
          <h3 className="dk-tray__title">{p.title}</h3>
          <p className="dk-tray__body">{p.body}</p>
          {p.github && (
            <a className="dk-link dk-tray__code" href={p.github} target="_blank" rel="noopener noreferrer">
              Code on GitHub
            </a>
          )}
        </div>
        <div className="dk-tray__controls">
          <div className="dk-tray__segs" aria-hidden="true">
            {PRINTS.map((x, k) => (
              <span key={x.id} className="dk-tray__seg" data-done={k < index}>
                {k === index && <span ref={fill} />}
              </span>
            ))}
          </div>
          <span className="dk-tray__count dk-num">{index + 1} of {n}</span>
          <div className="dk-tray__nav">
            <button type="button" onClick={() => setIndex((index - 1 + n) % n)}>Previous</button>
            <button type="button" onClick={() => setIndex((index + 1) % n)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
