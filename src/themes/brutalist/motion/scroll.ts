// src/themes/brutalist/motion/scroll.ts
// Single place that knows whether Lenis is driving the page. Sections call
// scrollTo(id) and never touch the instance directly.
import type Lenis from '@studio-freight/lenis'

let lenis: Lenis | null = null

export const setLenis = (instance: Lenis | null) => {
  lenis = instance
}

export const getLenis = () => lenis

export const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
