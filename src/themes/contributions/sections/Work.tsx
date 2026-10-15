'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PRINTS } from '@/themes/contributions/data'
import { gsap, ScrollTrigger, WIDE, MOTION_OK } from '@/themes/contributions/parts'
import { ProjectCard } from '@/themes/contributions/sections/ProjectCard'

const TILT = [-2.5, 1.8, -1.2, 2.6, -2, 1.4, -2.2, 2, -1.6, 2.4]
const SAG = 120 // how far the wire sags at its middle, in px (matches the SVG path)
// ─── WORK: ten prints on a drying line ───────────────────────────────
// Desktop with motion: the section pins and vertical scroll pulls the line
// sideways. Phone or reduced motion: the line scrolls natively, with snap.
// Clicking a print opens its details in a small card beside it.
export function Work() {
  const section = useRef<HTMLElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const [pinned, setPinned] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const [host, setHost] = useState<HTMLElement | null>(null)
  const prints = useRef<(HTMLButtonElement | null)[]>([])

  // The card renders into the theme root: fixed to the viewport, clear of the moving track.
  useEffect(() => {
    setHost(section.current?.closest<HTMLElement>('.dk') ?? null)
  }, [])

  const close = (refocus: boolean) => {
    setOpen((cur) => {
      if (refocus && cur !== null) prints.current[cur]?.focus({ preventScroll: true })
      return null
    })
  }
  useEffect(() => {
    const show = (p: number) => {
      const i = Math.min(PRINTS.length, Math.max(1, Math.round(p * (PRINTS.length - 1)) + 1))
      if (count.current) count.current.textContent = `${i} of ${PRINTS.length}`
      if (bar.current) bar.current.style.width = `${Math.max(10, p * 100)}%`
    }
    const mm = gsap.matchMedia()
    mm.add({ wide: WIDE, motion: MOTION_OK }, (ctx) => {
      const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean }
      const sec = section.current, tr = track.current, ln = line.current
      if (!sec || !tr || !ln) return
      if (wide && motion) {
        setPinned(true)
        const distance = () => Math.max(0, tr.scrollWidth - ln.clientWidth)
        const tween = gsap.to(tr, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sec,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (s) => show(s.progress),
          },
        })
        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          gsap.set(tr, { x: 0 })
          setPinned(false)
        }
      }
      // native horizontal scroll
      setPinned(false)
      const onScroll = () => show(ln.scrollLeft / Math.max(1, ln.scrollWidth - ln.clientWidth))
      ln.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => ln.removeEventListener('scroll', onScroll)
    })
    // Images change the track width after load; recompute the pin.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  return (
    <section ref={section} id="work" className="dk-work" data-static={!pinned} aria-labelledby="work-title">
      <div className="dk-work__head">
        <h2 id="work-title" className="dk-work__title">Work</h2>
        <p>Ten projects on the line. {pinned ? 'Scroll pulls it' : 'Swipe it'}; open one for the details.</p>
      </div>

      <div ref={line} className="dk-line" tabIndex={pinned ? -1 : 0} aria-label="Projects on the drying line">
        <div ref={track} className="dk-line__track">
          <svg className="dk-line__wire" viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 10 Q500 250 1000 10" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          {PRINTS.map((p, i) => {
            const t = (i + 0.5) / PRINTS.length
            const drop = SAG * 4 * t * (1 - t) // the wire's sag at this print
            return (
              <button
                key={p.id}
                ref={(el) => {
                  prints.current[i] = el
                }}
                type="button"
                className="dk-print"
                style={{ ['--tilt' as string]: `${TILT[i % TILT.length]}deg`, marginTop: 42 + drop }}
                onClick={() => setOpen((cur) => (cur === i ? null : i))}
                aria-expanded={open === i}
                aria-controls={open === i ? 'dk-pcard' : undefined}
                aria-label={`${p.title}, ${p.tags.filter(Boolean).join(' and ')}, ${p.year}. Show details`}
              >
                <span className="dk-print__peg" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" width={292} height={230} loading="lazy" decoding="async" />
                <span className="dk-print__meta">
                  <span className="dk-print__tags">{p.tags.filter(Boolean).map((t) => <span key={t}>{t}</span>)}</span>
                  <span className="dk-print__year dk-num">{p.year}</span>
                </span>
                <span className="dk-print__title">{p.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {open !== null && host && prints.current[open] &&
        createPortal(<ProjectCard print={PRINTS[open]} anchor={prints.current[open]!} onClose={close} />, host)}

      <div className="dk-work__foot" aria-hidden="true">
        <div className="dk-work__bar"><span ref={bar} /></div>
        <span ref={count} className="dk-work__count">1 of {PRINTS.length}</span>
      </div>
    </section>
  )
}
