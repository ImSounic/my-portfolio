'use client'

// ═══════════════════════════════════════════════════════════════
//  BRUTALIST THEME - "DECLASSIFIED BLUEPRINT"
//  Swiss Industrial Print × punk zine. Single orange accent.
//  Sounic Akkaraju · AI/ML Engineer · REV 2.0 · UNIT / D-01
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import {
  motion,
  useReducedMotion,
  useAnimation,
  AnimatePresence,
} from 'motion/react'
import Image from 'next/image'
import { FiGithub, FiLinkedin, FiMail, FiFileText, FiExternalLink } from 'react-icons/fi'
import {
  profile,
  socials,
  projects,
  skills,
  education,
  languages,
  manifesto,
  hotTakes,
  creative,
  gaming,
  colophon,
  navSections,
} from '@/data/portfolio'
import { syne, spaceMono } from '@/themes/fonts'

// ─── PALETTE - ONE ACCENT (orange) + ink + paper ────────────────
const C = {
  paper:  '#f4f4f0',
  paper2: '#eae8e3', // secondary substrate (still Swiss paper family)
  ink:    '#0a0a0a', // carbon ink (avoid pure #000 surfaces, use for ink)
  black:  '#000000', // hairlines / borders only
  orange: '#ff5d2e', // THE single structural accent
  white:  '#ffffff',
} as const

// ─── MOTION - custom curves with mass (emil / high-end) ─────────
const EASE_OUT = [0.23, 1, 0.32, 1] as const
const SPRING   = { type: 'spring', stiffness: 280, damping: 24 } as const

// ─── DETERMINISTIC ROTATIONS (no Math.random - SSR-safe) ────────
// Each page is a stack of taped cards. On a page flip the current
// page FALLS OFF (drops + tilts away) and the next page FALLS IN and
// STICKS at a small resting angle (spring with mild overshoot).

// ─── PAGINATION - "PAGE 02 / FIELD LOG" (the 4 newest units) ────
// These ids live on PAGE TWO; everything else lives on PAGE ONE.
const NEW_PROJECT_IDS = ['f1-strategy', 'sepsis-forecasting', 'ev-forecasting', 'cifr-quant'] as const

// Resting tilt each card settles to on a page (deterministic, SSR-safe).
const REST_ROTS = [-3.0, 2.4, -1.8, 2.9, -2.2, 1.6, -1.2, 2.8, -2.6, 1.1]
// Big initial tilt while a card is still FALLING IN (settles to REST_ROTS).
const FALL_IN_ROTS = [-14, 12, -11, 13, -10, 9, -13, 11, -12, 10]
// Big tilt a card rotates toward as it FALLS OFF (drops down and away).
const FALL_OFF_ROTS = [16, -18, 14, -15, 17, -13, 15, -16, 18, -14]

// ─── CAN-HOVER DETECTION (guards whileHover on touch) ───────────
const canHover =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover)').matches

// ─── GLOBAL ANALOG GRAIN - fixed, pointer-events:none ───────────
// Subtle mechanical noise unifying the whole surface. Does NOT scroll.
function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        pointerEvents: 'none',
        opacity: 0.05,
        mixBlendMode: 'multiply',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

// ─── CROSSHAIR - grid intersection marker (industrial) ──────────
function Crosshair({
  size = 12,
  color = C.black,
  className = '',
}: { size?: number; color?: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      className={className}
      style={{ display: 'block' }}
    >
      <path d="M6 0V12M0 6H12" stroke={color} strokeWidth="1" />
    </svg>
  )
}

