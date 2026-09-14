'use client'

import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT_TEXT, accentA, C } from '@/themes/brutalist/tokens'
import { FrameTag } from '@/themes/brutalist/primitives/FrameTag'
import { SplitReveal } from '@/themes/brutalist/motion/SplitReveal'

// ─── SECTION HEADER (shared structural macro-header) ────────────
export function SectionHeader({
  index,
  title,
  tag,
  onDark = false,
}: { index: string; title: string; tag: string; onDark?: boolean }) {
  const ink = onDark ? C.paper : C.ink
  const sub = onDark ? 'rgba(244,244,240,0.4)' : 'rgba(10,10,10,0.4)'
  const rule = onDark ? accentA(40) : C.black
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <FrameTag color={ACCENT_TEXT}>{tag}</FrameTag>
        <div className="flex-1 h-px min-w-[16px]" style={{ background: rule }} />
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] shrink-0 ${spaceMono.className}`} style={{ color: sub }}>
          UNIT / {index}
        </span>
      </div>
      <SplitReveal
        as="h2"
        text={title}
        mode="words"
        className={`font-black uppercase leading-[0.85] ${aeonik.className}`}
        style={{ fontSize: 'clamp(40px, 10vw, 120px)', color: ink, letterSpacing: '-0.04em' }}
      />
    </div>
  )
}

