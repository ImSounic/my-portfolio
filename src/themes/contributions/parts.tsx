'use client'

// Small shared parts of the Darkroom theme.

import { useEffect, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

// A test strip: six exposure steps, darkest to brightest. Marks a section edge.
export function Strip() {
  return (
    <div className="dk-strip" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  )
}

// Reveals every [data-reveal] under the root once as it enters the viewport.
// Content is only hidden once the root carries `js`, which this hook sets.
export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    el.classList.add('js')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    const watch = () => el.querySelectorAll('[data-reveal]:not(.is-in)').forEach((n) => io.observe(n))
    watch()
    const mo = new MutationObserver(watch)
    mo.observe(el, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [root])
}

export function useMedia(query: string) {
  const [match, setMatch] = useState<boolean | null>(null)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export const WIDE = '(min-width: 861px)'
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
