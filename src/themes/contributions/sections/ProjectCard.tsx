'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import type { Print } from '@/themes/contributions/data'

// ─── A project's details, opened from its print on the line ──────────
// Desktop: a small card beside the print with a pointer to it. It follows
// the print while the pinned line scrolls and closes once the print has left
// the screen. Phones: a sheet along the bottom. Closes with Escape, its close
// button or a click elsewhere; focus moves in on open and back to the print
// on close. Positioned with transform only, written once a frame at most.

const GAP = 18 // between the print and the card
const EDGE = 16 // kept clear at the viewport edges
const SHEET_BELOW = 640 // narrower viewports get the bottom sheet

export function ProjectCard({ print, anchor, onClose }: { print: Print; anchor: HTMLElement; onClose: (refocus: boolean) => void }) {
  const card = useRef<HTMLDivElement>(null)
  const pointer = useRef<HTMLSpanElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const closeRef = useRef(onClose)
  useLayoutEffect(() => {
    closeRef.current = onClose
  })

  // Place beside the print (right if it fits, else left); follow it.
  useLayoutEffect(() => {
    const el = card.current
    if (!el) return
    let raf = 0
    const place = () => {
      raf = 0
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (vw < SHEET_BELOW) {
        el.dataset.side = 'sheet'
        el.style.transform = ''
        return
      }
      const r = anchor.getBoundingClientRect()
      if (r.right < 0 || r.left > vw || r.bottom < 0 || r.top > vh) return closeRef.current(false)
      const w = el.offsetWidth
      const h = el.offsetHeight
      const right = r.right + GAP + w <= vw - EDGE
      let x = right ? r.right + GAP : r.left - GAP - w
      x = Math.min(Math.max(x, EDGE), vw - EDGE - w)
      const y = Math.min(Math.max(r.top + 8, EDGE), Math.max(EDGE, vh - EDGE - h))
      el.dataset.side = right ? 'right' : 'left'
      el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`
      // the pointer stays level with the print's upper part
      if (pointer.current) pointer.current.style.top = `${Math.round(Math.min(Math.max(r.top + r.height * 0.3 - y, 22), h - 22))}px`
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(place)
    }
    place()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [anchor, print.id])

  // Focus in; Escape and outside clicks close.
  useEffect(() => {
    title.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current(true)
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (card.current?.contains(t) || anchor.contains(t)) return
      closeRef.current(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [anchor, print.id])

  const titleId = `pcard-${print.id}`
  return (
    <div ref={card} id="dk-pcard" className="dk-pcard" role="dialog" aria-modal="false" aria-labelledby={titleId}>
      <span ref={pointer} className="dk-pcard__pointer" aria-hidden="true" />
      <div key={print.id} className="dk-pcard__in">
        <button type="button" className="dk-pcard__close" aria-label="Close project details" onClick={() => closeRef.current(true)}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <p className="dk-pcard__kind">
          {print.kind} · {print.period}
        </p>
        <h3 ref={title} id={titleId} className="dk-pcard__title" tabIndex={-1}>
          {print.title}
        </h3>
        <div className="dk-pcard__lead">
          {print.big && <span className="dk-pcard__big dk-num">{print.big}</span>}
          <p>{print.body}</p>
        </div>
        {print.highlights.length > 0 && (
          <ul className="dk-pcard__list">
            {print.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <div className="dk-pcard__tags">
          {print.allTags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        {(print.github || print.link) && (
          <div className="dk-pcard__links">
            {print.github && (
              <a className="dk-link" href={print.github} target="_blank" rel="noopener noreferrer">
                Code on GitHub
              </a>
            )}
            {print.link && (
              <a className="dk-link" href={print.link} target="_blank" rel="noopener noreferrer">
                Open the project
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
