'use client'

import { motion, useReducedMotion } from 'motion/react'
import { skills } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { EASE_OUT, C } from '@/themes/brutalist/tokens'
import { SectionHeader } from '@/themes/brutalist/primitives/SectionHeader'
import { Counter } from '@/themes/brutalist/motion/Counter'

// ─── SKILLS ──────────────────────────────────────────────────────
export function SkillsSection() {
  const reduced = useReducedMotion()

  return (
    <section
      id="skills"
      className="py-12 sm:py-20 px-4 sm:px-6 overflow-x-hidden"
      style={{ background: C.ink }}
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeader index="D-03" title="SKILLS" tag="SECTION / STACK" onDark />

        {/* Skills grid - modular hairline grid (gap:1px on black) */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 1, background: C.paper, border: `1px solid ${C.paper}` }}
        >
          {skills.map((group, gi) => (
            <motion.div
              key={group.category}
              className="relative"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (gi % 3) * 0.06, ease: EASE_OUT }}
            >
              <div
                className={`h-full p-5 ${aeonik.className}`}
                style={{ background: C.white }}
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b-[1px] border-black">
                  <div
                    className={`text-[10px] font-black uppercase tracking-[0.16em] ${spaceMono.className}`}
                    style={{ color: C.ink }}
                  >
                    {group.category}
                  </div>
                  <span className={`text-[9px] font-bold tracking-[0.16em] text-black/45 ${spaceMono.className}`}>
                    <Counter value={group.items.length} format={(n) => String(n).padStart(2, '0')} /> ITEMS
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className={`border-[1px] border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0_#000] ${spaceMono.className}`}
                      style={{ background: C.paper, color: C.ink }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

