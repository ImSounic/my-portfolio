'use client'

import { colophon, profile, socials } from '@/data/portfolio'
import { CREDITS } from '@/themes/contributions/data'

// ─── CONTACT: open a pull request ─────────────────────────────────────────
export function Contact() {
  return (
    <footer id="contact" className="dk-contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="dk-contact__title">Open a pull request.</h2>
      <p className="dk-contact__mail">
        <a className="dk-link" href={socials.email} style={{ fontWeight: 500 }}>{profile.email}</a>
      </p>
      <p className="dk-small" style={{ marginTop: 8 }}>
        {profile.location}.{' '}
        <a className="dk-link" style={{ minHeight: 0, display: 'inline' }} href={`tel:${profile.phone.replace(/\s/g, '')}`}>
          {profile.phone}
        </a>
      </p>
      <div className="dk-contact__row">
        <a className="dk-btn dk-btn--ink" href={socials.email}>Email me</a>
        <a className="dk-link" href={socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="dk-link" href={socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className="dk-link" href={socials.resume} target="_blank" rel="noopener noreferrer">Résumé</a>
      </div>
      <div className="dk-contact__small">
        <p>{colophon}</p>
        <p>
          Project pictures are stock photographs of each project’s world, toned amber; two are open-licence:{' '}
          {CREDITS.join('; ')}, via Wikimedia Commons.
        </p>
        <p>© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  )
}
