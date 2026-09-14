'use client'

import { motion, useReducedMotion } from 'motion/react'
import { hotTakes } from '@/data/portfolio'
import { spaceMono } from '@/themes/fonts'
import { C } from '@/themes/brutalist/tokens'

// ─── MARQUEE TICKER (single accent, >>> separators) ─────────────
export function Marquee() {
  const reduced = useReducedMotion()
  const items = [...hotTakes, ...hotTakes]

  const Row = ({ list }: { list: string[] }) => (
    <>
      {list.map((take, i) => (
        <span
          key={i}
          className={`flex items-center gap-4 text-xs font-bold uppercase tracking-widest shrink-0 ${spaceMono.className}`}
          style={{ color: C.paper }}
        >
          <span style={{ color: C.orange }} aria-hidden>{'>>>'}</span>
          {take}
        </span>
      ))}
    </>
  )

  // Static non-animated row when reduced motion is preferred
  if (reduced) {
    return (
      <div
        className="overflow-x-auto border-y-[2px] border-black py-3"
        style={{ background: C.ink }}
        aria-label="Hot takes"
      >
        <div className="flex gap-12 whitespace-nowrap px-4">
          <Row list={hotTakes} />
        </div>
      </div>
    )
  }

  return (
    <div
      className="overflow-hidden border-y-[2px] border-black py-3 relative"
      style={{ background: C.ink }}
      aria-label="Hot takes ticker"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 38, ease: 'linear' }}
      >
        <Row list={items} />
      </motion.div>
    </div>
  )
}

