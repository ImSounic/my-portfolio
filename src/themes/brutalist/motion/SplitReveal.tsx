'use client'

import { useEffect, useRef, type CSSProperties, type ElementType } from 'react'
import SplitType from 'split-type'
import { EASE_EXPO_CSS, EASE_OUT_CSS } from '@/themes/brutalist/tokens'

type Props = {
  text: string
  as?: ElementType
  /** Unit of animation. stamp always works per word. */
  mode?: 'lines' | 'words' | 'chars'
  /**
   * redact: each unit sits under a solid bar that wipes off left to right.
   * stamp:  each word slams in oversized and rotated; an accent ghost settles
   *         into a permanent print offset behind it.
   * rise:   plain masked rise.
   */
  effect?: 'redact' | 'stamp' | 'rise'
  /** view: when scrolled into view (once). mount: right after mount. */
  trigger?: 'view' | 'mount'
  delay?: number
  stagger?: number
  duration?: number
  amount?: number
  /** Redaction bar colour. */
  barColor?: string
  /** Stamp ghost colour and resting offset. */
  ghostColor?: string
  ghostOffset?: string
  className?: string
  style?: CSSProperties
}

// Text renders plain and fully visible. Once JS is ready, fonts are loaded and
// the tab is visible it is split and staged; after the reveal the split is
// reverted (redact, rise) so resize never breaks wrapping. Stamp keeps its
// ghosts, so it splits by word and never reverts.
export function SplitReveal({
  text,
  as = 'span',
  mode = 'lines',
  effect = 'redact',
  trigger = 'view',
  delay = 0,
  stagger = 0.07,
  duration = 0.6,
  amount = 0.35,
  barColor = 'var(--bz-accent)',
  ghostColor = 'var(--bz-accent)',
  ghostOffset = '0.06em',
  className,
  style,
}: Props) {
  const Tag = as
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animate = !reduced && !document.hidden
    const unitMode = effect === 'stamp' ? 'words' : mode
    const types = unitMode === 'lines' ? 'lines,words' : unitMode === 'words' ? 'words' : 'chars'

    let split: SplitType | null = null
    let observer: IntersectionObserver | null = null
    let timer = 0
    let cancelled = false
    const reveals: Array<() => void> = []
    const cleanups: Array<() => void> = []

    const units = () => {
      try {
        split = new SplitType(el, { types, tagName: 'span' })
      } catch {
        return []
      }
      const list = (unitMode === 'lines' ? split.lines : unitMode === 'words' ? split.words : split.chars) ?? []
      if (list.length === 0) {
        split.revert()
        split = null
      }
      return list
    }

    const wrap = (target: HTMLElement, display: string) => {
      const wrapper = document.createElement('span')
      wrapper.style.display = display
      wrapper.style.position = 'relative'
      target.parentNode?.insertBefore(wrapper, target)
      wrapper.appendChild(target)
      return wrapper
    }

    const primeRise = (list: HTMLElement[]) => {
      list.forEach((target, i) => {
        const mask = wrap(target, unitMode === 'lines' ? 'block' : 'inline-block')
        mask.style.overflow = 'hidden'
        mask.style.verticalAlign = 'bottom'
        target.style.display = unitMode === 'lines' ? 'block' : 'inline-block'
        target.style.transform = 'translateY(110%)'
        target.style.transition = `transform ${duration}s ${EASE_OUT_CSS} ${delay + i * stagger}s`
        reveals.push(() => {
          target.style.transform = 'translateY(0)'
        })
      })
    }

    const primeRedact = (list: HTMLElement[]) => {
      list.forEach((target, i) => {
        const wrapper = wrap(target, unitMode === 'lines' ? 'block' : 'inline-block')
        const bar = document.createElement('span')
        bar.setAttribute('aria-hidden', 'true')
        Object.assign(bar.style, {
          position: 'absolute',
          inset: '-0.04em -0.06em',
          background: barColor,
          transformOrigin: 'right center',
          transform: 'scaleX(1)',
          transition: `transform ${duration}s ${EASE_EXPO_CSS} ${delay + i * stagger}s`,
          pointerEvents: 'none',
          zIndex: '1',
        })
        wrapper.appendChild(bar)
        reveals.push(() => {
          bar.style.transform = 'scaleX(0)'
        })
        cleanups.push(() => bar.remove())
      })
    }

    const primeStamp = (list: HTMLElement[], live: boolean) => {
      list.forEach((target, i) => {
        const wrapper = wrap(target, 'inline-block')
        const ghost = document.createElement('span')
        ghost.setAttribute('aria-hidden', 'true')
        ghost.textContent = target.textContent
        Object.assign(ghost.style, {
          position: 'absolute',
          left: '0',
          top: '0',
          color: ghostColor,
          whiteSpace: 'pre',
          pointerEvents: 'none',
          zIndex: '0',
          transform: `translate(${ghostOffset}, ${ghostOffset})`,
        })
        wrapper.insertBefore(ghost, target)
        target.style.position = 'relative'
        target.style.zIndex = '1'
        target.style.display = 'inline-block'
        if (!live) return
        const d = delay + i * stagger
        const rot = i % 2 === 0 ? -3 : 2.5
        Object.assign(target.style, {
          opacity: '0',
          transform: `scale(1.35) rotate(${rot}deg)`,
          filter: 'blur(6px)',
          transition: `transform ${duration}s ${EASE_EXPO_CSS} ${d}s, opacity 0.3s ${EASE_OUT_CSS} ${d}s, filter 0.4s ${EASE_OUT_CSS} ${d}s`,
        })
        Object.assign(ghost.style, {
          opacity: '0',
          transform: `translate(0.45em, 0.45em) scale(1.35) rotate(${rot}deg)`,
          transition: `transform ${duration + 0.08}s ${EASE_EXPO_CSS} ${d + 0.04}s, opacity 0.3s ${EASE_OUT_CSS} ${d + 0.04}s`,
        })
        reveals.push(() => {
          Object.assign(target.style, { opacity: '1', transform: 'none', filter: 'none' })
          Object.assign(ghost.style, { opacity: '1', transform: `translate(${ghostOffset}, ${ghostOffset})` })
        })
        cleanups.push(() => {
          target.style.transition = ''
          target.style.filter = ''
          ghost.style.transition = ''
        })
      })
    }

    const finish = () => {
      cleanups.forEach((fn) => fn())
      if (effect !== 'stamp') {
        split?.revert()
        split = null
      }
    }

    const reveal = () => {
      reveals.forEach((fn) => fn())
      const total = (delay + reveals.length * stagger + duration) * 1000 + 120
      timer = window.setTimeout(finish, total)
    }

    const start = async () => {
      try {
        await document.fonts?.ready
      } catch {
        /* proceed */
      }
      if (cancelled) return
      const list = units()
      if (list.length === 0) return
      if (!animate) {
        // Static: stamp still gets its resting ghost; the rest stays plain text.
        if (effect === 'stamp') primeStamp(list, false)
        else {
          split?.revert()
          split = null
        }
        return
      }
      if (effect === 'rise') primeRise(list)
      else if (effect === 'stamp') primeStamp(list, true)
      else primeRedact(list)

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
      cleanups.forEach((fn) => fn())
      split?.revert()
    }
  }, [text, mode, effect, trigger, delay, stagger, duration, amount, barColor, ghostColor, ghostOffset])

  return (
    <Tag ref={ref} className={className} style={style} aria-label={mode === 'chars' || effect === 'stamp' ? text : undefined}>
      {text}
    </Tag>
  )
}
