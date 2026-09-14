'use client'

import { FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi'
import { profile, socials, colophon } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { C } from '@/themes/brutalist/tokens'
import { LetterRoll } from '@/themes/brutalist/motion/LetterRoll'
import { CopyEmail } from '@/themes/brutalist/motion/CopyEmail'
import { Crosshair } from '@/themes/brutalist/primitives/Crosshair'

// ─── FOOTER ──────────────────────────────────────────────────────
export function Footer() {
  const link = `inline-flex items-center gap-2 min-h-[44px] px-1 text-xs font-black uppercase tracking-widest text-white/80 hover:text-[color:var(--bz-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] ${spaceMono.className}`
  const footerLinks = [
    { href: socials.github,   icon: FiGithub,   label: 'GitHub'   },
    { href: socials.linkedin, icon: FiLinkedin, label: 'LinkedIn' },
    { href: socials.resume,   icon: FiFileText, label: 'Resume'   },
  ]

  return (
    <footer
      className={`border-t-[2px] border-[color:var(--bz-accent)] px-4 sm:px-6 py-8 sm:py-10 ${aeonik.className}`}
      style={{ background: C.ink }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className={`flex items-center gap-2 mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 ${spaceMono.className}`}>
            <Crosshair size={9} color={C.orange} />
            REV 3.0 · UNIT / D-01 · DECLASSIFIED
          </div>
          <div className="font-black text-sm uppercase tracking-widest text-white">
            {profile.name}{' '}
            <span style={{ color: C.orange }}>·</span>{' '}
            <span className="font-bold text-white/70">{profile.role}</span>
          </div>
          <p
            className={`mt-2 text-xs font-bold text-white/70 max-w-xs sm:max-w-sm leading-relaxed ${spaceMono.className}`}
            style={{ textWrap: 'pretty' }}
          >
            {colophon}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {footerLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              data-lr-host
              className={link}
            >
              <Icon size={14} aria-hidden="true" />
              <LetterRoll text={label} />
            </a>
          ))}
          <CopyEmail email={profile.email} className={link} aria-label={`Copy email address ${profile.email}`}>
            {(state) => (
              <>
                <FiMail size={14} aria-hidden="true" />
                {state === 'copied' ? 'Copied' : <LetterRoll text="Email" />}
              </>
            )}
          </CopyEmail>
        </nav>
      </div>
    </footer>
  )
}
