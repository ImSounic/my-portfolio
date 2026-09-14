'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { setLenis } from './scroll'

// Smooth scroll for the theme. Mounted with the theme root and torn down on
// unmount so switching themes never leaves a hijacked wheel. Disabled under
// prefers-reduced-motion. Pauses while the project modal locks body scroll.
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    setLenis(lenis)

    let frame = 0
    const loop = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    const sync = () => {
      if (document.body.style.overflow === 'hidden') lenis.stop()
      else lenis.start()
    }
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      setLenis(null)
      lenis.destroy()
    }
  }, [enabled])
}
