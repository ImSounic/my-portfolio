'use client'

import { motion, useReducedMotion } from 'motion/react'
import { FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi'
import { socials } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ON_ACCENT, accentA, EASE_OUT, canHover, C } from '@/themes/brutalist/tokens'
import { FrameTag } from '@/themes/brutalist/primitives/FrameTag'

// ─── CONTACT ─────────────────────────────────────────────────────
export function ContactSection() {
  const reduced = useReducedMotion()

  // Single accent or ink only.
  const links = [
    { icon: FiMail,     label: 'Email',    href: socials.email,    detail: 'imsounic.dev@gmail.com', bg: C.orange, fg: ON_ACCENT },
    { icon: FiLinkedin, label: 'LinkedIn', href: socials.linkedin, detail: '/in/imsounic',           bg: C.ink,    fg: C.white },
    { icon: FiGithub,   label: 'GitHub',   href: socials.github,   detail: 'ImSounic',               bg: C.ink,    fg: C.white },
    { icon: FiFileText, label: 'Resume',   href: socials.resume,   detail: 'Download PDF',           bg: C.paper,  fg: C.ink   },
  ]

  return (
    <section
      id="contact"
      className="py-12 sm:py-20 px-4 sm:px-6 overflow-x-hidden"
      style={{ background: C.ink }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Big loud heading - outlined macro-type */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <FrameTag color={C.orange}>SECTION / TRANSMIT</FrameTag>
            <div className="flex-1 h-px min-w-[16px]" style={{ background: accentA(40) }} />
            <span className={`text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 shrink-0 ${spaceMono.className}`}>
              UNIT / D-05
            </span>
          </div>
          <h2
            className={`font-black uppercase leading-[0.85] ${aeonik.className}`}
            style={{
              fontSize: 'clamp(40px, 10vw, 124px)',
              color: 'transparent',
              WebkitTextStroke: `3px ${C.orange}`,
              letterSpacing: '-0.05em',
            }}
          >
            CONTACT
          </h2>
        </div>

        {/* Loud sub-headline */}
        <p
          className={`text-2xl sm:text-3xl font-black uppercase text-white mb-12 leading-tight ${aeonik.className}`}
        >
          Got an AI/ML problem?{' '}
          <span style={{ color: C.orange }}>Let&apos;s build.</span>
        </p>

        {/* Contact blocks - modular hairline grid */}
        <div
          className="grid sm:grid-cols-2 max-w-2xl"
          style={{ gap: 2, background: C.orange, border: `2px solid ${C.orange}` }}
        >
          {links.map(({ icon: Icon, label, href, detail, bg, fg }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('mailto') || href.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className={`flex items-center gap-4 p-5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-inset ${aeonik.className}`}
              style={{ background: bg, color: fg }}
              whileHover={reduced || !canHover ? undefined : { x: -2, y: -2 }}
              transition={{ duration: 0.14, ease: EASE_OUT }}
              aria-label={label}
            >
              <Icon size={22} aria-hidden="true" />
              <div className="min-w-0">
                <div className="font-black text-sm uppercase tracking-widest">{label}</div>
                <div
                  className={`text-xs font-bold break-all ${spaceMono.className}`}
                  style={{ color: fg }}
                >
                  {detail}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

