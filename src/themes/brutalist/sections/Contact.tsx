'use client'

import { FiGithub, FiLinkedin, FiFileText, FiMail } from 'react-icons/fi'
import { profile, socials } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT, ON_ACCENT, C } from '@/themes/brutalist/tokens'
import { SplitReveal } from '@/themes/brutalist/motion/SplitReveal'
import { LetterRoll } from '@/themes/brutalist/motion/LetterRoll'
import { Magnetic } from '@/themes/brutalist/motion/Magnetic'
import { CopyEmail } from '@/themes/brutalist/motion/CopyEmail'
import { Crosshair } from '@/themes/brutalist/primitives/Crosshair'

// ─── CONTACT: the accent bookend ─────────────────────────────────
// Mirrors the hero: full-bleed accent field, giant on-accent heading, the
// four ways to reach me as a hairline grid. Email copies to the clipboard.
export function ContactSection() {
  const block = `group flex items-center gap-4 p-5 min-h-[72px] text-left w-full transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-on-accent)] focus-visible:ring-inset ${aeonik.className}`
  const links = [
    { icon: FiLinkedin, label: 'LinkedIn', href: socials.linkedin, detail: '/in/imsounic', bg: C.ink,   fg: C.white },
    { icon: FiGithub,   label: 'GitHub',   href: socials.github,   detail: 'ImSounic',     bg: C.ink,   fg: C.white },
    { icon: FiFileText, label: 'Resume',   href: socials.resume,   detail: 'Download PDF', bg: C.paper, fg: C.ink   },
  ]

  return (
    <section
      id="contact"
      className="overflow-x-hidden px-4 sm:px-6 py-20 sm:py-28"
      style={{ background: ACCENT, color: ON_ACCENT }}
    >
      <div className="max-w-6xl mx-auto">
        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${spaceMono.className}`} style={{ opacity: 0.75 }}>
          <Crosshair size={9} color={ON_ACCENT} />
          {profile.location}
        </div>

        <SplitReveal
          as="h2"
          text="LET'S TALK"
          effect="stamp"
          ghostColor={C.ink}
          stagger={0.12}
          duration={0.7}
          className={`mt-4 font-black uppercase leading-[0.88] ${aeonik.className}`}
          style={{ fontSize: 'clamp(56px, 13vw, 240px)', letterSpacing: '-0.04em', color: ON_ACCENT }}
        />

        <p
          className={`mt-8 max-w-[40ch] text-xl sm:text-2xl font-black leading-tight ${aeonik.className}`}
          style={{ textWrap: 'pretty' }}
        >
          Got an AI/ML problem? Let&apos;s build.
        </p>

        {/* Reach me: hairline grid on the field */}
        <div
          className="mt-12 grid sm:grid-cols-2 max-w-3xl"
          style={{ gap: 2, background: ON_ACCENT, border: `2px solid ${ON_ACCENT}` }}
        >
          <Magnetic strength={0.12} className="block">
            <CopyEmail
              email={profile.email}
              className={block}
              style={{ background: ON_ACCENT, color: ACCENT }}
              aria-label={`Copy email address ${profile.email}`}
            >
              {(state) => (
                <>
                  <FiMail size={22} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block font-black text-sm uppercase tracking-widest">
                      {state === 'copied' ? 'Copied' : 'Copy email'}
                    </span>
                    <span className={`block text-xs font-bold break-all ${spaceMono.className}`}>{profile.email}</span>
                  </span>
                </>
              )}
            </CopyEmail>
          </Magnetic>

          {links.map(({ icon: Icon, label, href, detail, bg, fg }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              data-lr-host
              className={block}
              style={{ background: bg, color: fg }}
            >
              <Icon size={22} aria-hidden="true" />
              <span className="min-w-0">
                <span className="block font-black text-sm uppercase tracking-widest">
                  <LetterRoll text={label} />
                </span>
                <span className={`block text-xs font-bold break-all ${spaceMono.className}`}>{detail}</span>
              </span>
            </a>
          ))}
        </div>

        <p className={`mt-5 text-xs font-bold ${spaceMono.className}`} style={{ opacity: 0.85 }}>
          Prefer your mail app?{' '}
          <a
            href={socials.email}
            className="underline underline-offset-4 decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-on-accent)]"
          >
            Write to {profile.email}
          </a>
        </p>
      </div>
    </section>
  )
}
