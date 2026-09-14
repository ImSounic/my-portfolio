'use client'

import { motion, useReducedMotion } from 'motion/react'
import { spaceMono } from '@/themes/fonts'
import { ON_ACCENT, canHover, C } from '@/themes/brutalist/tokens'
import { Magnetic } from '@/themes/brutalist/motion/Magnetic'

// ─── SIDE PAGE-FLIP CONTROL ─────────────────────────────────────
// Vertical button stuck to the right edge of the board. PAGE 01 shows a
// DOWN arrow + "PAGE 02 / MORE" (go forward); PAGE 02 shows an UP arrow
// + "PAGE 01 / BACK" (go back). Real button, ≥44px, keyboard activatable.
export function PageNav({ page, onFlip }: { page: number; onFlip: () => void }) {
  const reduced = useReducedMotion()
  const forward = page === 0
  const label   = forward ? 'PAGE 02' : 'PAGE 01'
  const sub     = forward ? 'MORE' : 'BACK'
  const aria    = forward ? 'Go to page two of projects' : 'Back to page one of projects'

  return (
    <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 xl:translate-x-[26px] z-30 hidden md:flex justify-end">
      <Magnetic strength={0.25} className="pointer-events-auto">
        <motion.button
          type="button"
          onClick={onFlip}
          aria-label={aria}
          className={`pointer-events-auto flex flex-col items-center gap-2 border-[2px] border-black px-3 py-4 min-w-[44px] min-h-[44px] transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eae8e3] ${spaceMono.className}`}
          style={{ background: C.orange, color: ON_ACCENT, boxShadow: '4px 4px 0 #000' }}
          whileHover={reduced || !canHover ? undefined : { x: -2, y: -2 }}
          whileTap={reduced ? undefined : { x: 0, y: 0 }}
        >
          {/* page indicator 01 / 02 */}
          <span className="text-[9px] font-bold tracking-[0.16em]" aria-hidden="true">
            {String(page + 1).padStart(2, '0')} / 02
          </span>
          <span aria-hidden="true" style={{ height: 1, width: 18, background: 'currentColor', opacity: 0.5 }} />
          {/* up arrow on page two, down arrow on page one */}
          <span aria-hidden="true" className="text-lg font-black leading-none">
            {forward ? '↓' : '↑'}
          </span>
          {/* vertical label, brutalist telemetry */}
          <span
            className="text-[10px] font-black tracking-[0.2em] leading-tight"
            style={{ writingMode: 'vertical-rl' }}
          >
            {label}
          </span>
          <span className="text-[8px] font-bold tracking-[0.18em] leading-none opacity-80">
            {sub}
          </span>
        </motion.button>
      </Magnetic>
    </div>
  )
}