// ─── TECHNICAL FRAME - [ LABEL ] telemetry tag ──────────────────
function FrameTag({
  children,
  color = C.black,
}: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${spaceMono.className}`}
      style={{ color }}
    >
      <span style={{ opacity: 0.5 }}>[</span>
      {children}
      <span style={{ opacity: 0.5 }}>]</span>
    </span>
  )
}

// ─── TAPE CORNER (decorative, monochrome) ───────────────────────
function Tape({ angle = 0, color = 'rgba(255,255,255,0.7)' }: { angle?: number; color?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: -10,
        left: '50%',
        transform: `translateX(-50%) rotate(${angle}deg)`,
        width: 48,
        height: 18,
        background: color,
        border: '1px solid rgba(0,0,0,0.18)',
        zIndex: 10,
      }}
    />
  )
}

// ─── DEVTOOLS EASTER EGG (single accent, no emoji) ──────────────
function DevtoolsEgg() {
  useEffect(() => {
    console.log(
      '%c>>> OH HEY. YOU OPENED DEVTOOLS.',
      'font-size:18px; font-weight:bold; color:#ff5d2e; font-family:monospace; letter-spacing:0.1em',
    )
    console.log(
      '%cI\'m Sounic. I build models I can actually explain.\nMostly PyTorch, NLP, and too much PySpark.\nHiring for AI/ML internships starting Sep 2026? Let\'s talk.\n>>> imsounic.dev@gmail.com',
      'font-size:13px; color:#0a0a0a; font-family:monospace; line-height:1.7',
    )
    console.log(
      '%c[ REV 2.0 · UNIT / D-01 · the blueprint aesthetic was deliberate ]',
      'font-size:11px; color:#888; font-family:monospace; font-style:italic',
    )
  }, [])
  return null
}

// ─── SCROLL HELPER ───────────────────────────────────────────────
const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ─── NAVBAR ──────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const reduced         = useReducedMotion()

  const go = (id: string) => { setOpen(false); setTimeout(() => scrollTo(id), 10) }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${syne.className}`}
        style={{
          background: C.paper,
          borderBottom: `3px solid ${C.black}`,
          boxShadow: '0 4px 0 rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-between px-6 h-14">
          <button
            onClick={() => go('home')}
            className="flex items-center gap-2 font-black text-xl uppercase tracking-tight text-black hover:text-[#ff5d2e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0]"
          >
            SA<span style={{ color: C.orange }}>.</span>
            <span className={`text-[9px] font-bold tracking-[0.18em] text-black/45 ${spaceMono.className}`}>
              D-01
            </span>
          </button>

          {/* Desktop nav - mr-[148px] keeps top-right theme switcher clear */}
          <div className="hidden md:flex items-center gap-0 mr-[148px]">
            {navSections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={`font-bold text-xs uppercase tracking-widest px-4 py-2 text-black hover:text-[#ff5d2e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0] ${spaceMono.className}`}
              >
                <span className="text-black/35">{String(i).padStart(2, '0')}</span>{' '}
                {s.label}
              </button>
            ))}
          </div>

          {/* 44px touch target */}
          <button
            className="md:hidden border-[2px] border-black w-11 h-11 flex items-center justify-center font-black text-lg hover:bg-black hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? '×' : '≡'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className={`fixed top-14 left-0 right-0 z-40 border-b-[2px] border-black flex flex-col ${spaceMono.className}`}
            style={{ background: C.paper }}
          >
            {navSections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="font-bold text-sm uppercase tracking-widest px-6 py-4 border-b-[1px] border-black/15 text-left hover:text-[#ff5d2e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0]"
              >
                <span className="text-black/35">{String(i).padStart(2, '0')}</span>{' '}
                {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── MARQUEE TICKER (single accent, >>> separators) ─────────────
function Marquee() {
  const reduced = useReducedMotion()
  const items = [...hotTakes, ...hotTakes]

  const Row = ({ list }: { list: string[] }) => (
    <>
      {list.map((take, i) => (
        <span
          key={i}
          className={`flex items-center gap-4 text-xs font-bold uppercase tracking-widest shrink-0 ${spaceMono.className}`}
          style={{ color: C.paper }}
        >
          <span style={{ color: C.orange }} aria-hidden>{'>>>'}</span>
          {take}
        </span>
      ))}
    </>
  )

  // Static non-animated row when reduced motion is preferred
  if (reduced) {
    return (
      <div
        className="overflow-x-auto border-y-[2px] border-black py-3"
        style={{ background: C.ink }}
        aria-label="Hot takes"
      >
        <div className="flex gap-12 whitespace-nowrap px-4">
          <Row list={hotTakes} />
        </div>
      </div>
    )
  }

  return (
    <div
      className="overflow-hidden border-y-[2px] border-black py-3 relative"
      style={{ background: C.ink }}
      aria-label="Hot takes ticker"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 38, ease: 'linear' }}
      >
        <Row list={items} />
      </motion.div>
    </div>
  )
}

