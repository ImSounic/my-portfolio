'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import { canHover, EASE_EXPO_CSS, EASE_OUT_CSS } from '@/themes/brutalist/tokens'

type Props = {
  text: string
  delay?: number
  stagger?: number
  duration?: number
  /** Letters lift and tilt as the pointer passes near them. */
  physics?: boolean
  radius?: number
  lift?: number
  tilt?: number
  className?: string
  style?: CSSProperties
  letterStyle?: CSSProperties
}

// One span per character. On mount each letter stamps in (oversized, rotated,
// blurred, then snapping to place); afterwards the letters carry no transform.
// Proximity is computed on pointermove over the enclosing section, writing
// transforms directly (no React re-render per frame).
export function Wordmark({
  text,
  delay = 0.15,
  stagger = 0.05,
  duration = 0.85,
  physics = true,
  radius = 220,
  lift = 26,
  tilt = 8,
  className,
  style,
  letterStyle,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const chars = Array.from(text)

  // Intro: each letter slams in oversized, rotated and blurred, staggered.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const inners = [...el.querySelectorAll<HTMLElement>('[data-wm-intro]')]
    const settle = () => {
      inners.forEach((i) => {
        Object.assign(i.style, { opacity: '1', transform: 'none', filter: 'none', transition: 'none', willChange: 'auto' })
      })
    }
    if (reduced || document.hidden) {
      settle()
      return
    }
    let cancelled = false
    const total = (delay + chars.length * stagger + duration) * 1000 + 120
    const safety = window.setTimeout(settle, total + 1500)
    ;(async () => {
      try {
        await document.fonts?.ready
      } catch {
        /* proceed */
      }
      if (cancelled) return
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          inners.forEach((i) => {
            Object.assign(i.style, { opacity: '1', transform: 'none', filter: 'none' })
          })
          window.setTimeout(settle, total)
        }),
      )
    })()
    return () => {
      cancelled = true
      clearTimeout(safety)
    }
  }, [reduced, text, delay, stagger, duration, chars.length])

  // Proximity
  useEffect(() => {
    if (!physics || reduced || !canHover) return
    const el = ref.current
    if (!el) return
    const letters = [...el.querySelectorAll<HTMLElement>('[data-wm-letter]')]
    const host: HTMLElement = el.closest('section') ?? el
    const onMove = (e: PointerEvent) => {
      letters.forEach((l) => {
        const r = l.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / radius)
        const ease = f * f * (3 - 2 * f)
        const y = -lift * ease
        const rot = (dx > 0 ? -1 : 1) * tilt * ease
        l.style.transform = ease > 0 ? `translateY(${y.toFixed(2)}px) rotate(${rot.toFixed(2)}deg)` : ''
      })
    }
    const onLeave = () => {
      letters.forEach((l) => {
        l.style.transform = ''
      })
    }
    host.addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('pointerleave', onLeave)
    return () => {
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [physics, reduced, radius, lift, tilt, text])

  return (
    <span ref={ref} className={className} style={style} aria-label={text} role="img">
      {chars.map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'bottom' }}>
          <span
            data-wm-intro
            style={{
              display: 'inline-block',
              opacity: 0,
              transform: `scale(1.4) rotate(${i % 2 === 0 ? -6 : 5}deg)`,
              filter: 'blur(8px)',
              transition: `transform ${duration}s ${EASE_EXPO_CSS} ${delay + i * stagger}s, opacity 0.35s ${EASE_OUT_CSS} ${delay + i * stagger}s, filter 0.45s ${EASE_OUT_CSS} ${delay + i * stagger}s`,
              willChange: 'transform, opacity, filter',
            }}
          >
            <span
              data-wm-letter
              style={{ display: 'inline-block', transition: 'transform 260ms cubic-bezier(0.23, 1, 0.32, 1)', ...letterStyle }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          </span>
        </span>
      ))}
    </span>
  )
}
