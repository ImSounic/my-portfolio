'use client'

import { C } from '@/themes/brutalist/tokens'

// ─── CROSSHAIR - grid intersection marker (industrial) ──────────
export function Crosshair({
  size = 12,
  color = C.black,
  className = '',
}: { size?: number; color?: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      className={className}
      style={{ display: 'block' }}
    >
      <path d="M6 0V12M0 6H12" stroke={color} strokeWidth="1" />
    </svg>
  )
}

