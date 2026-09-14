'use client'

import { motion, useReducedMotion, AnimatePresence } from 'motion/react'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT_TEXT, ON_ACCENT, EASE_OUT, C } from '@/themes/brutalist/tokens'
import { FrameTag } from '@/themes/brutalist/primitives/FrameTag'
import { Crosshair } from '@/themes/brutalist/primitives/Crosshair'

// ─── ANIMATED BOARD HEADER (swaps with the page) ────────────────
// PAGE 01: Syne "PROJECTS" + "PINBOARD" telemetry tag.
// PAGE 02: heading clips to "PAGE TWO" + the orange "FRESH DROPS" box.
export function BoardHeader({ page, total, startIndex }: { page: number; total: number; startIndex: number }) {
  const reduced = useReducedMotion()
  const heading = page === 0 ? 'PROJECTS' : 'PAGE TWO'
  const tagText = page === 0 ? 'PINBOARD' : 'FIELD LOG / VOL. II'
  // Index reads 01 / 06 on page one, 07 / 10 on page two.
  const idxFrom = page === 0 ? 1 : startIndex + 1
  const idxTo   = page === 0 ? startIndex : total

  const swap = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { y: 28, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        animate: { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)' },
        exit:    { y: -28, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        transition: { duration: 0.4, ease: EASE_OUT },
      }

  return (
    <div className="mb-12">
      {/* Telemetry tag row + hairline rule + index (preserved framing) */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`tag-${page}`}
              initial={swap.initial}
              animate={swap.animate}
              exit={swap.exit}
              transition={swap.transition}
            >
              <FrameTag color={ACCENT_TEXT}>{`SECTION / ${tagText}`}</FrameTag>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex-1 h-px min-w-[16px]" style={{ background: C.black }} />
        <span
          className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] shrink-0 ${spaceMono.className}`}
          style={{ color: 'rgba(10,10,10,0.45)' }}
        >
          <Crosshair size={9} color={C.orange} />
          {String(idxFrom).padStart(2, '0')} / {String(idxTo).padStart(2, '0')}
        </span>
      </div>

      {/* Big swapping heading */}
      <div className="flex items-end gap-4">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={`head-${page}`}
              className={`font-black uppercase leading-[0.85] ${aeonik.className}`}
              style={{ fontSize: 'clamp(48px, 10vw, 120px)', color: C.ink, letterSpacing: '-0.05em' }}
              initial={swap.initial}
              animate={swap.animate}
              exit={swap.exit}
              transition={swap.transition}
            >
              {heading}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      {/* FRESH DROPS row: ALWAYS reserved at a fixed height so the header is the
          same height on both pages (the box only renders on page two). This is
          what keeps the section from getting taller on the flip. */}
      <div className="mt-4 h-8">
        <AnimatePresence mode="wait" initial={false}>
          {page === 1 && (
            <motion.span
              key="fresh-drops"
              className={`inline-flex items-center gap-2 border-[2px] border-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${spaceMono.className}`}
              style={{ background: C.orange, color: ON_ACCENT, boxShadow: '3px 3px 0 #000', rotate: '-2deg' }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <span aria-hidden>{'>>>'}</span> FRESH DROPS
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

