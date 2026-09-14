'use client'

import { useState } from 'react'
import { motion, useReducedMotion, useScroll, AnimatePresence } from 'motion/react'
import { navSections } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT, ACCENT_TEXT, EASE_OUT, C, type PaletteId } from '@/themes/brutalist/tokens'
import { LetterRoll } from '@/themes/brutalist/motion/LetterRoll'
import { scrollTo } from '@/themes/brutalist/motion/scroll'
import { PaletteSwitcher } from '@/themes/brutalist/primitives/PaletteSwitcher'

// ─── NAVBAR ──────────────────────────────────────────────────────
export function Navbar({
  palette,
  setPalette,
}: {
  palette: PaletteId
  setPalette: (id: PaletteId) => void
}) {
  const [open, setOpen] = useState(false)
  const reduced         = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const go = (id: string) => { setOpen(false); setTimeout(() => scrollTo(id), 10) }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${aeonik.className}`}
        style={{
          background: C.paper,
          borderBottom: `3px solid ${C.black}`,
          boxShadow: '0 4px 0 rgba(0,0,0,0.06)',
        }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-[-3px] h-[3px] origin-left pointer-events-none"
          style={{ background: ACCENT, scaleX: scrollYProgress }}
        />
        <div className="flex items-center justify-between px-6 h-14">
          <button
            onClick={() => go('home')}
            className="flex items-center gap-2 font-black text-xl uppercase tracking-tight text-black hover:text-[color:var(--bz-accent-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0]"
          >
            SA<span style={{ color: ACCENT_TEXT }}>.</span>
            <span className={`text-[9px] font-bold tracking-[0.18em] text-black/45 ${spaceMono.className}`}>
              D-01
            </span>
          </button>

          {/* Desktop cluster: palette swatches + nav. Collapses to the menu below
              lg, where the four swatches plus five nav links would overflow. */}
          <div className="hidden lg:flex items-center gap-4 mr-[148px]">
            <PaletteSwitcher palette={palette} setPalette={setPalette} variant="bar" />
            <span className="w-px h-5 bg-black/15" aria-hidden="true" />
            <div className="flex items-center gap-0">
              {navSections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => go(s.id)}
                  data-lr-host
                  className={`font-bold text-xs uppercase tracking-widest px-4 py-2 text-black hover:text-[color:var(--bz-accent-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0] ${spaceMono.className}`}
                >
                  <span className="text-black/35">{String(i).padStart(2, '0')}</span>{' '}
                  <LetterRoll text={s.label} />
                </button>
              ))}
            </div>
          </div>

          {/* 44px touch target */}
          <button
            className="lg:hidden border-[2px] border-black w-11 h-11 flex items-center justify-center font-black text-lg hover:bg-black hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? '×' : '≡'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className={`fixed top-14 left-0 right-0 z-40 border-b-[2px] border-black flex flex-col ${spaceMono.className}`}
            style={{ background: C.paper }}
          >
            {navSections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="font-bold text-sm uppercase tracking-widest px-6 py-4 border-b-[1px] border-black/15 text-left hover:text-[color:var(--bz-accent-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0]"
              >
                <span className="text-black/35">{String(i).padStart(2, '0')}</span>{' '}
                {s.label}
              </button>
            ))}
            <div className="px-6 py-4 flex items-center justify-between gap-4">
              <span className={`text-xs font-bold uppercase tracking-widest text-black/45 ${spaceMono.className}`}>
                Palette
              </span>
              <PaletteSwitcher palette={palette} setPalette={setPalette} variant="menu" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

