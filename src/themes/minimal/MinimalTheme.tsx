'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  PiGithubLogo,
  PiLinkedinLogo,
  PiEnvelopeSimple,
  PiFileText,
  PiArrowUpRight,
  PiArrowRight,
  PiList,
  PiX,
} from 'react-icons/pi'
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
import { instrumentSerif, spaceGrotesk } from '@/themes/fonts'
import './minimal.css'

// ─── Helpers ────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Set pending state BEFORE observing so content is hidden only when JS is
    // active and IntersectionObserver is about to run.
    el.setAttribute('data-reveal', 'pending')

    // Fallback: after 1200ms force-show even if IO never fires.
    const fallback = setTimeout(() => {
      setVisible(true)
    }, 1200)

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallback)
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)

    return () => {
      clearTimeout(fallback)
      obs.disconnect()
    }
  }, [threshold])

  return { ref, visible }
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`ed-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function StatusBadge({ status }: { status: string | undefined }) {
  if (!status) return null
  const cls = status === 'live' ? 'ed-status-live' : status === 'in-progress' ? 'ed-status-progress' : 'ed-status-research'
  const label = status === 'live' ? 'Live' : status === 'in-progress' ? 'In Progress' : 'Research'
  return <span className={`ed-project-status ${cls}`}>{label}</span>
}

// CSS-drawn barcode (decorative magazine furniture, fixed widths for stability)
function Barcode() {
  const bars = [3, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 3, 1, 1, 2, 1]
  return (
    <div className="ed-barcode" aria-hidden="true">
      <div className="ed-barcode-bars">
        {bars.map((w, i) => (
          <span key={i} style={{ width: `${w}px`, opacity: i % 2 === 0 ? 1 : 0 }} />
        ))}
      </div>
      <span className="ed-barcode-num">9&nbsp;772026&nbsp;000019</span>
    </div>
  )
}

// ─── Masthead ────────────────────────────────────────────────────────────────

function Masthead() {
  const [active, setActive] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const ids = navSections.map((s) => s.id)
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i])
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(ids[i]); break }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = useCallback((id: string) => {
    scrollTo(id)
    setMobileOpen(false)
  }, [])

  return (
    <>
      <header className="ed-masthead">
        <div className="ed-masthead-inner">
          {/* Left: publication name */}
          <div className="ed-masthead-left">
            <button className="ed-pub-title" onClick={() => handleNav('home')} aria-label="Go to top">
              SOUNIC
            </button>
            <span className="ed-issue-line hidden lg:block">Issue&nbsp;N&ordm;&nbsp;01&nbsp;·&nbsp;Summer&nbsp;2026</span>
          </div>

          {/* Center: location */}
          <div className="ed-masthead-center">
            <span className="ed-issue-line hidden xl:block">Enschede,&nbsp;Netherlands</span>
          </div>

          {/* Right: nav (leaves 150px for theme switcher) */}
          <nav className="ed-masthead-right hidden md:flex" aria-label="Main navigation">
            {navSections.map((s) => (
              <button
                key={s.id}
                className={`ed-nav-link ${active === s.id ? 'active' : ''}`}
                onClick={() => handleNav(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* Hamburger — 44×44 touch target via ed-hamburger class */}
          <button
            className="md:hidden ml-auto ed-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}
          >
            <PiList size={20} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="ed-mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="ed-hamburger"
              style={{ position: 'absolute', top: '0.5rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}
            >
              <PiX size={22} />
            </button>
            {navSections.map((s, i) => (
              <motion.button
                key={s.id}
                className="ed-mobile-menu-item"
                onClick={() => handleNav(s.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {s.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Cover / Home ────────────────────────────────────────────────────────────
//
// An art-directed magazine COVER. A massive masthead nameplate bleeds toward the
// edge, a treated (duotone/grayscale) portrait anchors the right, and cover
// furniture (issue line, barcode, price mark, coverlines) is scattered
// asymmetrically. Reads "independent magazine cover" at a glance.

function CoverSection() {
  const prefersReduced = useReducedMotion()

  // Coverlines — magazine teasers pulled from real content.
  const coverlines = [
    { kicker: 'The Interview', line: 'The case for models you can actually explain', to: 'about' },
    { kicker: 'Field Notes', line: '93.1% AUC, and why that is not the point', to: 'work' },
    { kicker: 'Selected Work', line: 'Six projects, from healthcare AI to 32GB of crypto', to: 'work' },
    { kicker: 'On the record', line: 'On craft, systems, and shipping the boring tool', to: 'about' },
  ]

  const fade = (delay: number) =>
    prefersReduced
      ? { initial: false as const, animate: { opacity: 1 } }
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }

  return (
    <section id="home" className="ed-cover">
      <div className="ed-cover-topstrip" />

      <div className="ed-cover-grid">
        {/* LEFT RAIL — vertical issue furniture */}
        <div className="ed-cover-rail">
          <motion.div className="ed-cover-rail-top" {...fade(0.15)}>
            <span className="ed-rail-issue">Issue N&ordm; 01</span>
            <span className="ed-rail-season">Summer 2026</span>
          </motion.div>
          <motion.div className="ed-cover-rail-mid" {...fade(0.9)}>
            <span className="ed-rail-vertical">The Sounic Quarterly · Independent</span>
          </motion.div>
          <motion.div className="ed-cover-rail-bottom" {...fade(1)}>
            <Barcode />
          </motion.div>
        </div>

        {/* CENTER — masthead nameplate + portrait */}
        <div className="ed-cover-stage">
          {/* Price / take-one mark */}
          <motion.div className="ed-cover-pricemark" {...fade(0.2)}>
            <span className="ed-pricemark-big">FREE</span>
            <span className="ed-pricemark-sub">Take one</span>
          </motion.div>

          {/* Massive masthead nameplate — bleeds toward the edges */}
          <h1 className="ed-masthead-plate" aria-label="Sounic Akkaraju">
            <motion.span className="ed-plate-line ed-plate-line-1" {...fade(0.24)}>
              SOUNIC
            </motion.span>
            <motion.span className="ed-plate-line ed-plate-line-2" {...fade(0.34)}>
              <span className="ed-plate-italic">Akkaraju</span>
            </motion.span>
          </h1>

          {/* Role strip under the plate */}
          <motion.p className="ed-cover-roleline" {...fade(0.5)}>
            AI / ML Engineer &amp; Full-Stack Builder
            <span className="ed-roleline-dot" aria-hidden="true">·</span>
            University of Twente
          </motion.p>
        </div>

        {/* RIGHT — coverlines stack */}
        <div className="ed-cover-lines">
          <motion.span className="ed-coverlines-head" {...fade(0.55)}>
            Inside this issue
          </motion.span>
          <ul className="ed-coverline-list">
            {coverlines.map((c, i) => (
              <motion.li key={c.line} {...fade(0.6 + i * 0.08)}>
                <button className="ed-coverline" onClick={() => scrollTo(c.to)}>
                  <span className="ed-coverline-kicker">{c.kicker}</span>
                  <span className="ed-coverline-text">{c.line}</span>
                </button>
              </motion.li>
            ))}
          </ul>

          <motion.div className="ed-cover-availability" {...fade(0.95)}>
            <span className="ed-availability-label">Available</span>
            <span className="ed-availability-value">{profile.availability}</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Pull Quote — full-bleed spread ──────────────────────────────────────────
//
// One hotTake (the interpretability one) set HUGE, edge to edge, as a dedicated
// quote page with dramatic scale and generous space.

function PullQuoteSpread({ text }: { text: string }) {
  return (
    <section className="ed-quote-spread" aria-label="Editorial pull quote">
      <Reveal>
        <span className="ed-quote-kicker">Editorial · On Interpretability</span>
      </Reveal>
      <Reveal delay={80}>
        <blockquote className="ed-quote-huge">
          <span className="ed-quote-mark" aria-hidden="true">&ldquo;</span>
          {text}
        </blockquote>
      </Reveal>
      <Reveal delay={160}>
        <div className="ed-quote-byline">
          <span className="ed-quote-byline-rule" aria-hidden="true" />
          Sounic Akkaraju, on what makes a model worth shipping
        </div>
      </Reveal>
    </section>
  )
}

// ─── About / Letter from the Editor ─────────────────────────────────────────
//
// A real article spread: big drop cap, multi-column body, a byline, and true
// marginalia (hotTakes as margin notes). Education + languages as a sidebar.

function AboutSection() {
  return (
    <section id="about" className="ed-about">
      <div className="ed-section">
        <Reveal>
          <div className="ed-section-rule">
            <span className="ed-section-label">Letter from the Editor</span>
            <span className="ed-section-num">N&ordm;&nbsp;01</span>
          </div>
        </Reveal>

        <div className="ed-article">
          {/* Main article body */}
          <div className="ed-article-main">
            <Reveal>
              <p className="ed-article-kicker">A note on the work</p>
              <h2 className="ed-article-headline">
                I build models I can<br />
                <em>actually explain.</em>
              </h2>
              <p className="ed-article-byline">
                By Sounic Akkaraju&ensp;·&ensp;Enschede&ensp;·&ensp;Summer 2026
              </p>
            </Reveal>

            <Reveal delay={80}>
              <div className="ed-article-columns">
                <p className="ed-body-text ed-dropcap">
                  {manifesto}
                </p>
                <p className="ed-body-text">
                  {profile.summary}
                </p>
              </div>
            </Reveal>

            {/* Craft + Systems columns */}
            <Reveal delay={140}>
              <div className="ed-columns-grid">
                <div className="ed-column">
                  <p className="ed-column-kicker">On Craft</p>
                  <h3 className="ed-column-headline">{creative.title}</h3>
                  <p className="ed-column-body">{creative.body}</p>
                </div>
                <div className="ed-column">
                  <p className="ed-column-kicker">On Systems</p>
                  <h3 className="ed-column-headline">{gaming.title}</h3>
                  <p className="ed-column-body">{gaming.body}</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sidebar: education, languages, marginalia */}
          <aside className="ed-article-aside">
            <Reveal delay={60}>
              <div className="ed-sidebar">
                <div className="ed-sidebar-heading">Education</div>
                {education.map((edu) => (
                  <div key={edu.school} className="ed-sidebar-item">
                    <div className="ed-sidebar-item-title">{edu.degree}</div>
                    <div className="ed-sidebar-item-sub">{edu.school}</div>
                    <div className="ed-sidebar-item-sub" style={{ color: 'var(--red)', marginTop: '0.2rem' }}>{edu.period}</div>
                    <div className="ed-sidebar-item-sub" style={{ marginTop: '0.35rem' }}>{edu.detail}</div>
                  </div>
                ))}

                <div className="ed-sidebar-heading" style={{ marginTop: '2rem' }}>Languages</div>
                <div className="ed-sidebar-langs">
                  {languages.map((lang) => (
                    <div key={lang.name} className="ed-lang-row">
                      <span className="ed-lang-name">{lang.name}</span>
                      <span className="ed-lang-dots" aria-hidden="true" />
                      <span className="ed-lang-level">{lang.level}</span>
                    </div>
                  ))}
                </div>

                {/* True marginalia — hotTakes as margin notes */}
                <div className="ed-margin-note ed-margin-note-red" style={{ marginTop: '2.25rem' }}>
                  {hotTakes[2]}
                </div>
                <div className="ed-margin-note" style={{ marginTop: '1.5rem' }}>
                  Currently learning Dutch. Firmly at the &ldquo;ik wil een koffie&rdquo; stage.
                </div>
                <div className="ed-margin-note" style={{ marginTop: '1.5rem' }}>
                  {hotTakes[4]}
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  )
}

// ─── Skills / Technical Apparatus ────────────────────────────────────────────
//
// A designed editorial spec index: oversized category labels as a typographic
// system, items set as a ruled running list. Not plain chips.

function SkillsSection() {
  return (
    <section id="skills" className="ed-skills">
      <div className="ed-section">
        <Reveal>
          <div className="ed-section-rule">
            <span className="ed-section-label">Technical Apparatus</span>
            <span className="ed-section-num">N&ordm;&nbsp;02</span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h2 className="ed-skills-headline">
            The full stack,&ensp;<em>annotated.</em>
          </h2>
        </Reveal>

        <div className="ed-spec-index">
          {skills.map((group, gi) => (
            <Reveal key={group.category} delay={100 + gi * 50}>
              <div className="ed-spec-row">
                <div className="ed-spec-num">{String(gi + 1).padStart(2, '0')}</div>
                <div className="ed-spec-cat">{group.category}</div>
                <div className="ed-spec-items">
                  {group.items.map((item, ii) => (
                    <span key={item} className="ed-spec-item">
                      {item}
                      {ii < group.items.length - 1 && <span className="ed-spec-sep" aria-hidden="true">/</span>}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="ed-spec-footnote">
            Fig.&nbsp;01. Technical vocabulary as of Summer 2026. Actively expanding.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Work / Selected Work, indexed ───────────────────────────────────────────
//
// A design-annual CONTENTS page. The left column is a compact, numbered,
// scannable INDEX of every feature (Fig. 01..10 / title / year / category).
// The right column is a sticky PREVIEW that shows the selected (or hovered)
// feature: image, period, standfirst, tags, highlights, and a Read/Source link.
// Changing selection cross-fades + clip-wipes the preview. Below 768px the
// preview pane is hidden and tapping a row expands its detail inline.

// Lightweight category taxonomy for the filter row. Each project maps to one
// primary lane; the index reflows (Framer Motion `layout`) when a lane is picked.
const projectCategory: Record<string, string> = {
  'miscarriage-prediction': 'ML',
  'lora-vs-bert': 'NLP',
  cleanslate: 'Apps',
  'crypto-microstructure': 'Data',
  'f1-strategy': 'Forecasting',
  'sepsis-forecasting': 'ML',
  'ev-forecasting': 'Forecasting',
  'cifr-quant': 'Quant',
  'medsam-vpt': 'ML',
  'house-of-games': 'Apps',
}

const projectFilters = ['All', 'ML', 'Forecasting', 'NLP', 'Apps', 'Quant', 'Data'] as const

// Pull a 4-digit year out of the period string for the index column.
function projectYear(period: string) {
  const matches = period.match(/\d{4}/g)
  if (!matches) return period
  const last = matches[matches.length - 1]
  return matches[0] === last ? matches[0] : `${matches[0]}-${last.slice(2)}`
}

type Project = (typeof projects)[number]

// The sticky preview pane (desktop). Cross-fades + clip-wipes between projects.
function WorkPreview({ project, fig }: { project: Project; fig: string }) {
  const prefersReduced = useReducedMotion()
  const wipe = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        animate: { opacity: 1, clipPath: 'inset(0 0 0% 0)' },
        exit: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      }
  const slide = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      }

  return (
    <div className="ed-index-preview-inner">
      <span className="ed-index-preview-fig" aria-hidden="true">Fig.&nbsp;{fig}</span>
      <div className="ed-index-preview-frame">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={`img-${project.id}`} className="ed-index-preview-imglayer" {...wipe}>
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={`body-${project.id}`} className="ed-index-preview-body" {...slide}>
          <div className="ed-feature-meta">
            <span className="ed-feature-period">{project.period}</span>
            <StatusBadge status={project.status} />
          </div>
          <h3 className="ed-index-preview-title">{project.title}</h3>
          <p className="ed-index-preview-sub">{project.subtitle}</p>
          <p className="ed-index-preview-standfirst">{project.blurb}</p>

          <div className="ed-feature-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="ed-project-tag">{tag}</span>
            ))}
          </div>

          <ul className="ed-feature-highlights ed-index-preview-highlights">
            {project.highlights.slice(0, 3).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <div className="ed-index-preview-actions">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="ed-text-link ed-feature-link">
                <PiGithubLogo size={11} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: '-1px' }} />
                Source
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="ed-text-link ed-feature-link">
                <PiArrowUpRight size={11} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: '-1px' }} />
                Read the feature
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Mobile accordion detail — smooth clip/height open, visible content only when open.
function WorkMobileDetail({ project }: { project: Project }) {
  return (
    <motion.div
      className="ed-index-mobile-detail"
      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0, height: 0 }}
      animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1, height: 'auto' }}
      exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0, height: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ed-index-mobile-detail-inner">
        <div className="ed-index-mobile-img">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
        </div>
        <p className="ed-index-preview-standfirst">{project.blurb}</p>
        <div className="ed-feature-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="ed-project-tag">{tag}</span>
          ))}
        </div>
        <ul className="ed-feature-highlights ed-index-preview-highlights">
          {project.highlights.slice(0, 3).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className="ed-index-preview-actions">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="ed-text-link ed-feature-link">
              <PiGithubLogo size={11} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: '-1px' }} />
              Source
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="ed-text-link ed-feature-link">
              <PiArrowUpRight size={11} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: '-1px' }} />
              Read the feature
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function WorkSection() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>('All')
  const [activeId, setActiveId] = useState<string>(projects[0].id)
  // Mobile: which row is expanded (independent of the desktop preview selection).
  const [openId, setOpenId] = useState<string | null>(null)
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([])

  const visible =
    filter === 'All' ? projects : projects.filter((p) => projectCategory[p.id] === filter)

  // Keep the desktop selection valid as the filtered list changes.
  useEffect(() => {
    if (!visible.some((p) => p.id === activeId) && visible.length > 0) {
      setActiveId(visible[0].id)
    }
  }, [filter, visible, activeId])

  const active = projects.find((p) => p.id === activeId) ?? projects[0]
  const activeFig = String(projects.findIndex((p) => p.id === active.id) + 1).padStart(2, '0')

  const handleFilter = useCallback((f: (typeof projectFilters)[number]) => {
    setFilter(f)
    setOpenId(null)
  }, [])

  // Arrow-key navigation of the index (desktop selection + roving focus).
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const next = e.key === 'ArrowDown' ? idx + 1 : idx - 1
        if (next >= 0 && next < visible.length) {
          setActiveId(visible[next].id)
          rowRefs.current[next]?.focus()
        }
      }
    },
    [visible]
  )

  return (
    <section id="work" className="ed-work">
      <div className="ed-section">
        <Reveal>
          <div className="ed-section-rule">
            <span className="ed-section-label">Selected Work, indexed</span>
            <span className="ed-section-num">N&ordm;&nbsp;03</span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h2 className="ed-work-headline">
            Ten features,&ensp;<em>indexed.</em>
          </h2>
          <p className="ed-work-sub">
            Healthcare AI, distributed data, forecasting, and the apps in between.
            Browse the contents; the preview updates as you go.
          </p>
        </Reveal>

        {/* Filter row */}
        <Reveal delay={90}>
          <div className="ed-index-filters" role="group" aria-label="Filter features by category">
            {projectFilters.map((f) => (
              <button
                key={f}
                type="button"
                className={`ed-index-filter ${filter === f ? 'active' : ''}`}
                aria-pressed={filter === f}
                onClick={() => handleFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Master-detail layout */}
        <div className="ed-index-layout">
          {/* INDEX — the contents column */}
          <Reveal delay={110} className="ed-index-col">
            <motion.ul
              className="ed-index-list"
              aria-label="Selected work"
              layout
            >
              <AnimatePresence initial={false}>
                {visible.map((project, i) => {
                  const fig = String(projects.findIndex((p) => p.id === project.id) + 1).padStart(2, '0')
                  const isActive = project.id === activeId
                  const isOpen = project.id === openId
                  return (
                    <motion.li
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className="ed-index-li"
                    >
                      <button
                        ref={(el) => { rowRefs.current[i] = el }}
                        type="button"
                        aria-current={isActive ? 'true' : undefined}
                        aria-expanded={isOpen}
                        className={`ed-index-row ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                        onMouseEnter={() => setActiveId(project.id)}
                        onFocus={() => setActiveId(project.id)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onClick={() => {
                          setActiveId(project.id)
                          setOpenId((prev) => (prev === project.id ? null : project.id))
                        }}
                      >
                        <span className="ed-index-fig" aria-hidden="true">Fig.&nbsp;{fig}</span>
                        <span className="ed-index-rowmain">
                          <span className="ed-index-rowtitle">{project.title}</span>
                          <span className="ed-index-rowmeta">
                            <span className="ed-index-cat">{projectCategory[project.id]}</span>
                            <span className="ed-index-year">{projectYear(project.period)}</span>
                          </span>
                        </span>
                        <span className="ed-index-rowrule" aria-hidden="true" />
                      </button>

                      {/* Mobile-only inline accordion */}
                      <AnimatePresence initial={false}>
                        {isOpen && <WorkMobileDetail project={project} />}
                      </AnimatePresence>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </motion.ul>
          </Reveal>

          {/* PREVIEW — sticky, desktop only */}
          <aside
            className="ed-index-preview"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Selected feature preview"
          >
            <WorkPreview project={active} fig={activeFig} />
          </aside>
        </div>

        {/* Closing pull quote before contact */}
        <Reveal delay={80}>
          <blockquote className="ed-work-quote">
            &ldquo;{hotTakes[3]}&rdquo;
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Contact — back cover / colophon ─────────────────────────────────────────

function ContactSection() {
  const contacts = [
    { href: socials.email,    icon: <PiEnvelopeSimple size={14} />,  label: 'Email',    value: 'imsounic.dev@gmail.com',   external: false },
    { href: socials.linkedin, icon: <PiLinkedinLogo size={14} />,    label: 'LinkedIn', value: 'linkedin.com/in/imsounic', external: true  },
    { href: socials.github,   icon: <PiGithubLogo size={14} />,      label: 'GitHub',   value: 'github.com/ImSounic',      external: true  },
    { href: socials.resume,   icon: <PiFileText size={14} />,        label: 'Resume',   value: 'Download PDF',             external: true  },
  ]

  return (
    <section id="contact" className="ed-contact">
      <div className="ed-section">
        <Reveal>
          <div className="ed-section-rule">
            <span className="ed-section-label">Write to the Editor</span>
            <span className="ed-section-num">N&ordm;&nbsp;04</span>
          </div>
        </Reveal>

        <div className="ed-contact-grid">
          <Reveal delay={60}>
            <div>
              <h2 className="ed-contact-headline">
                Write to the<br />
                <em>editor.</em>
              </h2>
              <p className="ed-contact-sub">
                Seeking SWE and AI/ML internship opportunities starting September&nbsp;2026.
                Open to research collaborations and interesting conversations.
              </p>
              <div className="ed-contact-currently">
                <p className="ed-contact-currently-label">Currently on the desk</p>
                <p className="ed-contact-currently-item">Building CleanSlate, a chore app my flatmates actually use</p>
                <p className="ed-contact-currently-item">Exploring mechanistic interpretability &amp; visual prompt tuning</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div>
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.external ? '_blank' : undefined}
                  rel={c.external ? 'noopener noreferrer' : undefined}
                  className="ed-contact-row"
                >
                  <span className="ed-contact-icon">{c.icon}</span>
                  <div>
                    <div className="ed-contact-label">{c.label}</div>
                    <div className="ed-contact-value">{c.value}</div>
                  </div>
                  <span className="ed-contact-arrow" aria-hidden="true"><PiArrowRight size={13} /></span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Colophon / Footer ───────────────────────────────────────────────────────

function Colophon() {
  return (
    <footer className="ed-colophon">
      <div>
        <div className="ed-colophon-title">Sounic</div>
        <div style={{ marginTop: '0.35rem' }}>
          <span className="ed-issue-line">Issue N&ordm;&nbsp;01&nbsp;·&nbsp;Summer&nbsp;2026&nbsp;·&nbsp;Enschede</span>
        </div>
      </div>

      <div>
        <p className="ed-colophon-text">{colophon}</p>
      </div>

      <nav className="ed-colophon-links" aria-label="Footer links">
        <a href={socials.github} target="_blank" rel="noopener noreferrer" className="ed-colophon-link" aria-label="GitHub">
          <PiGithubLogo size={14} />
        </a>
        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="ed-colophon-link" aria-label="LinkedIn">
          <PiLinkedinLogo size={14} />
        </a>
        <a href={socials.email} className="ed-colophon-link" aria-label="Email">
          <PiEnvelopeSimple size={14} />
        </a>
        <span className="ed-colophon-text" style={{ marginLeft: '0.5rem' }}>
          &copy;&nbsp;{new Date().getFullYear()}&nbsp;Sounic&nbsp;Akkaraju
        </span>
      </nav>
    </footer>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function MinimalTheme() {
  return (
    <div className={`editorial ${instrumentSerif.variable} ${spaceGrotesk.variable}`}>
      <Masthead />
      <main>
        <CoverSection />
        <PullQuoteSpread text={hotTakes[1]} />
        <AboutSection />
        <SkillsSection />
        <WorkSection />
        <ContactSection />
      </main>
      <Colophon />
    </div>
  )
}
