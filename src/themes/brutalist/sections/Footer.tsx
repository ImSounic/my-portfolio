'use client'

import { FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi'
import { profile, socials, colophon } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { C } from '@/themes/brutalist/tokens'
import { Crosshair } from '@/themes/brutalist/primitives/Crosshair'

// ─── FOOTER ──────────────────────────────────────────────────────
export function Footer() {
  const footerLinks = [
    { href: socials.github,   icon: FiGithub,   label: 'GitHub'   },
    { href: socials.linkedin, icon: FiLinkedin, label: 'LinkedIn' },
    { href: socials.email,    icon: FiMail,     label: 'Email'    },
    { href: socials.resume,   icon: FiFileText, label: 'Resume'   },
  ]

  return (
    <footer
      className={`border-t-[2px] border-[color:var(--bz-accent)] px-4 sm:px-6 py-8 sm:py-10 ${aeonik.className}`}
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
              className="border-[1px] border-white/25 p-2 text-white/55 hover:border-[color:var(--bz-accent)] hover:text-[color:var(--bz-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

