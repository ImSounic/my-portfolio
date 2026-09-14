'use client'

// ═══════════════════════════════════════════════════════════════
//  BRUTALIST THEME - "DECLASSIFIED BLUEPRINT"
//  Swiss Industrial Print × punk zine. Single structural accent,
//  swappable via the navbar palette switcher (cobalt / lime / magenta / red).
//  Sounic Akkaraju · AI/ML Engineer · REV 2.0 · UNIT / D-01
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { aeonik, spaceMono } from '@/themes/fonts'
import { PALETTES, DEFAULT_PALETTE, PALETTE_STORAGE_KEY, C, type PaletteId } from '@/themes/brutalist/tokens'
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
import TargetCursor from '@/components/ui/reactbits/TargetCursor'
import { useLenis } from '@/themes/brutalist/motion/useLenis'
import './brutalist.css'

// ─── ROOT ─────────────────────────────────────────────────────────
export default function BrutalistTheme() {
  // Accent palette is theme-local: persisted under its own key, hydrated after
  // mount to avoid any SSR/first-paint mismatch.
  const [palette, setPaletteState] = useState<PaletteId>(DEFAULT_PALETTE)
  useLenis()

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PALETTE_STORAGE_KEY) as PaletteId | null
      if (stored && PALETTES.some((p) => p.id === stored)) setPaletteState(stored)
    } catch {
      /* ignore */
    }
  }, [])

  const setPalette = useCallback((id: PaletteId) => {
    setPaletteState(id)
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <div
      className={`brutalist bz-palette-${palette} relative min-h-screen overflow-x-hidden ${aeonik.variable} ${spaceMono.variable}`}
      style={{ background: C.paper, color: C.ink }}
    >
      <GrainOverlay />
      <DevtoolsEgg />
      <TargetCursor targetSelector='button, a, [role="button"]' spinDuration={3} hoverDuration={0.4} parallaxOn={true} />
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
    </div>
  )
}
