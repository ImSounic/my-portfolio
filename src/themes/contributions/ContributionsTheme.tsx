'use client'

// ═══════════════════════════════════════════════════════════════
//  CONTRIBUTIONS · GitHub's dark contribution-graph palette
//  The hero is Sounic's real last-year contribution graph spelling
//  SOUNIC; scroll lifts the green cells into an MLP and folds the graph
//  into a CNN. Then four data problems acted out in 3D, the work on a
//  line (click a project for its details), the stack, about, and contact.
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react'
import { CONTRIB_READY } from '@/components/ContribLoader'
import { clash } from '@/themes/fonts'
import { Strip, useReveal } from '@/themes/contributions/parts'
import { ContribHero } from '@/themes/contributions/sections/ContribHero'
import { Exposures } from '@/themes/contributions/sections/Exposures'
import { Work } from '@/themes/contributions/sections/Work'
// The convolution printer section is parked for now; kept in sections/Convolution.tsx.
// import { Convolution } from '@/themes/contributions/sections/Convolution'
import { Chemistry } from '@/themes/contributions/sections/Chemistry'
import { About } from '@/themes/contributions/sections/About'
import { Contact } from '@/themes/contributions/sections/Contact'
import './contributions.css'

export default function ContributionsTheme() {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)

  // Tell the loader the page is here, so it can hand over.
  useEffect(() => {
    window.__contribReady = true
    window.dispatchEvent(new Event(CONTRIB_READY))
  }, [])

  return (
    <div ref={root} className={`dk ${clash.variable}`}>
      <main>
        <ContribHero />
        <Strip />
        <Exposures />
        <Strip />
        <Work />
        {/* Parked for later use:
        <Strip />
        <Convolution />
        */}
        <Strip />
        <Chemistry />
        <Strip />
        <About />
      </main>
      <Contact />
    </div>
  )
}
