'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

type Props = {
  children: ReactNode
  /** Total vertical drift in px across the element's pass through the viewport. */
  distance?: number
  className?: string
  style?: CSSProperties
}

export function Parallax({ children, distance = 40, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y: reduced ? 0 : y }}>
      {children}
    </motion.div>
  )
}
