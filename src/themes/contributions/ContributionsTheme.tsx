'use client'

// ═══════════════════════════════════════════════════════════════
//  CONTRIBUTIONS · GitHub's dark contribution-graph palette
//  The hero is Sounic's real last-year contribution graph spelling
//  SOUNIC; scroll lifts the green cells into an MLP and folds the graph
//  into a CNN. Then the work on a line, one project in the tray every
//  15 seconds, notes, the
//  stack, about, and contact.
// ═══════════════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from 'react'
import { CONTRIB_READY } from '@/components/ContribLoader'
import { clash } from '@/themes/fonts'
import { PRINTS } from '@/themes/contributions/data'
import { Strip, useReveal } from '@/themes/contributions/parts'
import { ContribHero } from '@/themes/contributions/sections/ContribHero'
import { Exposures } from '@/themes/contributions/sections/Exposures'
import { Work } from '@/themes/contributions/sections/Work'
import { Tray } from '@/themes/contributions/sections/Tray'
import { Notes } from '@/themes/contributions/sections/Notes'
// The convolution printer section is parked for now; kept in sections/Convolution.tsx.
// import { Convolution } from '@/themes/contributions/sections/Convolution'
import { Chemistry } from '@/themes/contributions/sections/Chemistry'
import { About } from '@/themes/contributions/sections/About'
import { Contact } from '@/themes/contributions/sections/Contact'
import './contributions.css'

export default function ContributionsTheme() {
  const root = useRef<HTMLDivElement>(null)
  const [tray, setTray] = useState(0)
  useReveal(root)

  // Tell the loader the page is here, so it can hand over.
  useEffect(() => {
    window.__contribReady = true
    window.dispatchEvent(new Event(CONTRIB_READY))
  }, [])

  // -1 advances (the tray's own clock); anything else selects that project.
  const setTrayIndex = useCallback((i: number) => {
    setTray((prev) => (i === -1 ? (prev + 1) % PRINTS.length : i))
  }, [])

  const openPrint = useCallback((i: number) => {
    setTray(i)
    const el = document.getElementById('tray')
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    el.querySelector<HTMLButtonElement>('.dk-tray__nav button')?.focus({ preventScroll: true })
  }, [])

  return (
    <div ref={root} className={`dk ${clash.variable}`}>
      <main>
        <ContribHero />
        <Strip />
        <Exposures />
        <Strip />
        <Work onOpen={openPrint} />
        <Tray index={tray} setIndex={setTrayIndex} />
        <Strip />
        <Notes />
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
