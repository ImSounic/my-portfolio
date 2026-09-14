'use client'

import { spaceMono } from '@/themes/fonts'
import { C } from '@/themes/brutalist/tokens'

// ─── TECHNICAL FRAME - [ LABEL ] telemetry tag ──────────────────
export function FrameTag({
  children,
  color = C.black,
}: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${spaceMono.className}`}
      style={{ color }}
    >
      <span style={{ opacity: 0.5 }}>[</span>
      {children}
      <span style={{ opacity: 0.5 }}>]</span>
    </span>
  )
}

