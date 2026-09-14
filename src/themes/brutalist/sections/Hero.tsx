'use client'

import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { FiGithub, FiLinkedin, FiFileText } from 'react-icons/fi'
import { profile, socials } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT, ON_ACCENT, C } from '@/themes/brutalist/tokens'
import { scrollTo } from '@/themes/brutalist/motion/scroll'
import { Wordmark } from '@/themes/brutalist/motion/Wordmark'
import { LetterRoll } from '@/themes/brutalist/motion/LetterRoll'
import { Magnetic } from '@/themes/brutalist/motion/Magnetic'
import { Crosshair } from '@/themes/brutalist/primitives/Crosshair'
import { Tape } from '@/themes/brutalist/primitives/Tape'

// ─── HOME / HERO: the accent colour field ─────────────────────────
// Full-bleed accent field carrying a viewport-width wordmark. The four
// palettes recolour the whole field live; everything on it uses the
// contrast-verified ON_ACCENT token.
export function HomeSection() {
  const reduced            = useReducedMotion()
  const dragConstraintsRef = useRef<HTMLDivElement>(null)

  const hairline = 'color-mix(in srgb, var(--bz-on-accent) 28%, transparent)'
  const cta = `inline-flex items-center gap-2 border-[2px] border-black px-4 py-2 min-h-[44px] font-black text-xs uppercase tracking-widest transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:-translate-x-px active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-on-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bz-accent)] ${spaceMono.className}`

  return (
    <section
      id="home"
      ref={dragConstraintsRef}
      className="relative min-h-[100dvh] overflow-hidden pt-14 flex flex-col"
      style={{ background: ACCENT, color: ON_ACCENT }}
    >
      {/* Telemetry strip: hairline grid drawn in the on-accent tone */}
      <div
        className="grid overflow-hidden border-b"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: hairline, borderColor: hairline }}
      >
        {[
          { k: 'UNIT',   v: 'D-01 / AI-ML' },
          { k: 'STATUS', v: profile.availability.replace('Seeking ', '') },
          { k: 'REV',    v: '3.0 / 2026' },
        ].map(({ k, v }) => (
          <div
            key={k}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 overflow-hidden min-w-0 ${spaceMono.className}`}
            style={{ background: ACCENT }}
          >
            <Crosshair size={9} color={ON_ACCENT} className="shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] shrink-0 hidden sm:inline" style={{ opacity: 0.6 }}>{k}</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] truncate">{v}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center w-full">
        {/* Wordmark */}
        <div className="relative pt-6 sm:pt-10 pb-4 px-4 sm:px-6 select-none">
          <span
            aria-hidden="true"
            className={`absolute right-2 top-0 leading-[0.8] pointer-events-none ${aeonik.className}`}
            style={{
              fontSize: 'clamp(72px, 26vw, 360px)',
              color: 'transparent',
              WebkitTextStroke: `1.5px ${ON_ACCENT}`,
              opacity: 0.14,
              letterSpacing: '-0.04em',
            }}
          >
            01
          </span>

          <h1 className={`relative z-10 font-black uppercase ${aeonik.className}`} style={{ color: ON_ACCENT }}>
            <Wordmark
              text={profile.firstName.toUpperCase()}
              delay={0.15}
              stagger={0.05}
              duration={0.85}
              radius={240}
              lift={28}
              tilt={8}
              className="block leading-[0.9]"
              style={{ fontSize: 'clamp(64px, 20.5vw, 460px)', letterSpacing: '-0.04em' }}
            />
            <Wordmark
              text="AKKARAJU"
              delay={0.5}
              stagger={0.035}
              duration={0.7}
              radius={160}
              lift={12}
              tilt={5}
              className="block leading-[1]"
              style={{ fontSize: 'clamp(28px, 7.2vw, 150px)', letterSpacing: '-0.02em' }}
              letterStyle={{ color: 'transparent', WebkitTextStroke: `clamp(1.5px, 0.35vw, 4px) ${ON_ACCENT}` }}
            />
          </h1>

          {/* Rule + role line */}
          <div className="mt-5 flex items-center gap-3" aria-hidden="true">
            <div style={{ width: 'min(280px, calc(100vw - 80px))', height: 4, background: ON_ACCENT }} />
            <Crosshair size={12} color={ON_ACCENT} />
          </div>
          <p className={`mt-4 text-sm sm:text-base font-bold uppercase tracking-[0.22em] ${spaceMono.className}`}>
            {profile.tagline}
          </p>

          {/* Availability, inline below lg (the draggable marker takes over at lg+) */}
          <div className="lg:hidden mt-5 inline-flex items-center gap-2">
            <span
              className={`border-[2px] border-black px-3 py-1.5 font-black text-xs uppercase tracking-widest ${aeonik.className}`}
              style={{ background: C.paper, color: C.ink, boxShadow: '3px 3px 0 #000' }}
            >
              <span className={`flex items-center gap-1.5 text-[10px] mb-0.5 ${spaceMono.className}`}>
                <span aria-hidden style={{ display: 'inline-block', width: 6, height: 6, background: ACCENT }} />
                AVAILABLE
                <span aria-hidden style={{ display: 'inline-block', width: 6, height: 6, background: ACCENT }} />
              </span>
              <span className="leading-tight text-[10px]">{profile.availability}</span>
            </span>
          </div>
        </div>

        {/* Availability marker: draggable, taped, paper on the field */}
        <motion.div
          drag={!reduced}
          dragConstraints={dragConstraintsRef}
          dragMomentum={false}
          className="hidden lg:block absolute z-20 select-none"
          style={{ top: '7rem', right: '170px', rotate: 4, cursor: reduced ? 'default' : 'grab' }}
          whileDrag={{ cursor: 'grabbing' }}
          aria-label="Availability marker"
          data-cursor="DRAG"
        >
          <Tape angle={-3} color="rgba(255,255,255,0.85)" />
          <div
            className={`border-[2px] border-black px-4 py-3 font-black text-xs uppercase tracking-widest text-center max-w-[180px] ${aeonik.className}`}
            style={{ background: C.paper, color: C.ink, boxShadow: '5px 5px 0 #000' }}
          >
            <div className={`flex items-center justify-center gap-1.5 text-[10px] mb-1 ${spaceMono.className}`}>
              <span aria-hidden style={{ display: 'inline-block', width: 7, height: 7, background: ACCENT }} />
              AVAILABLE
              <span aria-hidden style={{ display: 'inline-block', width: 7, height: 7, background: ACCENT }} />
            </div>
            <div className="leading-tight">{profile.availability}</div>
          </div>
        </motion.div>

        {/* Brief */}
        <div className="px-4 sm:px-6 pb-8 max-w-2xl">
          <p
            className={`border-t-[2px] pt-4 text-base font-bold leading-relaxed ${spaceMono.className}`}
            style={{ borderColor: ON_ACCENT, color: ON_ACCENT, textWrap: 'pretty' }}
          >
            {profile.shortBio}
          </p>
        </div>

        {/* Location + actions */}
        <div className="px-4 sm:px-6 pb-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${spaceMono.className}`}>
            <Crosshair size={10} color={ON_ACCENT} />
            {profile.location}
          </span>

          {[
            { href: socials.resume,   label: 'Resume',   bg: C.ink,   fg: C.white, icon: <FiFileText size={13} /> },
            { href: socials.github,   label: 'GitHub',   bg: C.paper, fg: C.ink,   icon: <FiGithub size={13} />   },
            { href: socials.linkedin, label: 'LinkedIn', bg: C.paper, fg: C.ink,   icon: <FiLinkedin size={13} /> },
          ].map(({ href, label, bg, fg, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              data-lr-host
              className={cta}
              style={{ background: bg, color: fg, boxShadow: '4px 4px 0 #000' }}
            >
              {icon} <LetterRoll text={label} />
            </a>
          ))}

          <Magnetic strength={0.3}>
            <button
              type="button"
              onClick={() => scrollTo('contact')}
              data-lr-host
              className={cta}
              style={{ background: ON_ACCENT, color: ACCENT, boxShadow: '4px 4px 0 #000' }}
            >
              <LetterRoll text="Contact" /> <span aria-hidden>{'>>'}</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
