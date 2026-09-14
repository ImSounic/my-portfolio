'use client'

import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { FiGithub } from 'react-icons/fi'
import { projects } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT_TEXT, accentA, canHover, C } from '@/themes/brutalist/tokens'
import { Tape } from '@/themes/brutalist/primitives/Tape'
import { LetterRoll } from '@/themes/brutalist/motion/LetterRoll'
import { STATUS_MAP, fallVariants } from '@/themes/brutalist/sections/work/board'

// ─── FALLING STICKY NOTE (page two) ─────────────────────────────
// Text-only sticky note: FALLS IN from above and STICKS at a slight
// angle (spring overshoot), FALLS OFF downward on page flip, staggered.
// No image. Opens the existing project modal (keyboard-accessible).
export function FallNoteCard({
  project,
  index,
  row,
  unitIndex,
  restRot,
  fallInRot,
  fallOffRot,
  onOpen,
}: {
  project: (typeof projects)[number]
  index: number
  row: number
  unitIndex: number
  restRot: number
  fallInRot: number
  fallOffRot: number
  onOpen: (triggerEl: HTMLElement) => void
}) {
  const reduced    = useReducedMotion()
  const articleRef = useRef<HTMLElement>(null)
  const status     = project.status ? STATUS_MAP[project.status] : null
  const v = fallVariants(reduced ?? false, index, row, restRot, fallInRot, fallOffRot)

  const handleOpen = () => {
    onOpen(articleRef.current as HTMLElement)
  }

  return (
    <motion.article
      ref={articleRef}
      className="relative select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eae8e3]"
      variants={v}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={reduced || !canHover ? undefined : { rotate: 0, scale: 1.03, zIndex: 10 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      onClick={handleOpen}
      role="button"
      data-lr-host
      tabIndex={0}
      aria-label={`Open details for ${project.title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen() } }}
    >
      {/* Tape strip = the pin holding the note to the wall */}
      <Tape
        angle={restRot * 0.6}
        color={project.featured ? accentA(55) : 'rgba(255,255,255,0.7)'}
      />

      <div
        className={`border-[3px] border-black bg-white p-5 flex flex-col gap-3 ${aeonik.className}`}
        style={{ boxShadow: `${project.featured ? C.orange : C.black} 7px 6px 0` }}
      >
        {/* Unit code + status - telemetry header row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[9px] font-bold uppercase tracking-[0.16em] text-black/40 ${spaceMono.className}`}>
            LOG / {String(unitIndex + 1).padStart(2, '0')}
          </span>
          {status && (
            <span
              className={`border-[1px] border-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${spaceMono.className}`}
              style={{ background: status.bg, color: status.fg }}
            >
              {status.label}
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3
            className="font-black uppercase leading-tight text-black text-base tracking-tight break-words"
            style={{ letterSpacing: '-0.02em' }}
          >
            {project.title}
          </h3>
          <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${spaceMono.className}`} style={{ color: '#0a0a0a' }}>
            {project.period} · {project.subtitle}
          </p>
        </div>

        {/* Blurb */}
        <p className={`text-xs font-bold leading-relaxed text-black flex-1 ${spaceMono.className}`}>
          {project.blurb}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`border-[1px] border-black px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${spaceMono.className}`}
              style={{ background: C.paper }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: expand cue + GitHub source link (text note - no image) */}
        <div className="flex items-center justify-between pt-2 border-t-[1px] border-black/15">
          <span
            className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${spaceMono.className}`}
            style={{ color: ACCENT_TEXT }}
          >
            <span aria-hidden>{'>>>'}</span> <LetterRoll text="EXPAND UNIT" />
          </span>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-black hover:text-[color:var(--bz-accent-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${spaceMono.className}`}
              aria-label={`View source for ${project.title} on GitHub`}
            >
              <FiGithub size={11} aria-hidden="true" /> <LetterRoll text="VIEW SOURCE" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

