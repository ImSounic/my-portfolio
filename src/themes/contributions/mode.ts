// Light and dark for the Contributions theme. The mode lives on <html> as
// data-contrib-mode="light" (absent = dark), set before first paint by a small
// script in the layout (MODE_SCRIPT) from the visitor's saved choice, so
// nothing flashes. CSS keys its tokens off that attribute; the 3D scenes read
// their palette here and repaint on MODE_EVENT.

export type Mode = 'dark' | 'light'

export const MODE_KEY = 'contrib-mode'
export const MODE_EVENT = 'contributions:mode'

/** Runs in <head> before paint: applies a saved light choice. */
export const MODE_SCRIPT = `try{if(localStorage.getItem('${MODE_KEY}')==='light')document.documentElement.dataset.contribMode='light'}catch(e){}`

export const currentMode = (): Mode =>
  typeof document !== 'undefined' && document.documentElement.dataset.contribMode === 'light' ? 'light' : 'dark'

/** Applies, saves and announces a mode (listeners repaint synchronously). */
export function applyMode(mode: Mode) {
  const html = document.documentElement
  if (mode === 'light') html.dataset.contribMode = 'light'
  else delete html.dataset.contribMode
  try {
    localStorage.setItem(MODE_KEY, mode)
  } catch {
    /* private mode: the choice lasts for this visit */
  }
  window.dispatchEvent(new CustomEvent<Mode>(MODE_EVENT, { detail: mode }))
}

/** Colours the WebGL scenes need, per mode (GitHub's own graph greens in each). */
export interface ScenePalette {
  /** Contribution levels 0..4. */
  greens: readonly [string, string, string, string, string]
  /** The page behind the transparent canvases. */
  ground: string
  hoverTop: string
  edge: string
  pulse: string
  glow: string
  feature: string
  /** Bench: a checked cell, a set-aside (idle) cell. */
  checked: string
  idle: string
}

export const PALETTES: Record<Mode, ScenePalette> = {
  dark: {
    greens: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    ground: '#0d1117',
    hoverTop: '#7ee787',
    edge: '#26a641',
    pulse: '#39d353',
    glow: '#aff5b4',
    feature: '#26a641',
    checked: '#21262d',
    idle: '#3d444d',
  },
  light: {
    greens: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    ground: '#ffffff',
    hoverTop: '#1a7f37',
    edge: '#2da44e',
    pulse: '#1a7f37',
    glow: '#2da44e',
    feature: '#30a14e',
    checked: '#d0d7de',
    idle: '#afb8c1',
  },
}
