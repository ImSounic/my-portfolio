'use client'

import { motion, useReducedMotion } from 'motion/react'
import { manifesto, hotTakes } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT_TEXT, accentA, EASE_OUT, canHover, C } from '@/themes/brutalist/tokens'
import { FrameTag } from '@/themes/brutalist/primitives/FrameTag'
import { Crosshair } from '@/themes/brutalist/primitives/Crosshair'

// ─── MANIFESTO ───────────────────────────────────────────────────
export function ManifestoSection() {
  const reduced = useReducedMotion()

  return (
    <section
      className="py-12 sm:py-20 px-4 sm:px-6 overflow-x-hidden"
      style={{ background: C.ink }}
    >
      {/* Section label - technical frame */}
      <div className="max-w-5xl mx-auto mb-4 flex items-center gap-3 flex-wrap">
        <FrameTag color={C.orange}>SECTION / MANIFESTO</FrameTag>
        <div className="flex-1 h-px min-w-[16px]" style={{ background: accentA(40) }} />
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 shrink-0 ${spaceMono.className}`}>
          REV 2.0
        </span>
      </div>

      <div className="max-w-5xl mx-auto mb-10">
        <h2
          className={`font-black uppercase leading-[0.85] ${aeonik.className}`}
          style={{ fontSize: 'clamp(48px, 9vw, 110px)', color: C.orange, letterSpacing: '-0.05em' }}
        >
          MANIFESTO
        </h2>
      </div>

      {/* Manifesto intro - big pull quote */}
      <div className="max-w-5xl mx-auto mb-16">
        <blockquote
          className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight ${aeonik.className}`}
          style={{ color: C.paper }}
        >
          <span style={{ color: C.orange, fontSize: '4rem', lineHeight: 0.5, verticalAlign: 'middle' }}>&ldquo;</span>
          {manifesto}
          <span style={{ color: C.orange }}>&#8221;</span>
        </blockquote>
      </div>

      {/* Tenets - modular grid, hairline dividers (gap:1px on accent) */}
      <div
        className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3"
        style={{ gap: 1, background: C.orange, border: `1px solid ${C.orange}` }}
      >
        {hotTakes.map((take, i) => (
          <motion.div
            key={i}
            className="relative"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: EASE_OUT }}
            whileHover={reduced || !canHover ? undefined : { y: -3 }}
          >
            <div
              className={`h-full p-6 ${aeonik.className}`}
              style={{ background: i % 2 === 0 ? C.paper : C.white }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <div
                  className="font-black text-4xl leading-none"
                  style={{ color: ACCENT_TEXT }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-[0.16em] text-black/35 ${spaceMono.className}`}>
                  T-{String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <p className={`text-sm font-bold leading-relaxed ${spaceMono.className}`} style={{ color: C.ink }}>
                {take}
              </p>
            </div>
          </motion.div>
        ))}
        {/* fill final cell to complete the grid module */}
        {hotTakes.length % 3 === 2 && (
          <div
            className="relative hidden lg:flex items-center justify-center"
            style={{ background: C.ink }}
            aria-hidden="true"
          >
            <Crosshair size={20} color={accentA(50)} />
          </div>
        )}
      </div>
    </section>
  )
}

