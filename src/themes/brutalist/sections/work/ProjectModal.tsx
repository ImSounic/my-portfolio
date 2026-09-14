'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { projects } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT_TEXT, ON_ACCENT, EASE_OUT, C } from '@/themes/brutalist/tokens'
import { FrameTag } from '@/themes/brutalist/primitives/FrameTag'
import { STATUS_MAP } from '@/themes/brutalist/sections/work/board'

// ─── PROJECT MODAL (the card, expanded) ──────────────────────────
export function ProjectModal({
  project,
  onClose,
  triggerEl,
}: {
  project: (typeof projects)[number]
  onClose: () => void
  triggerEl: HTMLElement | null
}) {
  const reduced    = useReducedMotion()
  const status     = project.status ? STATUS_MAP[project.status] : null
  const closeRef   = useRef<HTMLButtonElement>(null)

  // focus trap + restore focus on close
  useEffect(() => {
    closeRef.current?.focus()

    const modal = closeRef.current?.closest('[role="dialog"]') as HTMLElement | null

    const getFocusable = () => {
      if (!modal) return []
      return Array.from(
        modal.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
      triggerEl?.focus()
    }
  }, [onClose, triggerEl])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(10,10,10,0.66)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <motion.div
        className={`relative w-full max-w-2xl max-h-[88vh] overflow-y-auto border-[2px] border-black bg-white ${aeonik.className}`}
        style={{ boxShadow: '12px 12px 0 #000' }}
        initial={reduced ? false : { scale: 0.92, opacity: 0, y: 26 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={reduced ? undefined : { scale: 0.94, opacity: 0, y: 26 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal telemetry bar */}
        <div
          className={`flex items-center justify-between px-4 h-9 border-b-[2px] border-black ${spaceMono.className}`}
          style={{ background: C.paper }}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/50">
            DECLASSIFIED / PROJECT FILE
          </span>
          {status && (
            <span
              className="border-[1px] border-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
              style={{ background: status.bg, color: status.fg }}
            >
              {status.label}
            </span>
          )}
        </div>

        {/* Image banner */}
        <div className="relative w-full h-48 sm:h-64 border-b-[2px] border-black" style={{ background: C.paper2 }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />

          {/* Close button - top-right of the image, receives focus on open */}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="absolute top-2 right-2 z-20 border-[2px] border-black w-9 h-9 flex items-center justify-center font-black text-xl bg-white hover:bg-black hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-5">
          <div>
            <h3
              className="font-black uppercase leading-none text-black break-words"
              style={{ fontSize: 'clamp(24px, 4.5vw, 36px)', letterSpacing: '-0.03em', overflowWrap: 'anywhere' }}
            >
              {project.title}
            </h3>
            <p className={`mt-2 text-xs font-bold uppercase tracking-widest ${spaceMono.className}`} style={{ color: '#0a0a0a' }}>
              {project.period} · {project.subtitle}
            </p>
          </div>

          <p className={`text-sm font-bold leading-relaxed text-black ${spaceMono.className}`}>
            {project.description}
          </p>

          {project.highlights.length > 0 && (
            <div>
              <FrameTag color={ACCENT_TEXT}>HIGHLIGHTS</FrameTag>
              <ul className="flex flex-col gap-2 mt-3">
                {project.highlights.map((h) => (
                  <li key={h} className={`flex gap-2 text-sm font-bold leading-snug text-black ${spaceMono.className}`}>
                    <span className="font-black shrink-0" style={{ color: ACCENT_TEXT }} aria-hidden>{'>'}</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`border-[1px] border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${spaceMono.className}`}
                style={{ background: C.paper }}
              >
                {tag}
              </span>
            ))}
          </div>

          {(project.github || project.link) && (
            <div className="flex flex-wrap gap-3 pt-1">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 border-[2px] border-black px-4 py-2 text-xs font-black uppercase tracking-widest transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:-translate-x-px active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${spaceMono.className}`}
                  style={{ background: C.ink, color: C.white, boxShadow: '4px 4px 0 #000' }}
                >
                  <FiGithub size={13} /> View Code
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 border-[2px] border-black px-4 py-2 text-xs font-black uppercase tracking-widest transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:-translate-x-px active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${spaceMono.className}`}
                  style={{ background: C.orange, color: ON_ACCENT, boxShadow: '4px 4px 0 #000' }}
                >
                  <FiExternalLink size={13} /> Live
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

