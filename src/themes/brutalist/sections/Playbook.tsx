'use client'

import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import Image from 'next/image'
import { manifesto, hotTakes, projects } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT_TEXT, EASE_OUT, canHover, C } from '@/themes/brutalist/tokens'
import { SplitReveal } from '@/themes/brutalist/motion/SplitReveal'
import { LetterRoll } from '@/themes/brutalist/motion/LetterRoll'
import { Crosshair } from '@/themes/brutalist/primitives/Crosshair'
import { useProjectModal } from '@/themes/brutalist/sections/work/ProjectModalProvider'

// ─── PLAYBOOK ────────────────────────────────────────────────────
// The manifesto's first sentence as a statement, then the six takes as a
// numbered sequence. Takes backed by a project open that project: hovering
// shows a preview that follows the pointer, clicking opens the modal.

const firstStop = manifesto.indexOf('. ')
const statement = manifesto.slice(0, firstStop + 1)
const remainder = manifesto.slice(firstStop + 2)

const withEmphasis = (text: string): ReactNode[] =>
  text.split('*').map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="not-italic" style={{ color: ACCENT_TEXT }}>
        {part}
      </em>
    ) : (
      part
    ),
  )

const PREVIEW_W = 240
const projectById = (id?: string) => (id ? projects.find((p) => p.id === id) ?? null : null)

export function PlaybookSection() {
  const reduced = useReducedMotion()
  const { open } = useProjectModal()
  const [hoverId, setHoverId] = useState<string | null>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 320, damping: 32, mass: 0.5 })
  const sy = useSpring(py, { stiffness: 320, damping: 32, mass: 0.5 })
  const previews = canHover && !reduced
  const hoverProject = projectById(hoverId ?? undefined)

  const track = (e: PointerEvent<HTMLElement>) => {
    const flip = e.clientX + 28 + PREVIEW_W > window.innerWidth
    px.set(flip ? e.clientX - PREVIEW_W - 28 : e.clientX + 28)
    py.set(e.clientY + 24)
  }

  return (
    <section id="playbook" className="overflow-x-hidden" style={{ background: C.paper, color: C.ink }}>
      {/* Statement */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SplitReveal
          as="h2"
          text={statement}
          effect="stamp"
          stagger={0.07}
          duration={0.55}
          className={`font-black uppercase leading-[0.92] ${aeonik.className}`}
          style={{ fontSize: 'clamp(36px, 7.2vw, 108px)', letterSpacing: '-0.04em', maxWidth: '14ch', textWrap: 'balance' }}
        />
        <p
          className={`mt-8 max-w-[62ch] text-base sm:text-lg font-bold leading-relaxed ${spaceMono.className}`}
          style={{ textWrap: 'pretty' }}
        >
          {withEmphasis(remainder)}
        </p>
      </div>

      {/* Sequence */}
      <div className="border-t-[3px] border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-end justify-between gap-4 flex-wrap">
          <SplitReveal
            as="h3"
            text="PLAYBOOK"
            effect="stamp"
            className={`font-black uppercase leading-none ${aeonik.className}`}
            style={{ fontSize: 'clamp(28px, 5vw, 64px)', letterSpacing: '-0.04em' }}
          />
          <span
            className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${spaceMono.className}`}
            style={{ color: 'rgba(10,10,10,0.55)' }}
          >
            <Crosshair size={9} color={C.orange} />
            {hotTakes.length} takes, each backed by work. Open one to see the proof.
          </span>
        </div>

        <ol className="border-t-[2px] border-black">
          {hotTakes.map((take, i) => {
            const project = projectById(take.projectId)
            const interactive = !!project
            const activate = (e: { currentTarget: HTMLElement }) => project && open(project.id, e.currentTarget)
            const onKey = (e: KeyboardEvent<HTMLLIElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                activate(e)
              }
            }
            return (
              <li
                key={take.title}
                className={`group border-b-[2px] border-black ${interactive ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--bz-accent)]' : ''}`}
                style={{ background: i % 2 === 0 ? C.paper : C.white }}
                role={interactive ? 'button' : undefined}
                tabIndex={interactive ? 0 : undefined}
                aria-label={interactive ? `Open ${project!.title}` : undefined}
                data-cursor={interactive ? 'OPEN' : undefined}
                data-lr-host={interactive ? '' : undefined}
                onClick={interactive ? activate : undefined}
                onKeyDown={interactive ? onKey : undefined}
                onPointerEnter={interactive && previews ? () => setHoverId(project!.id) : undefined}
                onPointerMove={interactive && previews ? track : undefined}
                onPointerLeave={interactive && previews ? () => setHoverId(null) : undefined}
              >
                <div className="max-w-6xl mx-auto grid md:grid-cols-[minmax(120px,220px)_1fr] gap-x-10 px-4 sm:px-6 py-8 sm:py-12">
                  <div className="md:sticky md:top-24 self-start">
                    <span
                      aria-hidden="true"
                      className={`block font-black leading-none transition-colors duration-200 ${interactive ? 'group-hover:text-black' : ''} ${aeonik.className}`}
                      style={{ fontSize: 'clamp(56px, 9vw, 140px)', letterSpacing: '-0.04em', color: ACCENT_TEXT }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="mt-4 md:mt-2">
                    <SplitReveal
                      as="h4"
                      text={take.title.toUpperCase()}
                      mode="words"
                      effect="redact"
                      stagger={0.08}
                      className={`font-black uppercase leading-[0.95] ${aeonik.className}`}
                      style={{ fontSize: 'clamp(24px, 3.2vw, 44px)', letterSpacing: '-0.03em' }}
                    />
                    <p
                      className={`mt-4 max-w-[62ch] text-sm sm:text-base font-bold leading-relaxed ${spaceMono.className}`}
                      style={{ textWrap: 'pretty' }}
                    >
                      {take.body}
                    </p>
                    {project && (
                      <span
                        className={`mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] ${spaceMono.className}`}
                        style={{ color: ACCENT_TEXT }}
                      >
                        <span aria-hidden>{'>>>'}</span>
                        <LetterRoll text={`Proof: ${project.title}`} />
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Floating evidence preview (pointer devices) */}
      <AnimatePresence>
        {previews && hoverProject && (
          <motion.div
            key={hoverProject.id}
            aria-hidden="true"
            className="fixed top-0 left-0 z-[120] pointer-events-none"
            style={{ x: sx, y: sy, width: PREVIEW_W }}
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
          >
            <div className="border-[2px] border-black bg-white" style={{ boxShadow: '6px 6px 0 #000' }}>
              <div className="relative h-[130px] border-b-[2px] border-black" style={{ background: C.paper2 }}>
                <Image src={hoverProject.image} alt="" fill sizes="240px" className="object-cover" />
              </div>
              <div className="p-3">
                <div className={`font-black text-xs uppercase leading-tight ${aeonik.className}`}>{hoverProject.title}</div>
                <div className={`mt-1 text-[9px] font-bold uppercase tracking-[0.16em] ${spaceMono.className}`} style={{ color: ACCENT_TEXT }}>
                  {'>>>'} Open unit
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
