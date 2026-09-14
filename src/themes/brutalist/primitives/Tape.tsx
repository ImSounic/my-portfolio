'use client'


// ─── TAPE CORNER (decorative, monochrome) ───────────────────────
export function Tape({ angle = 0, color = 'rgba(255,255,255,0.7)' }: { angle?: number; color?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: -10,
        left: '50%',
        transform: `translateX(-50%) rotate(${angle}deg)`,
        width: 48,
        height: 18,
        background: color,
        border: '1px solid rgba(0,0,0,0.18)',
        zIndex: 10,
      }}
    />
  )
}

