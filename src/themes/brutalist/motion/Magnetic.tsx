'use client'

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { canHover } from '@/themes/brutalist/tokens'

type Props = {
  children: ReactNode
  /** Fraction of the pointer offset the element follows. */
  strength?: number
  className?: string
  style?: CSSProperties
}

// Pointer-only. Renders a plain wrapper on touch or under reduced motion.
export function Magnetic({ children, strength = 0.35, className, style }: Props) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  if (reduced || !canHover) {
    return (
      <div className={className} style={{ display: 'inline-block', ...style }}>
        {children}
      </div>
    )
  }

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: 'inline-block', ...style, x: sx, y: sy }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </motion.div>
  )
}
