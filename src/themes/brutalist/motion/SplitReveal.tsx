'use client'

import { useEffect, useRef, type CSSProperties, type ElementType } from 'react'
import SplitType from 'split-type'
import { EASE_OUT_CSS } from '@/themes/brutalist/tokens'

type Props = {
  text: string
  as?: ElementType
  /** lines: each line rises from a mask. words: each word does. chars: each character does. */
  mode?: 'lines' | 'words' | 'chars'
  /** view: when scrolled into view (once). mount: right after mount (hero). */
  trigger?: 'view' | 'mount'
  delay?: number
  stagger?: number
  duration?: number
  /** IntersectionObserver threshold for trigger="view". */
  amount?: number
  className?: string
  style?: CSSProperties
}

// Text is rendered plain and fully visible. Only once JS is ready, fonts are
// loaded and the tab is visible does it get split and masked; after the reveal
// finishes the split is reverted so resize never breaks line wrapping.
export function SplitReveal({
  text,
  as = 'span',
  mode = 'lines',
  trigger = 'view',
  delay = 0,
  stagger = 0.07,
  duration = 0.75,
  amount = 0.35,
  className,
  style,
}: Props) {
  const Tag = as
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (document.hidden) return

    let split: SplitType | null = null
    let observer: IntersectionObserver | null = null
    let timer = 0
    let cancelled = false
    const units: HTMLElement[] = []

    const prime = () => {
      try {
        split = new SplitType(el, {
          types: mode === 'lines' ? 'lines,words' : mode === 'words' ? 'words' : 'chars',
          tagName: 'span',
        })
      } catch {
        return false
      }
      const targets = (mode === 'lines' ? split.lines : mode === 'words' ? split.words : split.chars) ?? []
      if (targets.length === 0) {
        split.revert()
        split = null
        return false
      }
      targets.forEach((target, i) => {
        const mask = document.createElement('span')
        mask.style.display = mode === 'lines' ? 'block' : 'inline-block'
        mask.style.overflow = 'hidden'
        mask.style.verticalAlign = 'bottom'
        target.parentNode?.insertBefore(mask, target)
        mask.appendChild(target)
        target.style.display = mode === 'lines' ? 'block' : 'inline-block'
        target.style.transform = 'translateY(110%)'
        target.style.willChange = 'transform'
        target.style.transition = `transform ${duration}s ${EASE_OUT_CSS} ${delay + i * stagger}s`
        units.push(target)
      })
      return true
    }

    const reveal = () => {
      units.forEach((u) => {
        u.style.transform = 'translateY(0)'
      })
      const total = (delay + units.length * stagger + duration) * 1000 + 80
      timer = window.setTimeout(() => {
        split?.revert()
        split = null
      }, total)
    }

    const start = async () => {
      try {
        await document.fonts?.ready
      } catch {
        /* fonts API unavailable: proceed */
      }
      if (cancelled || !prime()) return
      if (trigger === 'mount') {
        requestAnimationFrame(() => requestAnimationFrame(reveal))
        return
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            reveal()
            observer?.disconnect()
            observer = null
          }
        },
        { threshold: amount },
      )
      observer.observe(el)
    }
    start()

    return () => {
      cancelled = true
      observer?.disconnect()
      if (timer) clearTimeout(timer)
      split?.revert()
    }
  }, [text, mode, trigger, delay, stagger, duration, amount])

  return (
    <Tag ref={ref} className={className} style={style} aria-label={mode === 'chars' ? text : undefined}>
      {text}
    </Tag>
  )
}
