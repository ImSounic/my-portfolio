'use client'

import { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { profile, education, languages, creative, gaming } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT_TEXT, ON_ACCENT, accentA, SPRING, canHover, C } from '@/themes/brutalist/tokens'
import { FrameTag } from '@/themes/brutalist/primitives/FrameTag'
import { SectionHeader } from '@/themes/brutalist/primitives/SectionHeader'
import { Tape } from '@/themes/brutalist/primitives/Tape'
import { Parallax } from '@/themes/brutalist/motion/Parallax'
import { SplitReveal } from '@/themes/brutalist/motion/SplitReveal'

// ─── ABOUT / ZINE CLIPPINGS ──────────────────────────────────────
export function AboutSection() {
  const reduced = useReducedMotion()
  const [stickerCount, setStickerCount] = useState(0)
  const dragRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="about"
      className="py-12 sm:py-20 px-4 sm:px-6 overflow-x-hidden"
      style={{ background: C.paper }}
      ref={dragRef}
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeader index="D-02" title="ABOUT" tag="SECTION / OPERATOR FILE" />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Summary clipping */}
          <Parallax distance={28}>
          <motion.div
            className="relative"
            style={{ rotate: -1.2 }}
            whileHover={reduced || !canHover ? undefined : { rotate: 0 }}
            transition={SPRING}
          >
            <Tape angle={2} />
            <div
              className={`border-[2px] border-black p-7 ${aeonik.className}`}
              style={{ background: C.white, boxShadow: '7px 7px 0 #000' }}
            >
              <FrameTag color={ACCENT_TEXT}>WHO I AM</FrameTag>
              <p className={`mt-3 text-sm font-bold leading-relaxed ${spaceMono.className}`} style={{ color: C.ink }}>
                {profile.summary}
              </p>
            </div>
          </motion.div>
          </Parallax>

          <div className="flex flex-col gap-8">
            {/* Education clipping */}
            <Parallax distance={16}>
            <motion.div
              className="relative"
              style={{ rotate: 1.4 }}
              whileHover={reduced || !canHover ? undefined : { rotate: 0 }}
              transition={SPRING}
            >
              <Tape angle={-4} color={accentA(30)} />
              <div
                className={`border-[2px] border-black p-6 ${aeonik.className}`}
                style={{ background: C.white, boxShadow: `6px 6px 0 ${C.orange}` }}
              >
                <FrameTag color={ACCENT_TEXT}>EDUCATION</FrameTag>
                <div className="flex flex-col gap-4 mt-4">
                  {education.map((ed, i) => (
                    <div
                      key={ed.degree}
                      className={i < education.length - 1 ? 'pb-4 border-b-[1px] border-black/15' : ''}
                    >
                      <div className={`font-black text-sm leading-snug text-black ${aeonik.className}`}>
                        {ed.degree}
                      </div>
                      <div className={`text-xs font-bold text-black/55 mt-0.5 ${spaceMono.className}`}>
                        {ed.school}
                      </div>
                      <div
                        className={`inline-block mt-1.5 border-[1px] border-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${spaceMono.className}`}
                      >
                        {ed.period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            </Parallax>

            {/* Languages */}
            <div
              className={`border-[2px] border-black p-5 ${aeonik.className}`}
              style={{ background: C.white, boxShadow: '5px 5px 0 #000', rotate: '-0.8deg' }}
            >
              <FrameTag color="rgba(10,10,10,0.55)">LANGUAGES</FrameTag>
              <div className="flex flex-wrap gap-2 mt-3">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className={`border-[1px] border-black px-3 py-1 ${spaceMono.className}`}
                    style={{
                      background: lang.level === 'Native' ? C.orange : C.white,
                      color: lang.level === 'Native' ? ON_ACCENT : C.ink,
                    }}
                  >
                    <span className="font-black text-xs uppercase tracking-wide">{lang.name}</span>
                    <span className="ml-2 text-xs opacity-70 font-bold">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Creative + Gaming - single accent, no blue */}
        <div className="mt-16 grid sm:grid-cols-2 gap-8">
          {[
            { data: creative, rot: -2.2, code: 'C-01' },
            { data: gaming,   rot:  1.9, code: 'C-02' },
          ].map(({ data, rot, code }, i) => (
            <Parallax key={data.title} distance={i === 0 ? 22 : 36}>
            <motion.div
              className="relative h-full"
              style={{ rotate: rot }}
              whileHover={reduced || !canHover ? undefined : { rotate: 0, scale: 1.01 }}
              transition={SPRING}
            >
              <Tape angle={rot * 1.5} color={accentA(28)} />
              <div
                className={`border-[2px] border-black p-7 h-full ${aeonik.className}`}
                style={{ background: C.white, boxShadow: `7px 7px 0 ${C.orange}` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <SplitReveal
                    as="div"
                    text={data.title}
                    mode="words"
                    className="font-black text-lg uppercase leading-tight"
                    style={{ color: ACCENT_TEXT }}
                  />
                  <span className={`text-[9px] font-bold tracking-[0.16em] text-black/35 shrink-0 ml-3 ${spaceMono.className}`}>
                    {code}
                  </span>
                </div>
                <p className={`text-sm font-bold leading-relaxed ${spaceMono.className}`} style={{ color: C.ink }}>
                  {data.body}
                </p>
              </div>
            </motion.div>
            </Parallax>
          ))}
        </div>

        {/* Easter egg: draggable sticker with click counter - no emoji */}
        <motion.button
          drag={!reduced}
          dragConstraints={dragRef}
          dragMomentum={false}
          onClick={() => setStickerCount((n) => n + 1)}
          className={`mt-10 inline-flex items-center gap-2 border-[2px] border-black px-5 py-3 font-black text-xs uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bz-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${spaceMono.className}`}
          style={{
            background: stickerCount > 0 ? C.orange : C.white,
            color: stickerCount > 0 ? ON_ACCENT : C.ink,
            boxShadow: '5px 5px 0 #000',
            rotate: 3,
            cursor: reduced ? 'pointer' : 'grab',
          }}
          whileDrag={{ cursor: 'grabbing' }}
          title="Drag me around"
          aria-label="Interactive sticker, drag or click"
        >
          <span aria-hidden>{'>>>'}</span>
          {stickerCount === 0
            ? 'DRAG ME · CLICK ME'
            : `LOGGED ${stickerCount} INPUT${stickerCount !== 1 ? 'S' : ''}`}
        </motion.button>
      </div>
    </section>
  )
}

