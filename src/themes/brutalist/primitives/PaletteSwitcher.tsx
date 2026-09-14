'use client'

import { useReducedMotion } from 'motion/react'
import { spaceMono } from '@/themes/fonts'
import { PALETTES, type PaletteId } from '@/themes/brutalist/tokens'

// ─── PALETTE SWITCHER ────────────────────────────────────────────
// Hard-bordered swatch row. `bar` = inline in the desktop navbar (lg+),
// `menu` = larger row inside the mobile/tablet menu. The active swatch carries
// a hard offset shadow + a centered contrast dot; aria-pressed exposes state.
export function PaletteSwitcher({
  palette,
  setPalette,
  variant,
}: {
  palette: PaletteId
  setPalette: (id: PaletteId) => void
  variant: 'bar' | 'menu'
}) {
  const reduced = useReducedMotion()
  const isMenu  = variant === 'menu'

  return (
    <div
      className={`flex items-center ${isMenu ? 'gap-2.5' : 'gap-1.5'}`}
      role="group"
      aria-label="Accent palette"
    >
      {!isMenu && (
        <span
          className={`hidden xl:inline text-[9px] font-bold uppercase tracking-[0.18em] text-black/40 ${spaceMono.className}`}
          aria-hidden="true"
        >
          PALETTE
        </span>
      )}
      {PALETTES.map((p) => {
        const active = p.id === palette
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setPalette(p.id)}
            aria-pressed={active}
            aria-label={`${p.name} palette: ${p.desc}`}
            title={`${p.name} · ${p.desc}`}
            className={`relative grid place-items-center border-[2px] border-black transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f0] ${
              isMenu ? 'w-11 h-11' : 'w-7 h-7'
            } ${reduced ? '' : 'hover:-translate-y-px hover:-translate-x-px'}`}
            style={{ background: p.swatch, boxShadow: active ? '3px 3px 0 #000' : '2px 2px 0 rgba(0,0,0,0.22)' }}
          >
            {active && (
              <span
                aria-hidden="true"
                className={isMenu ? 'w-3 h-3' : 'w-2 h-2'}
                style={{ background: p.on }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

