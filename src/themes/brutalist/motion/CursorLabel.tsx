'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { spaceMono } from '@/themes/fonts'
import { canHover, EASE_OUT, C } from '@/themes/brutalist/tokens'

// A short label that rides beside the pointer whenever it is over an element
// carrying data-cursor="..." (VIEW, DRAG, COPY, FLIP, OPEN, CLOSE, a palette
// name). Pointer devices only; decorative, so hidden from assistive tech.
export function CursorLabel() {
  const [label, setLabel] = useState<string | null>(null)
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.3 })

  useEffect(() => {
    if (!canHover) return
    const move = (e: MouseEvent) => {
      x.set(e.clientX + 22)
      y.set(e.clientY + 22)
    }
    const over = (e: MouseEvent) => {
      const host = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null
      setLabel(host?.dataset.cursor ?? null)
    }
    const out = (e: MouseEvent) => {
      if (!e.relatedTarget) setLabel(null)
    }
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    window.addEventListener('mouseout', out)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mouseout', out)
    }
  }, [x, y])

  if (!canHover) return null

  return (
    <div className="fixed top-0 left-0 z-[9998] pointer-events-none" aria-hidden="true" data-cursor-label>
      <AnimatePresence>
        {label && (
          <motion.div
            key={label}
            className="fixed top-0 left-0"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12, ease: EASE_OUT }}
          >
            <span
              className={`inline-block border-[2px] border-black px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap ${spaceMono.className}`}
              style={{ background: C.ink, color: C.paper, boxShadow: '3px 3px 0 var(--bz-accent)' }}
            >
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
