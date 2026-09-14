// src/themes/brutalist/tokens.ts
// Shared design tokens, motion curves and small helpers for the Neo-Brutalist theme.

// ─── SWAPPABLE ACCENT PALETTES ──────────────────────────────────
// The substrate (paper + ink + black shadows) is fixed; only the accent system
// swaps, driven by CSS variables defined in brutalist.css. See that file for the
// per-palette token values and their AA contrast notes.
export const PALETTES = [
  { id: 'cobalt',  name: 'Cobalt',  swatch: '#2b50ff', on: '#ffffff', desc: 'Electric blueprint' },
  { id: 'lime',    name: 'Lime',    swatch: '#c2f000', on: '#0a0a0a', desc: 'Acid hardcore'      },
  { id: 'magenta', name: 'Magenta', swatch: '#ff2d78', on: '#0a0a0a', desc: 'Risograph punk'     },
  { id: 'red',     name: 'Red',     swatch: '#e60023', on: '#ffffff', desc: 'Swiss signal'       },
] as const
export type PaletteId = (typeof PALETTES)[number]['id']
export const DEFAULT_PALETTE: PaletteId = 'cobalt'
export const PALETTE_STORAGE_KEY = 'brutalist-palette'

// ─── PALETTE - SUBSTRATE + ACCENT TOKENS ────────────────────────
// Accent tokens are CSS vars so the live switcher recolors instantly:
//   ACCENT      vivid accent (fills, strokes, on-dark text, shadows, rings)
//   ACCENT_TEXT accent used as TEXT on LIGHT surfaces (contrast-safe)
//   ON_ACCENT   text/icons sitting ON an accent fill (white or ink)
export const ACCENT      = 'var(--bz-accent)'
export const ACCENT_TEXT = 'var(--bz-accent-ink)'
export const ON_ACCENT   = 'var(--bz-on-accent)'
// Translucent accent (tape strips, hairline rules on dark). Driven by the same
// var so every palette tints its own tapes/rules instead of leaking orange.
export const accentA = (pct: number) => `color-mix(in srgb, var(--bz-accent) ${pct}%, transparent)`
export const C = {
  paper:  '#f4f4f0',
  paper2: '#eae8e3', // secondary substrate (still Swiss paper family)
  ink:    '#0a0a0a', // carbon ink (avoid pure #000 surfaces, use for ink)
  black:  '#000000', // hairlines / borders only
  orange: ACCENT,    // THE single structural accent (now palette-driven)
  white:  '#ffffff',
} as const

// ─── MOTION - custom curves with mass (emil / high-end) ─────────
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const SPRING   = { type: 'spring', stiffness: 280, damping: 24 } as const

// ─── DETERMINISTIC ROTATIONS (no Math.random - SSR-safe) ────────
// Each page is a stack of taped cards. On a page flip the current
// page FALLS OFF (drops + tilts away) and the next page FALLS IN and
// STICKS at a small resting angle (spring with mild overshoot).

// ─── PAGINATION - "PAGE 02 / FIELD LOG" (the 4 newest units) ────
// These ids live on PAGE TWO; everything else lives on PAGE ONE.
export const NEW_PROJECT_IDS = ['f1-strategy', 'sepsis-forecasting', 'ev-forecasting', 'cifr-quant'] as const

// Resting tilt each card settles to on a page (deterministic, SSR-safe).
export const REST_ROTS = [-3.0, 2.4, -1.8, 2.9, -2.2, 1.6, -1.2, 2.8, -2.6, 1.1]
// Big initial tilt while a card is still FALLING IN (settles to REST_ROTS).
export const FALL_IN_ROTS = [-14, 12, -11, 13, -10, 9, -13, 11, -12, 10]
// Big tilt a card rotates toward as it FALLS OFF (drops down and away).
export const FALL_OFF_ROTS = [16, -18, 14, -15, 17, -13, 15, -16, 18, -14]

// ─── CAN-HOVER DETECTION (guards whileHover on touch) ───────────
export const canHover =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover)').matches


// ─── SCROLL HELPER ───────────────────────────────────────────────
export const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

