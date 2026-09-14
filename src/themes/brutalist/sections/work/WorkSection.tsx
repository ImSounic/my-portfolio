'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { projects } from '@/data/portfolio'
import { spaceMono } from '@/themes/fonts'
import { ON_ACCENT, NEW_PROJECT_IDS, REST_ROTS, FALL_IN_ROTS, FALL_OFF_ROTS, C } from '@/themes/brutalist/tokens'
import { useProjectModal } from '@/themes/brutalist/sections/work/ProjectModalProvider'
import { FallNoteCard } from '@/themes/brutalist/sections/work/FallNoteCard'
import { BoardHeader } from '@/themes/brutalist/sections/work/BoardHeader'
import { PinCard } from '@/themes/brutalist/sections/work/PinCard'
import { PageNav } from '@/themes/brutalist/sections/work/PageNav'

export function WorkSection() {
  const { open }                  = useProjectModal()
  const [page, setPage]           = useState(0) // 0 = originals, 1 = newest

  // PAGE 01 = the original projects, PAGE 02 = the four newest units.
  const originalProjects = projects.filter((p) => !NEW_PROJECT_IDS.includes(p.id as (typeof NEW_PROJECT_IDS)[number]))
  const newProjects      = projects.filter((p) =>  NEW_PROJECT_IDS.includes(p.id as (typeof NEW_PROJECT_IDS)[number]))
  const startIndex       = originalProjects.length
  const total            = projects.length

  const pageProjects = page === 0 ? originalProjects : newProjects
  const flip = () => setPage((p) => (p === 0 ? 1 : 0))

  // Responsive column count (matches grid-cols-1 sm:grid-cols-2 xl:grid-cols-3),
  // used to compute each card's row so rows fall from the same height.
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      setCols(w >= 1280 ? 3 : w >= 640 ? 2 : 1)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  // Lock the board to a FIXED height = the taller of the two pages. Both pages
  // are measured up front from a hidden duplicate of each grid, so the height is
  // identical on both pages from the first render and the flip never resizes the
  // section. Re-measures (debounced) on resize.
  const measRef0 = useRef<HTMLDivElement>(null)
  const measRef1 = useRef<HTMLDivElement>(null)
  const [lockedH, setLockedH] = useState<number | null>(null)
  const [needMeasure, setNeedMeasure] = useState(true)

  useLayoutEffect(() => {
    if (!needMeasure) return
    const h0 = measRef0.current?.getBoundingClientRect().height ?? 0
    const h1 = measRef1.current?.getBoundingClientRect().height ?? 0
    if (h0 && h1) {
      setLockedH(Math.ceil(Math.max(h0, h1)))
      setNeedMeasure(false)
    }
  }, [needMeasure])

  useEffect(() => {
    let t: number | undefined
    const onResize = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => setNeedMeasure(true), 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Re-measure once web fonts have loaded (text height shifts on font swap).
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => setNeedMeasure(true)).catch(() => {})
    }
  }, [])

  const handleOpen = (id: string, el: HTMLElement) => open(id, el)

  return (
    // overflow-x-clip (not -hidden): clips horizontal overflow WITHOUT forcing
    // overflow-y to auto, so the falling cards never spawn a vertical scrollbar
    // on the section (which would shift the centered content left then back).
    <section
      id="work"
      className="py-12 sm:py-20 px-4 sm:px-6 overflow-x-clip"
      style={{ background: C.paper2 }}
    >
      <div className="max-w-6xl mx-auto relative">
        {/* Animated header - swaps PROJECTS <-> PAGE TWO with FRESH DROPS */}
        <BoardHeader page={page} total={total} startIndex={startIndex} />

        {/* Static instruction marker - no emoji */}
        <div className="mb-12 -mt-6 flex items-center gap-3 flex-wrap">
          <span
            className={`inline-flex items-center gap-2 border-[2px] border-black px-3 py-1.5 text-xs font-black uppercase tracking-widest ${spaceMono.className}`}
            style={{ background: C.orange, color: ON_ACCENT, boxShadow: '3px 3px 0 #000' }}
          >
            <span aria-hidden>{'>>>'}</span> CLICK A UNIT TO DECLASSIFY
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-[0.16em] text-black/45 ${spaceMono.className}`}>
            {total} UNITS ON FILE
          </span>
        </div>

        {/* Hidden measurement layer: renders BOTH grids off-layer once (and on
            resize) so we can lock a fixed height = the taller page. */}
        {needMeasure && (
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 md:pr-24 pointer-events-none"
            style={{ visibility: 'hidden', zIndex: -1 }}
          >
            <div ref={measRef0} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {originalProjects.map((project, i) => (
                <PinCard
                  key={project.id}
                  project={project}
                  index={i}
                  row={0}
                  restRot={0}
                  fallInRot={0}
                  fallOffRot={0}
                  onOpen={() => {}}
                />
              ))}
            </div>
            <div ref={measRef1} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {newProjects.map((project, i) => (
                <FallNoteCard
                  key={project.id}
                  project={project}
                  index={i}
                  row={0}
                  unitIndex={startIndex + i}
                  restRot={0}
                  fallInRot={0}
                  fallOffRot={0}
                  onOpen={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* The board: one page at a time. Cards FALL OFF then FALL IN.
            md:pr-24 reserves the right gutter for the side page-nav button.
            Fixed minHeight = taller page, so the flip never resizes the section. */}
        <div
          className="relative md:pr-24"
          style={{ minHeight: lockedH ? `${lockedH}px` : undefined }}
          aria-live="polite"
          aria-label={`Projects, page ${page + 1} of 2`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`page-${page}`}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {pageProjects.map((project, i) =>
                page === 0 ? (
                  <PinCard
                    key={project.id}
                    project={project}
                    index={i}
                    row={Math.floor(i / cols)}
                    restRot={REST_ROTS[i % REST_ROTS.length]}
                    fallInRot={FALL_IN_ROTS[i % FALL_IN_ROTS.length]}
                    fallOffRot={FALL_OFF_ROTS[i % FALL_OFF_ROTS.length]}
                    onOpen={(el) => handleOpen(project.id, el)}
                  />
                ) : (
                  <FallNoteCard
                    key={project.id}
                    project={project}
                    index={i}
                    row={Math.floor(i / cols)}
                    unitIndex={startIndex + i}
                    restRot={REST_ROTS[i % REST_ROTS.length]}
                    fallInRot={FALL_IN_ROTS[i % FALL_IN_ROTS.length]}
                    fallOffRot={FALL_OFF_ROTS[i % FALL_OFF_ROTS.length]}
                    onOpen={(el) => handleOpen(project.id, el)}
                  />
                ),
              )}
            </motion.div>
          </AnimatePresence>

          {/* Side page-flip control: vertically centered on the cards, in the right gutter. */}
          <PageNav page={page} onFlip={flip} />
        </div>

        {/* Mobile page-flip control (the side button is desktop-only). */}
        <div className="md:hidden mt-10 flex justify-center">
          <button
            type="button"
            onClick={flip}
            aria-label={page === 0 ? 'Go to page two of projects' : 'Back to page one of projects'}
            className={`inline-flex items-center gap-3 border-[2px] border-black px-5 py-3 min-h-[44px] text-xs font-black uppercase tracking-widest transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eae8e3] ${spaceMono.className}`}
            style={{ background: C.orange, color: ON_ACCENT, boxShadow: '4px 4px 0 #000' }}
          >
            {page === 0 ? 'VIEW PAGE 02' : 'BACK TO PAGE 01'}
            <span aria-hidden="true" className="text-base font-black leading-none">{page === 0 ? '↓' : '↑'}</span>
          </button>
        </div>
      </div>

    </section>
  )
}

