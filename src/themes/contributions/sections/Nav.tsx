'use client'

import { useEffect, useState } from 'react'
import { profile } from '@/data/portfolio'
import { NAV, scrollToId } from '@/themes/contributions/data'

// ─── NAV: name, section links, and the phone menu (closes with Escape) ──
export function Nav({ links = NAV }: { links?: typeof NAV }) {
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  return (
    <>
      <nav className="dk-nav" aria-label="Sections">
        <span className="dk-nav__name">{profile.name}</span>
        <div className="dk-nav__links">
          {links.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); scrollToId(n.id) }}>
              {n.label}
            </a>
          ))}
        </div>
        <button type="button" className="dk-nav__menu" aria-expanded={menu} aria-controls="dk-menu" onClick={() => setMenu(true)}>
          Menu
        </button>
      </nav>
      {menu && (
        <div id="dk-menu" className="dk-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="dk-menu__top">
            <span className="dk-nav__name">{profile.name}</span>
            <button type="button" className="dk-nav__menu" style={{ display: 'inline-flex' }} onClick={() => setMenu(false)} autoFocus>
              Close
            </button>
          </div>
          <ul>
            {links.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); setMenu(false); requestAnimationFrame(() => scrollToId(n.id)) }}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
