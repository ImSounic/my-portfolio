'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  PiGithubLogoBold,
  PiLinkedinLogoBold,
  PiEnvelopeSimpleBold,
  PiFileTextBold,
  PiArrowUpRightBold,
  PiArrowRightBold,
  PiListBold,
  PiXBold,
  PiPlusBold,
  PiCodeBold,
  PiBrainBold,
  PiStackBold,
  PiCloudBold,
  PiCircuitryBold,
  PiMapPinBold,
  PiTranslateBold,
  PiGraduationCapBold,
  PiFilmSlateBold,
  PiGameControllerBold,
  PiCommandBold,
} from 'react-icons/pi'
import {
  profile,
  socials,
  projects,
  skills,
  education,
  languages,
  manifesto,
  currently,
  creative,
  gaming,
  colophon,
  navSections,
} from '@/data/portfolio'
import { instrumentSerif, spaceGrotesk, spaceMono } from '@/themes/fonts'
import './minimal2.css'

// ─── Reveal (IntersectionObserver enhancement, visible-by-default) ──────────

function useReveal(threshold = 0.14) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    // Hide only once JS is active and the observer is about to run.
    el.setAttribute('data-reveal', 'pending')

    const fallback = setTimeout(() => setVisible(true), 1200)

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

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`m2-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ─── Status pill ────────────────────────────────────────────────────────────

function StatusPill({ status }: { status?: string }) {
  if (!status) return null
  const map: Record<string, { cls: string; label: string }> = {
    live: { cls: 'm2-pill--green', label: 'Live' },
    'in-progress': { cls: 'm2-pill--yellow', label: 'In Progress' },
    research: { cls: 'm2-pill--blue', label: 'Research' },
  }
  const meta = map[status] ?? { cls: 'm2-pill--blue', label: status }
  return (
    <span className={`m2-pill ${meta.cls}`}>
      <span className="m2-pill-dot" aria-hidden="true" />
      {meta.label}
    </span>
  )
}

// ─── Navigation ─────────────────────────────────────────────────────────────

function Nav() {
  const [active, setActive] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const ids = navSections.map((s) => s.id)
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const handleNav = useCallback((id: string) => {
    scrollTo(id)
    setMobileOpen(false)
  }, [])

  return (
    <>
      <header className="m2-nav">
        <nav className="m2-nav-inner" aria-label="Primary">
          <button className="m2-nav-brand" onClick={() => handleNav('home')} aria-label="Back to top">
            <span className="m2-nav-mark" aria-hidden="true">
              SA
            </span>
            Sounic
          </button>

          <div className="m2-nav-links">
            {navSections.map((s) => (
              <button
                key={s.id}
                className={`m2-nav-link ${active === s.id ? 'active' : ''}`}
                onClick={() => handleNav(s.id)}
                aria-current={active === s.id ? 'true' : undefined}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            className="m2-nav-burger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <PiListBold size={20} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="m2-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="m2-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <PiXBold size={24} />
            </button>
            {navSections.map((s, i) => (
              <motion.button
                key={s.id}
                className="m2-mobile-link"
                onClick={() => handleNav(s.id)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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

// ─── Home ───────────────────────────────────────────────────────────────────

function HomeSection() {
  return (
    <section id="home" className="m2-section m2-section--wide m2-home">
      <div className="m2-home-grid">
        {/* Left: identity */}
        <Reveal>
          <span className="m2-pill m2-pill--green">
            <span className="m2-pill-dot" aria-hidden="true" />
            Open to opportunities
          </span>

          <h1 className="m2-home-name">
            Sounic
            <br />
            Akkaraju
          </h1>

          <p className="m2-home-role">{profile.tagline}</p>
          <p className="m2-home-bio">{profile.shortBio}</p>

          <p className="m2-home-meta">
            <PiMapPinBold size={13} aria-hidden="true" />
            {profile.location}
          </p>

          <div className="m2-home-cta">
            <a className="m2-btn m2-btn--solid" href={socials.resume} target="_blank" rel="noopener noreferrer">
              <PiFileTextBold size={15} aria-hidden="true" />
              Resume
            </a>
            <button className="m2-btn m2-btn--ghost" onClick={() => scrollTo('contact')}>
              <PiEnvelopeSimpleBold size={15} aria-hidden="true" />
              Get in touch
            </button>
            <a className="m2-btn m2-btn--ghost" href={socials.linkedin} target="_blank" rel="noopener noreferrer">
              <PiLinkedinLogoBold size={15} aria-hidden="true" />
              LinkedIn
            </a>
            <a className="m2-btn m2-btn--ghost" href={socials.github} target="_blank" rel="noopener noreferrer">
              <PiGithubLogoBold size={15} aria-hidden="true" />
              GitHub
            </a>
          </div>
        </Reveal>

        {/* Right: faux-macOS window — whoami */}
        <Reveal delay={120}>
          <div className="m2-window" role="presentation">
            <div className="m2-window-bar">
              <span className="m2-window-dot" aria-hidden="true" />
              <span className="m2-window-dot" aria-hidden="true" />
              <span className="m2-window-dot" aria-hidden="true" />
              <span className="m2-window-title">sounic / whoami</span>
            </div>
            <div className="m2-window-body">
              <div className="m2-whoami-portrait">
                <div className="m2-whoami-avatar">
                  <Image
                    src="/profile.png"
                    alt="Portrait of Sounic Akkaraju"
                    fill
                    sizes="48px"
                    style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                  />
                </div>
                <div className="m2-whoami-id">
                  <div className="m2-whoami-id-name">{profile.name}</div>
                  <div className="m2-whoami-id-sub">{profile.role} · MSc, University of Twente</div>
                </div>
              </div>

              <div className="m2-whoami-row">
                <span className="m2-whoami-prompt" aria-hidden="true">
                  $
                </span>
                <span className="m2-whoami-cmd">whoami --manifesto</span>
              </div>
              <p className="m2-whoami-out">{manifesto.replace(/\*/g, '')}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── About ──────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="m2-section">
      <Reveal>
        <span className="m2-eyebrow">
          <span className="m2-eyebrow-dot" aria-hidden="true" />
          About
        </span>
        <h2 className="m2-section-title">
          A note on how
          <br />I work.
        </h2>
      </Reveal>

      <Reveal delay={80}>
        <div className="m2-prose" style={{ marginTop: '1.75rem' }}>
          <p>{profile.summary}</p>
        </div>
        <blockquote className="m2-quote">&ldquo;{manifesto.replace(/\*/g, '')}&rdquo;</blockquote>
      </Reveal>

      {/* Flat bento: currently / languages / education */}
      <div className="m2-bento">
        <Reveal className="m2-span-3 m2-row-2" delay={60}>
          <div className="m2-card" style={{ height: '100%' }}>
            <div className="m2-bento-item-title">Currently</div>
            <div className="m2-kv">
              <div className="m2-kv-row">
                <span className="m2-kv-key">Building</span>
                <span className="m2-kv-val">{currently.building}</span>
              </div>
              <div className="m2-kv-row">
                <span className="m2-kv-key">Learning</span>
                <span className="m2-kv-val">{currently.learning}</span>
              </div>
              <div className="m2-kv-row">
                <span className="m2-kv-key">Exploring</span>
                <span className="m2-kv-val">{currently.exploring}</span>
              </div>
              <div className="m2-kv-row">
                <span className="m2-kv-key">Based in</span>
                <span className="m2-kv-val">{currently.location}</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="m2-span-3" delay={120}>
          <div className="m2-card" style={{ height: '100%' }}>
            <div className="m2-bento-item-title">
              <PiTranslateBold size={13} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} aria-hidden="true" />
              Languages
            </div>
            <div className="m2-kv">
              {languages.map((lang) => (
                <div key={lang.name} className="m2-kv-row">
                  <span className="m2-kv-key">{lang.name}</span>
                  <span className="m2-kv-val">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="m2-span-3" delay={160}>
          <div className="m2-card" style={{ height: '100%' }}>
            <div className="m2-bento-item-title">
              <PiGraduationCapBold size={13} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} aria-hidden="true" />
              Education
            </div>
            {education.map((edu) => (
              <div key={edu.school} className="m2-edu-item">
                <div className="m2-edu-degree">{edu.degree}</div>
                <div className="m2-edu-school">{edu.school}</div>
                <div className="m2-edu-period">{edu.period}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Creative + gaming */}
      <div className="m2-bento" style={{ marginTop: '1rem' }}>
        <Reveal className="m2-span-3" delay={60}>
          <div className="m2-card m2-card--hover" style={{ height: '100%' }}>
            <div className="m2-bento-item-title">
              <PiFilmSlateBold size={13} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} aria-hidden="true" />
              Beyond code
            </div>
            <h3 className="m2-feature-title">{creative.title}</h3>
            <p className="m2-feature-body">{creative.body}</p>
          </div>
        </Reveal>
        <Reveal className="m2-span-3" delay={120}>
          <div className="m2-card m2-card--hover" style={{ height: '100%' }}>
            <div className="m2-bento-item-title">
              <PiGameControllerBold size={13} style={{ verticalAlign: '-2px', marginRight: '0.4rem' }} aria-hidden="true" />
              Systems thinking
            </div>
            <h3 className="m2-feature-title">{gaming.title}</h3>
            <p className="m2-feature-body">{gaming.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Skills ─────────────────────────────────────────────────────────────────

const SKILL_ICONS = [
  { icon: PiCodeBold, bg: 'var(--m2-blue-bg)', color: 'var(--m2-blue-text)' },
  { icon: PiBrainBold, bg: 'var(--m2-green-bg)', color: 'var(--m2-green-text)' },
  { icon: PiStackBold, bg: 'var(--m2-yellow-bg)', color: 'var(--m2-yellow-text)' },
  { icon: PiCloudBold, bg: 'var(--m2-red-bg)', color: 'var(--m2-red-text)' },
  { icon: PiCircuitryBold, bg: 'var(--m2-blue-bg)', color: 'var(--m2-blue-text)' },
]

// Bento spans so the grid stays asymmetric: 3/3, 3/3, then a wide 6 / split.
const SKILL_SPANS = ['m2-span-3', 'm2-span-3', 'm2-span-2', 'm2-span-2', 'm2-span-2']

function SkillsSection() {
  return (
    <section id="skills" className="m2-section">
      <Reveal>
        <span className="m2-eyebrow">
          <span className="m2-eyebrow-dot" aria-hidden="true" />
          Skills
        </span>
        <h2 className="m2-section-title">The toolkit.</h2>
        <p className="m2-section-lead">
          Languages, models, and infrastructure I reach for, grouped by where they sit in the stack.
        </p>
      </Reveal>

      <div className="m2-skills-grid">
        {skills.map((group, gi) => {
          const meta = SKILL_ICONS[gi % SKILL_ICONS.length]
          const Icon = meta.icon
          return (
            <Reveal key={group.category} className={SKILL_SPANS[gi % SKILL_SPANS.length]} delay={60 + gi * 60}>
              <div className="m2-card m2-card--hover" style={{ height: '100%' }}>
                <div className="m2-skill-head">
                  <span className="m2-skill-icon" style={{ background: meta.bg, color: meta.color }} aria-hidden="true">
                    <Icon size={17} />
                  </span>
                  <span className="m2-skill-cat">{group.category}</span>
                </div>
                <div className="m2-skill-items">
                  {group.items.map((item) => (
                    <span key={item} className="m2-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

// ─── Work ───────────────────────────────────────────────────────────────────

// Asymmetric bento: a couple of wide features, the rest half-width.
const PROJECT_SPANS = ['m2-span-4', 'm2-span-2', 'm2-span-3', 'm2-span-3', 'm2-span-2', 'm2-span-4']

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const [open, setOpen] = useState(false)
  const prefersReduced = useReducedMotion()
  const toggle = useCallback(() => setOpen((v) => !v), [])
  const detailId = `m2-detail-${project.id}`

  return (
    <article className={`m2-card m2-card--hover m2-project ${open ? 'is-open' : ''}`}>
      <div className="m2-project-media">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 767px) 100vw, 45vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="m2-project-body">
        <div className="m2-project-meta">
          <span className="m2-project-period">{project.period}</span>
          <StatusPill status={project.status} />
        </div>

        <h3 className="m2-project-title">{project.title}</h3>
        <p className="m2-project-blurb">{project.blurb}</p>

        <div className="m2-project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="m2-tag">
              {tag}
            </span>
          ))}
        </div>

        <button
          className="m2-project-toggle"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={detailId}
        >
          <span className="m2-toggle-icon" aria-hidden="true">
            <PiPlusBold size={12} />
          </span>
          {open ? 'Show less' : 'Read more'}
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={detailId}
              className="m2-project-detail"
              initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={prefersReduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="m2-project-detail-inner">
                <p className="m2-project-desc">{project.description}</p>
                <ul className="m2-project-highlights">
                  {project.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                {(project.github || project.link) && (
                  <div className="m2-project-links">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="m2-link">
                        <PiGithubLogoBold size={13} aria-hidden="true" />
                        Source
                      </a>
                    )}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="m2-link">
                        <PiArrowUpRightBold size={13} aria-hidden="true" />
                        Visit
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  )
}

function WorkSection() {
  return (
    <section id="work" className="m2-section m2-section--wide">
      <Reveal>
        <span className="m2-eyebrow">
          <span className="m2-eyebrow-dot" aria-hidden="true" />
          Projects
        </span>
        <h2 className="m2-section-title">Selected work.</h2>
        <p className="m2-section-lead">
          Healthcare AI, distributed data, and the apps in between. Open any card for the full story.
        </p>
      </Reveal>

      <div className="m2-work-grid">
        {projects.map((project, i) => (
          <Reveal key={project.id} className={PROJECT_SPANS[i % PROJECT_SPANS.length]} delay={Math.min(i, 3) * 80}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── Contact ────────────────────────────────────────────────────────────────

function ContactSection() {
  const contacts = [
    {
      href: socials.email,
      icon: <PiEnvelopeSimpleBold size={16} />,
      label: 'Email',
      value: 'imsounic.dev@gmail.com',
      external: false,
    },
    {
      href: socials.linkedin,
      icon: <PiLinkedinLogoBold size={16} />,
      label: 'LinkedIn',
      value: 'linkedin.com/in/imsounic',
      external: true,
    },
    {
      href: socials.github,
      icon: <PiGithubLogoBold size={16} />,
      label: 'GitHub',
      value: 'github.com/ImSounic',
      external: true,
    },
    {
      href: socials.resume,
      icon: <PiFileTextBold size={16} />,
      label: 'Resume',
      value: 'Download PDF',
      external: true,
    },
  ]

  return (
    <section id="contact" className="m2-section">
      <Reveal>
        <span className="m2-eyebrow">
          <span className="m2-eyebrow-dot" aria-hidden="true" />
          Contact
        </span>
        <h2 className="m2-section-title">Let&rsquo;s build something.</h2>
        <p className="m2-section-lead">{profile.availability}. Open to research collaborations and good conversations.</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="m2-contact-grid">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? '_blank' : undefined}
              rel={c.external ? 'noopener noreferrer' : undefined}
              className="m2-contact-row"
            >
              <span className="m2-contact-ic" aria-hidden="true">
                {c.icon}
              </span>
              <span>
                <span className="m2-contact-label" style={{ display: 'block' }}>
                  {c.label}
                </span>
                <span className="m2-contact-val">{c.value}</span>
              </span>
              <span className="m2-contact-arrow" aria-hidden="true">
                <PiArrowRightBold size={15} />
              </span>
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal delay={140}>
        <p className="m2-kbd-hint">
          <PiCommandBold size={15} aria-hidden="true" />
          Tip: switch the look with the theme picker, top right. Try <kbd>T</kbd> then <kbd>2</kbd>.
        </p>
      </Reveal>
    </section>
  )
}

// ─── Footer / colophon ──────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="m2-footer">
      <div className="m2-footer-inner">
        <p className="m2-footer-colophon">{colophon}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <nav className="m2-footer-links" aria-label="Social links">
            <a href={socials.github} target="_blank" rel="noopener noreferrer" className="m2-footer-link" aria-label="GitHub">
              <PiGithubLogoBold size={16} />
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="m2-footer-link"
              aria-label="LinkedIn"
            >
              <PiLinkedinLogoBold size={16} />
            </a>
            <a href={socials.email} className="m2-footer-link" aria-label="Email">
              <PiEnvelopeSimpleBold size={16} />
            </a>
          </nav>
          <span className="m2-footer-copy">&copy; {new Date().getFullYear()} Sounic Akkaraju</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Root ───────────────────────────────────────────────────────────────────

export default function Minimal2Theme() {
  return (
    <div
      className={`m2 ${instrumentSerif.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
      style={{ minHeight: '100dvh' }}
    >
      <div className="m2-ambient" aria-hidden="true">
        <div className="m2-ambient-blob" />
      </div>
      <div className="m2-grain" aria-hidden="true" />

      <Nav />

      <main className="m2-main">
        <HomeSection />
        <AboutSection />
        <SkillsSection />
        <WorkSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}