// ─── HOME / HERO ─────────────────────────────────────────────────
function HomeSection() {
  const reduced                    = useReducedMotion()
  const nameControls               = useAnimation()
  const dragConstraintsRef         = useRef<HTMLDivElement>(null)
  const [nameClicks, setNameClicks] = useState(0)

  const handleNameClick = useCallback(async () => {
    if (reduced) return
    setNameClicks((n) => n + 1)
    await nameControls.start({
      rotate: [0, -8, 12, -6, 8, -4, 0],
      scale:  [1, 1.06, 0.97, 1.04, 0.99, 1],
      transition: { duration: 0.6, ease: EASE_OUT },
    })
  }, [reduced, nameControls])

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
          className={`absolute right-2 top-0 leading-[0.8] pointer-events-none ${syne.className}`}
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

        <motion.div
          animate={nameControls}
          onClick={handleNameClick}
          drag={!reduced}
          dragConstraints={dragConstraintsRef}
          dragMomentum={false}
          style={{ display: 'inline-block', cursor: 'grab', rotate: 0 }}
          whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
          className="relative z-10"
          title="Drag / click"
          aria-label="Sounic Akkaraju, click to fling"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNameClick() }}
        >
          <h1
            className={`font-black uppercase leading-[0.82] ${syne.className}`}
            style={{
              fontSize: 'clamp(36px, 11vw, 220px)',
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
          {nameClicks > 0 && (
            <div
              className={`absolute -top-3 -right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-[1px] border-black ${spaceMono.className}`}
              style={{ background: C.orange, color: C.white, rotate: '6deg' }}
            >
              FLUNG ×{nameClicks}
            </div>
          )}
        </motion.div>

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
            className={`border-[2px] border-black px-3 py-1.5 font-black text-xs uppercase tracking-widest ${syne.className}`}
            style={{ background: C.orange, color: C.white, boxShadow: '3px 3px 0 #000' }}
          >
            <span
              className={`flex items-center gap-1.5 text-[10px] mb-0.5 ${spaceMono.className}`}
            >
              <span aria-hidden style={{ display: 'inline-block', width: 6, height: 6, background: C.white }} />
              AVAILABLE
              <span aria-hidden style={{ display: 'inline-block', width: 6, height: 6, background: C.white }} />
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
          className={`border-[2px] border-black px-4 py-3 font-black text-xs uppercase tracking-widest text-center max-w-[180px] ${syne.className}`}
          style={{ background: C.orange, color: C.white, boxShadow: '5px 5px 0 #000' }}
        >
          <div className={`flex items-center justify-center gap-1.5 text-[10px] mb-1 ${spaceMono.className}`}>
            <span aria-hidden style={{ display: 'inline-block', width: 7, height: 7, background: C.white }} />
            AVAILABLE
            <span aria-hidden style={{ display: 'inline-block', width: 7, height: 7, background: C.white }} />
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
          <FrameTag color={C.orange}>BRIEF</FrameTag>
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
            className={`inline-flex items-center gap-2 border-[2px] border-black px-4 py-2 font-black text-xs uppercase tracking-widest transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:-translate-x-px active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0] ${spaceMono.className}`}
            style={{ background: bg, color: fg, boxShadow: '4px 4px 0 #000' }}
          >
            {icon} {label}
          </a>
        ))}

        <button
          onClick={() => scrollTo('contact')}
          className={`inline-flex items-center gap-2 border-[2px] border-black px-4 py-2 font-black text-xs uppercase tracking-widest transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:-translate-x-px active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0] ${spaceMono.className}`}
          style={{ background: C.orange, color: C.white, boxShadow: '4px 4px 0 #000' }}
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

