'use client'

import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { FiGithub, FiLinkedin, FiFileText } from 'react-icons/fi'
import { profile, socials } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT_TEXT, ON_ACCENT, C } from '@/themes/brutalist/tokens'
import { scrollTo } from '@/themes/brutalist/motion/scroll'
import { FrameTag } from '@/themes/brutalist/primitives/FrameTag'
import { Marquee } from '@/themes/brutalist/primitives/Marquee'
import { Crosshair } from '@/themes/brutalist/primitives/Crosshair'
import { Tape } from '@/themes/brutalist/primitives/Tape'

// ─── HOME / HERO ─────────────────────────────────────────────────
export function HomeSection() {
  const reduced                    = useReducedMotion()
  const dragConstraintsRef         = useRef<HTMLDivElement>(null)

  return (
    <section
      id="home"
      ref={dragConstraintsRef}
      className="relative min-h-[100dvh] overflow-hidden pt-14 flex flex-col"
      style={{ background: C.paper }}
    >
      {/* Telemetry header strip - modular grid hairlines via gap:1px on black */}
      <div
        className="grid overflow-hidden"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: C.black }}
      >
        {[
          { k: 'UNIT', v: 'D-01 / AI-ML' },
          { k: 'STATUS', v: profile.availability.replace('Seeking ', '') },
          { k: 'REV', v: '2.0 / 2026' },
        ].map(({ k, v }) => (
          <div
            key={k}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 overflow-hidden min-w-0 ${spaceMono.className}`}
            style={{ background: C.paper }}
          >
            <Crosshair size={9} color={C.orange} className="shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/40 shrink-0 hidden sm:inline">{k}</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-black truncate">{v}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center w-full">
      {/* Gigantic name - overflows viewport intentionally */}
      <div className="relative pt-4 sm:pt-6 pb-4 px-4 sm:px-6 select-none">
        {/* Structural index numeral - viewport-bleeding, deliberate */}
        <span
          aria-hidden="true"
          className={`absolute right-2 top-0 leading-[0.8] pointer-events-none ${aeonik.className}`}
          style={{
            fontSize: 'clamp(72px, 26vw, 360px)',
            color: 'transparent',
            WebkitTextStroke: `1.5px ${C.black}`,
            opacity: 0.06,
            letterSpacing: '-0.04em',
          }}
        >
          01
        </span>

        <div className="relative z-10" style={{ display: 'inline-block' }}>
          <h1
            className={`font-black uppercase leading-[0.82] ${aeonik.className}`}
            style={{
              fontSize: 'clamp(34px, 9vw, 150px)',
              color: C.ink,
              textShadow: `6px 6px 0 ${C.orange}`,
              letterSpacing: '-0.05em',
            }}
          >
            {profile.firstName}
            <br />
            <span
              style={{
                WebkitTextStroke: `clamp(1.5px, 0.4vw, 4px) ${C.ink}`,
                color: 'transparent',
                textShadow: 'none',
              }}
            >
              AKKARAJU
            </span>
          </h1>
        </div>

        {/* Orange structural rule (replaces squiggle) */}
        <div className="mt-3 ml-1 flex items-center gap-3" aria-hidden="true">
          <div style={{ width: 'min(280px, calc(100vw - 80px))', height: 4, background: C.orange }} />
          <Crosshair size={12} color={C.black} />
        </div>

        {/* Role line - telemetry */}
        <p
          className={`mt-4 text-sm sm:text-base font-bold uppercase tracking-[0.22em] ${spaceMono.className}`}
          style={{ color: C.ink }}
        >
          AI / ML ENGINEER &amp; FULL-STACK BUILDER
        </p>

        {/* Inline availability badge below lg (the absolute taped sticker would
            overlap the bleeding name on mobile/tablet, so it only appears at lg+). */}
        <div className="lg:hidden mt-4 inline-flex items-center gap-2">
          <span
            className={`border-[2px] border-black px-3 py-1.5 font-black text-xs uppercase tracking-widest ${aeonik.className}`}
            style={{ background: C.orange, color: ON_ACCENT, boxShadow: '3px 3px 0 #000' }}
          >
            <span
              className={`flex items-center gap-1.5 text-[10px] mb-0.5 ${spaceMono.className}`}
            >
              <span aria-hidden style={{ display: 'inline-block', width: 6, height: 6, background: ON_ACCENT }} />
              AVAILABLE
              <span aria-hidden style={{ display: 'inline-block', width: 6, height: 6, background: ON_ACCENT }} />
            </span>
            <span className="leading-tight text-[10px]">{profile.availability}</span>
          </span>
        </div>
      </div>

      {/* Availability marker - draggable, taped, single accent */}
      <motion.div
        drag={!reduced}
        dragConstraints={dragConstraintsRef}
        dragMomentum={false}
        className="hidden lg:block absolute z-20 select-none"
        style={{ top: '7rem', right: '170px', rotate: 4, cursor: reduced ? 'default' : 'grab' }}
        whileDrag={{ cursor: 'grabbing' }}
        aria-label="Availability marker"
      >
        <Tape angle={-3} color="rgba(255,255,255,0.8)" />
        <div
          className={`border-[2px] border-black px-4 py-3 font-black text-xs uppercase tracking-widest text-center max-w-[180px] ${aeonik.className}`}
          style={{ background: C.orange, color: ON_ACCENT, boxShadow: '5px 5px 0 #000' }}
        >
          <div className={`flex items-center justify-center gap-1.5 text-[10px] mb-1 ${spaceMono.className}`}>
            <span aria-hidden style={{ display: 'inline-block', width: 7, height: 7, background: ON_ACCENT }} />
            AVAILABLE
            <span aria-hidden style={{ display: 'inline-block', width: 7, height: 7, background: ON_ACCENT }} />
          </div>
          <div className="leading-tight">{profile.availability}</div>
        </div>
      </motion.div>

      {/* Short bio as full bordered card */}
      <div className="px-4 sm:px-6 pb-8 max-w-2xl">
        <div
          className={`border-[2px] border-black bg-white p-5 text-base font-bold leading-relaxed ${spaceMono.className}`}
          style={{ color: C.ink, boxShadow: '5px 5px 0 #000' }}
        >
          <FrameTag color={ACCENT_TEXT}>BRIEF</FrameTag>
          <p className="mt-2">{profile.shortBio}</p>
        </div>
      </div>

      {/* Location + CTA strip - single accent only */}
      <div className="px-4 sm:px-6 pb-4 flex flex-wrap items-center gap-3 sm:gap-4">
        <span
          className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${spaceMono.className}`}
          style={{ color: '#0a0a0a' }}
        >
          <Crosshair size={10} color={C.orange} />
          {profile.location}
        </span>

        {[
          { href: socials.resume,   label: 'Resume',   bg: C.ink,    fg: C.white, icon: <FiFileText size={13} /> },
          { href: socials.github,   label: 'GitHub',   bg: C.white,  fg: C.ink,   icon: <FiGithub size={13} />   },
          { href: socials.linkedin, label: 'LinkedIn', bg: C.white,  fg: C.ink,   icon: <FiLinkedin size={13} /> },
        ].map(({ href, label, bg, fg, icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('/') ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 border-[2px] border-black px-4 py-2 font-black text-xs uppercase tracking-widest transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:-translate-x-px active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0] ${spaceMono.className}`}
            style={{ background: bg, color: fg, boxShadow: '4px 4px 0 #000' }}
          >
            {icon} {label}
          </a>
        ))}

        <button
          onClick={() => scrollTo('contact')}
          className={`inline-flex items-center gap-2 border-[2px] border-black px-4 py-2 font-black text-xs uppercase tracking-widest transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:-translate-x-px active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0] ${spaceMono.className}`}
          style={{ background: C.orange, color: ON_ACCENT, boxShadow: '4px 4px 0 #000' }}
        >
          Contact <span aria-hidden>{'>>'}</span>
        </button>
      </div>

      </div>

      {/* Bottom marquee strip */}
      <Marquee />
    </section>
  )
}

