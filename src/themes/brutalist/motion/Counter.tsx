'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/themes/brutalist/tokens'

type Props = {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
  style?: CSSProperties
}

// Ticks up from 0 once in view. Reduced motion or a hidden tab show the final
// value immediately; a fallback settles the final value if the observer never
// fires while the element is on screen.
export function Counter({ value, duration = 1.2, format = (n) => String(n), className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    if (reduced || document.hidden) {
      done.current = true
      setShown(value)
      return
    }
    if (!inView) return
    done.current = true
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setShown(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduced, value, duration])

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (done.current) return
      const r = ref.current?.getBoundingClientRect()
      if (r && r.top < window.innerHeight && r.bottom > 0) {
        done.current = true
        setShown(value)
      }
    }, 3000)
    return () => clearTimeout(id)
  }, [value])

  return (
    <span ref={ref} className={className} style={style}>
      {format(shown)}
    </span>
  )
}
