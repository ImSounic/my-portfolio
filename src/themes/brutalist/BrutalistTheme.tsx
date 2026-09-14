'use client'

// ═══════════════════════════════════════════════════════════════
//  BRUTALIST THEME - "DECLASSIFIED BLUEPRINT"
//  Swiss Industrial Print × punk zine. Single structural accent,
//  swappable via the navbar palette switcher (cobalt / lime / magenta / red).
//  Sounic Akkaraju · AI/ML Engineer · REV 2.0 · UNIT / D-01
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { aeonik, spaceMono } from '@/themes/fonts'
import { PALETTES, DEFAULT_PALETTE, PALETTE_STORAGE_KEY, EASE_OUT, C, type PaletteId } from '@/themes/brutalist/tokens'
import { DevtoolsEgg } from '@/themes/brutalist/primitives/DevtoolsEgg'
import { GrainOverlay } from '@/themes/brutalist/primitives/GrainOverlay'
import { Navbar } from '@/themes/brutalist/nav/Navbar'
import { SkillsSection } from '@/themes/brutalist/sections/Skills'
import { ContactSection } from '@/themes/brutalist/sections/Contact'
import { HomeSection } from '@/themes/brutalist/sections/Hero'
import { AboutSection } from '@/themes/brutalist/sections/About'
import { Footer } from '@/themes/brutalist/sections/Footer'
import { PlaybookSection } from '@/themes/brutalist/sections/Playbook'
import { WorkSection } from '@/themes/brutalist/sections/work/WorkSection'
import { useLenis } from '@/themes/brutalist/motion/useLenis'
import { BlueprintCursor } from '@/themes/brutalist/motion/BlueprintCursor'
import { ProjectModalProvider } from '@/themes/brutalist/sections/work/ProjectModalProvider'
import { ProjectFilterProvider } from '@/themes/brutalist/sections/work/ProjectFilterProvider'
import './brutalist.css'

// ─── ROOT ─────────────────────────────────────────────────────────
export default function BrutalistTheme() {
  // Accent palette is theme-local: persisted under its own key, hydrated after
  // mount to avoid any SSR/first-paint mismatch.
  const [palette, setPaletteState] = useState<PaletteId>(DEFAULT_PALETTE)
  const paletteRef = useRef(palette)
  const reduced = useReducedMotion()
  // Curtain in the incoming accent that wipes across while the palette swaps.
  const [curtain, setCurtain] = useState<{ color: string; key: number } | null>(null)
  useLenis()

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PALETTE_STORAGE_KEY) as PaletteId | null
      if (stored && PALETTES.some((p) => p.id === stored)) setPaletteState(stored)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    paletteRef.current = palette
  }, [palette])

  const setPalette = useCallback(
    (id: PaletteId) => {
      const commit = () => {
        setPaletteState(id)
        try {
          localStorage.setItem(PALETTE_STORAGE_KEY, id)
        } catch {
          /* ignore */
        }
      }
      const next = PALETTES.find((p) => p.id === id)
      if (!next || id === paletteRef.current || reduced || document.hidden) {
        commit()
        return
      }
      // Sweep in (260ms), swap underneath, sweep out. Timers, not animation
      // callbacks, so the swap always lands even if frames pause.
      setCurtain({ color: next.swatch, key: Date.now() })
      window.setTimeout(commit, 260)
      window.setTimeout(() => setCurtain(null), 560)
    },
    [reduced],
  )

  return (
    <div
      className={`brutalist bz-palette-${palette} relative min-h-screen overflow-x-hidden ${aeonik.variable} ${spaceMono.variable}`}
      style={{ background: C.paper, color: C.ink }}
    >
      <GrainOverlay />
      <DevtoolsEgg />
      <BlueprintCursor />

      <ProjectModalProvider>
      <ProjectFilterProvider>
        <Navbar palette={palette} setPalette={setPalette} />

        <main>
          {/* section id="home" is inside HomeSection */}
          <HomeSection />

          <PlaybookSection />

          <SkillsSection />
          <WorkSection />
          <AboutSection />
          <ContactSection />
        </main>

        <Footer />
      </ProjectFilterProvider>
      </ProjectModalProvider>

      <AnimatePresence>
        {curtain && (
          <motion.div
            key={curtain.key}
            aria-hidden="true"
            className="fixed inset-0 z-[150] pointer-events-none"
            style={{ background: curtain.color }}
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            exit={{ clipPath: 'inset(0 0 0 100%)' }}
            transition={{ duration: 0.26, ease: EASE_OUT }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
