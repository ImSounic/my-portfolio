'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { MODE_EVENT, applyMode, currentMode, type Mode } from '@/themes/contributions/mode'

// ─── Light / dark toggle: a sun in dark mode, a moon in light ────────
// Where the browser has view transitions, the new mode grows as a circle
// from the button; otherwise (and under reduced motion) it simply swaps.
// The icons follow the <html> attribute in CSS, so they are right in the
// transition's new frame; the label follows React state.
export function ModeToggle() {
  const [mode, setMode] = useState<Mode>('dark')

  useEffect(() => {
    setMode(currentMode())
    const onMode = (e: Event) => setMode((e as CustomEvent<Mode>).detail)
    window.addEventListener(MODE_EVENT, onMode)
    return () => window.removeEventListener(MODE_EVENT, onMode)
  }, [])

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Mode = currentMode() === 'light' ? 'dark' : 'light'
    const doc = document as Document & { startViewTransition?: (update: () => void) => unknown }
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyMode(next)
      return
    }
    const r = e.currentTarget.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const root = document.documentElement.style
    root.setProperty('--mode-x', `${x}px`)
    root.setProperty('--mode-y', `${y}px`)
    root.setProperty('--mode-r', `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`)
    doc.startViewTransition(() => applyMode(next))
  }

  return (
    <button type="button" className="dk-mode" onClick={toggle} aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <svg className="dk-mode__sun" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <svg className="dk-mode__moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
