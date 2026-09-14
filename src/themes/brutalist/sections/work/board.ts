
import { ON_ACCENT, EASE_OUT, C } from '@/themes/brutalist/tokens'

// ─── PROJECT PINBOARD ────────────────────────────────────────────
// Status uses ink / accent / paper only - single structural accent.
export const STATUS_MAP: Record<string, { label: string; bg: string; fg: string }> = {
  live:          { label: 'LIVE',        bg: C.orange, fg: ON_ACCENT },
  'in-progress': { label: 'IN PROGRESS', bg: C.ink,    fg: C.white },
  research:      { label: 'RESEARCH',    bg: C.white,  fg: C.ink   },
}

// Shared fall variants: card FALLS IN from above, STICKS at a small
// resting angle (spring overshoot), then FALLS OFF downward on exit.
// Per-variant transitions are embedded so enter springs and exit drops.
// Reduced motion: no fall, just a quick opacity crossfade in place.
export function fallVariants(reduced: boolean, index: number, row: number, restRot: number, fallInRot: number, fallOffRot: number) {
  if (reduced) {
    return {
      initial: { opacity: 0, rotate: restRot },
      animate: { opacity: 1, rotate: restRot, transition: { duration: 0.16, ease: EASE_OUT } },
      exit:    { opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } },
    }
  }
  // Offset the start by the card's grid row so EVERY row begins falling from
  // the same height above the grid (lower rows fall a longer distance).
  const ROW_STEP = 330
  return {
    initial: { y: -(300 + row * ROW_STEP), rotate: fallInRot, opacity: 0 },
    animate: {
      y: 0,
      rotate: restRot,
      opacity: 1,
      transition: {
        // Clean tween (no spring wobble) with a gentle 'land and settle' overshoot.
        type: 'tween' as const,
        duration: 0.55,
        ease: [0.34, 1.3, 0.5, 1] as const,
        opacity: { duration: 0.22, ease: 'easeOut' as const },
        delay: index * 0.06, // staggered drop, one card after another
      },
    },
    exit: {
      // FALL OFF: accelerate downward like gravity, with a tilt, staggered.
      y: 560,
      rotate: fallOffRot,
      opacity: 0,
      transition: {
        type: 'tween' as const,
        duration: 0.4,
        ease: [0.42, 0, 0.9, 1] as const,
        opacity: { duration: 0.32, ease: 'linear' as const },
        delay: index * 0.045,
      },
    },
  }
}