// ─── MANIFESTO ───────────────────────────────────────────────────
function ManifestoSection() {
  const reduced = useReducedMotion()

  return (
    <section
      className="py-12 sm:py-20 px-4 sm:px-6 overflow-x-hidden"
      style={{ background: C.ink }}
    >
      {/* Section label - technical frame */}
      <div className="max-w-5xl mx-auto mb-4 flex items-center gap-3 flex-wrap">
        <FrameTag color={C.orange}>SECTION / MANIFESTO</FrameTag>
        <div className="flex-1 h-px min-w-[16px]" style={{ background: 'rgba(255,93,46,0.4)' }} />
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 shrink-0 ${spaceMono.className}`}>
          REV 2.0
        </span>
      </div>

      <div className="max-w-5xl mx-auto mb-10">
        <h2
          className={`font-black uppercase leading-[0.85] ${syne.className}`}
          style={{ fontSize: 'clamp(48px, 9vw, 110px)', color: C.orange, letterSpacing: '-0.05em' }}
        >
          MANIFESTO
        </h2>
      </div>

      {/* Manifesto intro - big pull quote */}
      <div className="max-w-5xl mx-auto mb-16">
        <blockquote
          className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight ${syne.className}`}
          style={{ color: C.paper }}
        >
          <span style={{ color: C.orange, fontSize: '4rem', lineHeight: 0.5, verticalAlign: 'middle' }}>&ldquo;</span>
          {manifesto}
          <span style={{ color: C.orange }}>&#8221;</span>
        </blockquote>
      </div>

      {/* Tenets - modular grid, hairline dividers (gap:1px on accent) */}
      <div
        className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3"
        style={{ gap: 1, background: C.orange, border: `1px solid ${C.orange}` }}
      >
        {hotTakes.map((take, i) => (
          <motion.div
            key={i}
            className="relative"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: EASE_OUT }}
            whileHover={reduced || !canHover ? undefined : { y: -3 }}
          >
            <div
              className={`h-full p-6 ${syne.className}`}
              style={{ background: i % 2 === 0 ? C.paper : C.white }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <div
                  className="font-black text-4xl leading-none"
                  style={{ color: C.orange }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-[0.16em] text-black/35 ${spaceMono.className}`}>
                  T-{String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <p className={`text-sm font-bold leading-relaxed ${spaceMono.className}`} style={{ color: C.ink }}>
                {take}
              </p>
            </div>
          </motion.div>
        ))}
        {/* fill final cell to complete the grid module */}
        {hotTakes.length % 3 === 2 && (
          <div
            className="relative hidden lg:flex items-center justify-center"
            style={{ background: C.ink }}
            aria-hidden="true"
          >
            <Crosshair size={20} color="rgba(255,93,46,0.5)" />
          </div>
        )}
      </div>
    </section>
  )
}

// ─── SECTION HEADER (shared structural macro-header) ────────────
function SectionHeader({
  index,
  title,
  tag,
  onDark = false,
}: { index: string; title: string; tag: string; onDark?: boolean }) {
  const ink = onDark ? C.paper : C.ink
  const sub = onDark ? 'rgba(244,244,240,0.4)' : 'rgba(10,10,10,0.4)'
  const rule = onDark ? 'rgba(255,93,46,0.4)' : C.black
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <FrameTag color={C.orange}>{tag}</FrameTag>
        <div className="flex-1 h-px min-w-[16px]" style={{ background: rule }} />
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] shrink-0 ${spaceMono.className}`} style={{ color: sub }}>
          UNIT / {index}
        </span>
      </div>
      <h2
        className={`font-black uppercase leading-[0.85] ${syne.className}`}
        style={{ fontSize: 'clamp(40px, 10vw, 120px)', color: ink, letterSpacing: '-0.05em' }}
      >
        {title}
      </h2>
    </div>
  )
}

// ─── SKILLS ──────────────────────────────────────────────────────
function SkillsSection() {
  const reduced = useReducedMotion()

  return (
    <section
      id="skills"
      className="py-12 sm:py-20 px-4 sm:px-6 overflow-x-hidden"
      style={{ background: C.paper }}
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeader index="D-03" title="SKILLS" tag="SECTION / STACK" />

        {/* Skills grid - modular hairline grid (gap:1px on black) */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 1, background: C.black, border: `1px solid ${C.black}` }}
        >
          {skills.map((group, gi) => (
            <motion.div
              key={group.category}
              className="relative"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (gi % 3) * 0.06, ease: EASE_OUT }}
            >
              <div
                className={`h-full p-5 ${syne.className}`}
                style={{ background: C.white }}
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b-[1px] border-black">
                  <div
                    className={`text-[10px] font-black uppercase tracking-[0.16em] ${spaceMono.className}`}
                    style={{ color: C.ink }}
                  >
                    {group.category}
                  </div>
                  <span className={`text-[9px] font-bold tracking-[0.16em] text-black/35 ${spaceMono.className}`}>
                    {String(gi + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className={`border-[1px] border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${spaceMono.className}`}
                      style={{ background: C.paper, color: C.ink }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROJECT PINBOARD ────────────────────────────────────────────
// Status uses ink/orange/paper only - secondary blue removed.
const STATUS_MAP: Record<string, { label: string; bg: string; fg: string }> = {
  live:          { label: 'LIVE',        bg: C.orange, fg: C.white },
  'in-progress': { label: 'IN PROGRESS', bg: C.ink,    fg: C.white },
  research:      { label: 'RESEARCH',    bg: C.white,  fg: C.ink   },
}

// Shared fall variants: card FALLS IN from above, STICKS at a small
// resting angle (spring overshoot), then FALLS OFF downward on exit.
// Per-variant transitions are embedded so enter springs and exit drops.
// Reduced motion: no fall, just a quick opacity crossfade in place.
function fallVariants(reduced: boolean, index: number, row: number, restRot: number, fallInRot: number, fallOffRot: number) {
  if (reduced) {
    return {
      initial: { opacity: 0, rotate: restRot },
      animate: { opacity: 1, rotate: restRot, transition: { duration: 0.16, ease: EASE_OUT } },
      exit:    { opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } },
    }
  }
  // Offset the start by the card's grid row so EVERY row begins falling from
  // the same height above the grid (lower rows fall a longer distance).
  const ROW_STEP = 330
  return {
    initial: { y: -(300 + row * ROW_STEP), rotate: fallInRot, opacity: 0 },
    animate: {
      y: 0,
      rotate: restRot,
      opacity: 1,
      transition: {
        // Clean tween (no spring wobble) with a gentle 'land and settle' overshoot.
        type: 'tween' as const,
        duration: 0.55,
        ease: [0.34, 1.3, 0.5, 1] as const,
        opacity: { duration: 0.22, ease: 'easeOut' as const },
        delay: index * 0.06, // staggered drop, one card after another
      },
    },
    exit: {
      // FALL OFF: accelerate downward like gravity, with a tilt, staggered.
      y: 560,
      rotate: fallOffRot,
      opacity: 0,
      transition: {
        type: 'tween' as const,
        duration: 0.4,
        ease: [0.42, 0, 0.9, 1] as const,
        opacity: { duration: 0.32, ease: 'linear' as const },
        delay: index * 0.045,
      },
    },
  }
}

function PinCard({
  project,
  index,
  row,
  restRot,
  fallInRot,
  fallOffRot,
  onOpen,
}: {
  project: (typeof projects)[number]
  index: number
  row: number
  restRot: number
  fallInRot: number
  fallOffRot: number
  onOpen: (triggerEl: HTMLElement) => void
}) {
  const reduced   = useReducedMotion()
  const articleRef = useRef<HTMLElement>(null)
  const status = project.status ? STATUS_MAP[project.status] : null
  const v = fallVariants(reduced ?? false, index, row, restRot, fallInRot, fallOffRot)

  const handleOpen = () => {
    onOpen(articleRef.current as HTMLElement)
  }

  return (
    <motion.article
      ref={articleRef}
      className="relative select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eae8e3]"
      variants={v}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={reduced || !canHover ? undefined : { rotate: 0, scale: 1.03, zIndex: 10 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen() } }}
    >
      {/* Tape pin at top - monochrome / accent only */}
      <Tape
        angle={restRot * 0.6}
        color={project.featured ? 'rgba(255,93,46,0.55)' : 'rgba(255,255,255,0.7)'}
      />

      <div
        className={`border-[2px] border-black bg-white p-5 flex flex-col gap-3 ${syne.className}`}
        style={{
          boxShadow: `${project.featured ? C.orange : C.black} ${project.featured ? 7 : 6}px ${project.featured ? 7 : 6}px 0`,
        }}
      >
        {/* Unit code + status - telemetry header row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[9px] font-bold uppercase tracking-[0.16em] text-black/40 ${spaceMono.className}`}>
            PRJ / {String(index + 1).padStart(2, '0')}
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

        {/* Expand cue - industrial markers, no emoji */}
        <div className="flex items-center justify-between pt-2 border-t-[1px] border-black/15">
          <span
            className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${spaceMono.className}`}
            style={{ color: C.orange }}
          >
            <span aria-hidden>{'>>>'}</span> EXPAND UNIT
          </span>
          <Crosshair size={12} color={C.ink} />
        </div>
      </div>
    </motion.article>
  )
}

// ─── PROJECT MODAL (the card, expanded) ──────────────────────────
function ProjectModal({
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
        className={`relative w-full max-w-2xl max-h-[88vh] overflow-y-auto border-[2px] border-black bg-white ${syne.className}`}
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

        {/* Close button - receives focus on open */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2.5 right-3 z-20 border-[2px] border-black w-9 h-9 flex items-center justify-center font-black text-xl bg-white hover:bg-black hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          ×
        </button>

        {/* Image banner */}
        <div className="relative w-full h-48 sm:h-64 border-b-[2px] border-black" style={{ background: C.paper2 }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
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
              <FrameTag color={C.orange}>HIGHLIGHTS</FrameTag>
              <ul className="flex flex-col gap-2 mt-3">
                {project.highlights.map((h) => (
                  <li key={h} className={`flex gap-2 text-sm font-bold leading-snug text-black ${spaceMono.className}`}>
                    <span className="font-black shrink-0" style={{ color: C.orange }} aria-hidden>{'>'}</span>
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
                  className={`inline-flex items-center gap-2 border-[2px] border-black px-4 py-2 text-xs font-black uppercase tracking-widest transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:-translate-x-px active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${spaceMono.className}`}
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
                  className={`inline-flex items-center gap-2 border-[2px] border-black px-4 py-2 text-xs font-black uppercase tracking-widest transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:-translate-x-px active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${spaceMono.className}`}
                  style={{ background: C.orange, color: C.white, boxShadow: '4px 4px 0 #000' }}
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

// ─── FALLING STICKY NOTE (page two) ─────────────────────────────
// Text-only sticky note: FALLS IN from above and STICKS at a slight
// angle (spring overshoot), FALLS OFF downward on page flip, staggered.
// No image. Opens the existing project modal (keyboard-accessible).
function FallNoteCard({
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
      className="relative select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eae8e3]"
      variants={v}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={reduced || !canHover ? undefined : { rotate: 0, scale: 1.03, zIndex: 10 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen() } }}
    >
      {/* Tape strip = the pin holding the note to the wall */}
      <Tape
        angle={restRot * 0.6}
        color={project.featured ? 'rgba(255,93,46,0.55)' : 'rgba(255,255,255,0.7)'}
      />

      <div
        className={`border-[3px] border-black bg-white p-5 flex flex-col gap-3 ${syne.className}`}
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
            style={{ color: C.orange }}
          >
            <span aria-hidden>{'>>>'}</span> EXPAND UNIT
          </span>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-black hover:text-[#ff5d2e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${spaceMono.className}`}
              aria-label={`View source for ${project.title} on GitHub`}
            >
              <FiGithub size={11} aria-hidden="true" /> VIEW SOURCE
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

// ─── SIDE PAGE-FLIP CONTROL ─────────────────────────────────────
// Vertical button stuck to the right edge of the board. PAGE 01 shows a
// DOWN arrow + "PAGE 02 / MORE" (go forward); PAGE 02 shows an UP arrow
// + "PAGE 01 / BACK" (go back). Real button, ≥44px, keyboard activatable.
function PageNav({ page, onFlip }: { page: number; onFlip: () => void }) {
  const reduced = useReducedMotion()
  const forward = page === 0
  const label   = forward ? 'PAGE 02' : 'PAGE 01'
  const sub     = forward ? 'MORE' : 'BACK'
  const aria    = forward ? 'Go to page two of projects' : 'Back to page one of projects'

  return (
    <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 xl:translate-x-[26px] z-30 hidden md:flex justify-end">
        <motion.button
          type="button"
          onClick={onFlip}
          aria-label={aria}
          className={`pointer-events-auto flex flex-col items-center gap-2 border-[2px] border-black px-3 py-4 min-w-[44px] min-h-[44px] transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eae8e3] ${spaceMono.className}`}
          style={{ background: C.orange, color: C.white, boxShadow: '4px 4px 0 #000' }}
          whileHover={reduced || !canHover ? undefined : { x: -2, y: -2 }}
          whileTap={reduced ? undefined : { x: 0, y: 0 }}
        >
          {/* page indicator 01 / 02 */}
          <span className="text-[9px] font-bold tracking-[0.16em]" aria-hidden="true">
            {String(page + 1).padStart(2, '0')} / 02
          </span>
          <span aria-hidden="true" style={{ height: 1, width: 18, background: 'currentColor', opacity: 0.5 }} />
          {/* up arrow on page two, down arrow on page one */}
          <span aria-hidden="true" className="text-lg font-black leading-none">
            {forward ? '↓' : '↑'}
          </span>
          {/* vertical label, brutalist telemetry */}
          <span
            className="text-[10px] font-black tracking-[0.2em] leading-tight"
            style={{ writingMode: 'vertical-rl' }}
          >
            {label}
          </span>
          <span className="text-[8px] font-bold tracking-[0.18em] leading-none opacity-80">
            {sub}
          </span>
        </motion.button>
    </div>
  )
}

// ─── ANIMATED BOARD HEADER (swaps with the page) ────────────────
// PAGE 01: Syne "PROJECTS" + "PINBOARD" telemetry tag.
// PAGE 02: heading clips to "PAGE TWO" + the orange "FRESH DROPS" box.
function BoardHeader({ page, total, startIndex }: { page: number; total: number; startIndex: number }) {
  const reduced = useReducedMotion()
  const heading = page === 0 ? 'PROJECTS' : 'PAGE TWO'
  const tagText = page === 0 ? 'PINBOARD' : 'FIELD LOG / VOL. II'
  // Index reads 01 / 06 on page one, 07 / 10 on page two.
  const idxFrom = page === 0 ? 1 : startIndex + 1
  const idxTo   = page === 0 ? startIndex : total

  const swap = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { y: 28, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        animate: { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)' },
        exit:    { y: -28, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        transition: { duration: 0.4, ease: EASE_OUT },
      }

  return (
    <div className="mb-12">
      {/* Telemetry tag row + hairline rule + index (preserved framing) */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`tag-${page}`}
              initial={swap.initial}
              animate={swap.animate}
              exit={swap.exit}
              transition={swap.transition}
            >
              <FrameTag color={C.orange}>{`SECTION / ${tagText}`}</FrameTag>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex-1 h-px min-w-[16px]" style={{ background: C.black }} />
        <span
          className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] shrink-0 ${spaceMono.className}`}
          style={{ color: 'rgba(10,10,10,0.45)' }}
        >
          <Crosshair size={9} color={C.orange} />
          {String(idxFrom).padStart(2, '0')} / {String(idxTo).padStart(2, '0')}
        </span>
      </div>

      {/* Big swapping heading */}
      <div className="flex items-end gap-4">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={`head-${page}`}
              className={`font-black uppercase leading-[0.85] ${syne.className}`}
              style={{ fontSize: 'clamp(48px, 10vw, 120px)', color: C.ink, letterSpacing: '-0.05em' }}
              initial={swap.initial}
              animate={swap.animate}
              exit={swap.exit}
              transition={swap.transition}
            >
              {heading}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      {/* FRESH DROPS row: ALWAYS reserved at a fixed height so the header is the
          same height on both pages (the box only renders on page two). This is
          what keeps the section from getting taller on the flip. */}
      <div className="mt-4 h-8">
        <AnimatePresence mode="wait" initial={false}>
          {page === 1 && (
            <motion.span
              key="fresh-drops"
              className={`inline-flex items-center gap-2 border-[2px] border-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${spaceMono.className}`}
              style={{ background: C.orange, color: C.white, boxShadow: '3px 3px 0 #000', rotate: '-2deg' }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <span aria-hidden>{'>>>'}</span> FRESH DROPS
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function WorkSection() {
  const [openId, setOpenId]       = useState<string | null>(null)
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null)
  const [page, setPage]           = useState(0) // 0 = originals, 1 = newest
  const openProject = projects.find((p) => p.id === openId) ?? null

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

  const handleOpen = (id: string, el: HTMLElement) => {
    setTriggerEl(el)
    setOpenId(id)
  }

  const handleClose = () => {
    setOpenId(null)
  }

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
            style={{ background: C.orange, color: C.white, boxShadow: '3px 3px 0 #000' }}
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
            className={`inline-flex items-center gap-3 border-[2px] border-black px-5 py-3 min-h-[44px] text-xs font-black uppercase tracking-widest transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eae8e3] ${spaceMono.className}`}
            style={{ background: C.orange, color: C.white, boxShadow: '4px 4px 0 #000' }}
          >
            {page === 0 ? 'VIEW PAGE 02' : 'BACK TO PAGE 01'}
            <span aria-hidden="true" className="text-base font-black leading-none">{page === 0 ? '↓' : '↑'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {openProject && (
          <ProjectModal
            key={openProject.id}
            project={openProject}
            onClose={handleClose}
            triggerEl={triggerEl}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── ABOUT / ZINE CLIPPINGS ──────────────────────────────────────
function AboutSection() {
  const reduced = useReducedMotion()
  const [stickerCount, setStickerCount] = useState(0)
  const dragRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="about"
      className="py-12 sm:py-20 px-4 sm:px-6 overflow-x-hidden"
      style={{ background: C.white }}
      ref={dragRef}
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeader index="D-02" title="ABOUT" tag="SECTION / OPERATOR FILE" />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Summary clipping */}
          <motion.div
            className="relative"
            style={{ rotate: -1.2 }}
            whileHover={reduced || !canHover ? undefined : { rotate: 0 }}
            transition={SPRING}
          >
            <Tape angle={2} />
            <div
              className={`border-[2px] border-black p-7 ${syne.className}`}
              style={{ background: C.paper, boxShadow: '7px 7px 0 #000' }}
            >
              <FrameTag color={C.orange}>WHO I AM</FrameTag>
              <p className={`mt-3 text-sm font-bold leading-relaxed ${spaceMono.className}`} style={{ color: C.ink }}>
                {profile.summary}
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            {/* Education clipping - orange accent (was blue) */}
            <motion.div
              className="relative"
              style={{ rotate: 1.4 }}
              whileHover={reduced || !canHover ? undefined : { rotate: 0 }}
              transition={SPRING}
            >
              <Tape angle={-4} color="rgba(255,93,46,0.3)" />
              <div
                className={`border-[2px] border-black p-6 ${syne.className}`}
                style={{ background: C.white, boxShadow: `6px 6px 0 ${C.orange}` }}
              >
                <FrameTag color={C.orange}>EDUCATION</FrameTag>
                <div className="flex flex-col gap-4 mt-4">
                  {education.map((ed, i) => (
                    <div
                      key={ed.degree}
                      className={i < education.length - 1 ? 'pb-4 border-b-[1px] border-black/15' : ''}
                    >
                      <div className={`font-black text-sm leading-snug text-black ${syne.className}`}>
                        {ed.degree}
                      </div>
                      <div className={`text-xs font-bold text-black/55 mt-0.5 ${spaceMono.className}`}>
                        {ed.school}
                      </div>
                      <div
                        className={`inline-block mt-1.5 border-[1px] border-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${spaceMono.className}`}
                      >
                        {ed.period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Languages */}
            <div
              className={`border-[2px] border-black p-5 ${syne.className}`}
              style={{ background: C.paper, boxShadow: '5px 5px 0 #000', rotate: '-0.8deg' }}
            >
              <FrameTag color="rgba(10,10,10,0.55)">LANGUAGES</FrameTag>
              <div className="flex flex-wrap gap-2 mt-3">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className={`border-[1px] border-black px-3 py-1 ${spaceMono.className}`}
                    style={{
                      background: lang.level === 'Native' ? C.orange : C.white,
                      color: lang.level === 'Native' ? C.white : C.ink,
                    }}
                  >
                    <span className="font-black text-xs uppercase tracking-wide">{lang.name}</span>
                    <span className="ml-2 text-xs opacity-70 font-bold">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Creative + Gaming - single accent, no blue */}
        <div className="mt-16 grid sm:grid-cols-2 gap-8">
          {[
            { data: creative, rot: -2.2, code: 'C-01' },
            { data: gaming,   rot:  1.9, code: 'C-02' },
          ].map(({ data, rot, code }) => (
            <motion.div
              key={data.title}
              className="relative"
              style={{ rotate: rot }}
              whileHover={reduced || !canHover ? undefined : { rotate: 0, scale: 1.01 }}
              transition={SPRING}
            >
              <Tape angle={rot * 1.5} color="rgba(255,93,46,0.28)" />
              <div
                className={`border-[2px] border-black p-7 h-full ${syne.className}`}
                style={{ background: C.paper, boxShadow: `7px 7px 0 ${C.orange}` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="font-black text-lg uppercase leading-tight"
                    style={{ color: C.orange }}
                  >
                    {data.title}
                  </div>
                  <span className={`text-[9px] font-bold tracking-[0.16em] text-black/35 shrink-0 ml-3 ${spaceMono.className}`}>
                    {code}
                  </span>
                </div>
                <p className={`text-sm font-bold leading-relaxed ${spaceMono.className}`} style={{ color: C.ink }}>
                  {data.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Easter egg: draggable sticker with click counter - no emoji */}
        <motion.button
          drag={!reduced}
          dragConstraints={dragRef}
          dragMomentum={false}
          onClick={() => setStickerCount((n) => n + 1)}
          className={`mt-10 inline-flex items-center gap-2 border-[2px] border-black px-5 py-3 font-black text-xs uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${spaceMono.className}`}
          style={{
            background: stickerCount > 0 ? C.orange : C.white,
            color: stickerCount > 0 ? C.white : C.ink,
            boxShadow: '5px 5px 0 #000',
            rotate: 3,
            cursor: reduced ? 'pointer' : 'grab',
          }}
          whileDrag={{ cursor: 'grabbing' }}
          title="Drag me around"
          aria-label="Interactive sticker, drag or click"
        >
          <span aria-hidden>{'>>>'}</span>
          {stickerCount === 0
            ? 'DRAG ME · CLICK ME'
            : `LOGGED ${stickerCount} INPUT${stickerCount !== 1 ? 'S' : ''}`}
        </motion.button>
      </div>
    </section>
  )
}

// ─── CONTACT ─────────────────────────────────────────────────────
function ContactSection() {
  const reduced = useReducedMotion()

  // Single accent: orange or ink only. No blue.
  const links = [
    { icon: FiMail,     label: 'Email',    href: socials.email,    detail: 'imsounic.dev@gmail.com', bg: C.orange, fg: C.white },
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
            <div className="flex-1 h-px min-w-[16px]" style={{ background: 'rgba(255,93,46,0.4)' }} />
            <span className={`text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 shrink-0 ${spaceMono.className}`}>
              UNIT / D-05
            </span>
          </div>
          <h2
            className={`font-black uppercase leading-[0.85] ${syne.className}`}
            style={{
              fontSize: 'clamp(48px, 12vw, 160px)',
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
          className={`text-2xl sm:text-3xl font-black uppercase text-white mb-12 leading-tight ${syne.className}`}
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
              className={`flex items-center gap-4 p-5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-inset ${syne.className}`}
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

// ─── FOOTER ──────────────────────────────────────────────────────
function Footer() {
  const footerLinks = [
    { href: socials.github,   icon: FiGithub,   label: 'GitHub'   },
    { href: socials.linkedin, icon: FiLinkedin, label: 'LinkedIn' },
    { href: socials.email,    icon: FiMail,     label: 'Email'    },
    { href: socials.resume,   icon: FiFileText, label: 'Resume'   },
  ]

  return (
    <footer
      className={`border-t-[2px] border-[#ff5d2e] px-4 sm:px-6 py-8 sm:py-10 ${syne.className}`}
      style={{ background: C.ink }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className={`flex items-center gap-2 mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 ${spaceMono.className}`}>
            <Crosshair size={9} color={C.orange} />
            REV 2.0 · UNIT / D-01 · DECLASSIFIED
          </div>
          <div className="font-black text-sm uppercase tracking-widest text-white">
            {profile.name}{' '}
            <span style={{ color: C.orange }}>·</span>{' '}
            <span className="font-bold text-white/70">{profile.role}</span>
          </div>
          <p
            className={`mt-2 text-xs font-bold text-white/70 max-w-xs sm:max-w-sm leading-relaxed ${spaceMono.className}`}
          >
            {colophon}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {footerLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') || href.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className="border-[1px] border-white/25 p-2 text-white/55 hover:border-[#ff5d2e] hover:text-[#ff5d2e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────
export default function BrutalistTheme() {
  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${syne.variable} ${spaceMono.variable}`}
      style={{ background: C.paper, color: C.ink }}
    >
      <GrainOverlay />
      <DevtoolsEgg />
      <Navbar />

      <main>
        {/* section id="home" is inside HomeSection */}
        <HomeSection />

        {/* ManifestoSection: no id - follows the home section */}
        <ManifestoSection />

        <SkillsSection />
        <WorkSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}
