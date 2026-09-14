'use client'

import type { ReactNode } from 'react'
import { manifesto, hotTakes } from '@/data/portfolio'
import { aeonik, spaceMono } from '@/themes/fonts'
import { ACCENT_TEXT, C } from '@/themes/brutalist/tokens'
import { SplitReveal } from '@/themes/brutalist/motion/SplitReveal'
import { Crosshair } from '@/themes/brutalist/primitives/Crosshair'

// ─── PLAYBOOK ────────────────────────────────────────────────────
// The manifesto's first sentence as a statement, then the six takes as a
// numbered sequence: numeral column on the left, title and body on the right.

const firstStop = manifesto.indexOf('. ')
const statement = manifesto.slice(0, firstStop + 1)
const remainder = manifesto.slice(firstStop + 2)

// The copy marks emphasis with *asterisks*; render those as accent-coloured.
const withEmphasis = (text: string): ReactNode[] =>
  text.split('*').map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="not-italic" style={{ color: ACCENT_TEXT }}>
        {part}
      </em>
    ) : (
      part
    ),
  )

export function PlaybookSection() {
  return (
    <section id="playbook" className="overflow-x-hidden" style={{ background: C.paper, color: C.ink }}>
      {/* Statement */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SplitReveal
          as="h2"
          text={statement}
          mode="lines"
          className={`font-black uppercase leading-[0.92] ${aeonik.className}`}
          style={{ fontSize: 'clamp(36px, 7.2vw, 108px)', letterSpacing: '-0.04em', maxWidth: '14ch', textWrap: 'balance' }}
        />
        <p
          className={`mt-8 max-w-[62ch] text-base sm:text-lg font-bold leading-relaxed ${spaceMono.className}`}
          style={{ textWrap: 'pretty' }}
        >
          {withEmphasis(remainder)}
        </p>
      </div>

      {/* Sequence */}
      <div className="border-t-[3px] border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-end justify-between gap-4 flex-wrap">
          <SplitReveal
            as="h3"
            text="PLAYBOOK"
            mode="words"
            className={`font-black uppercase leading-none ${aeonik.className}`}
            style={{ fontSize: 'clamp(28px, 5vw, 64px)', letterSpacing: '-0.04em' }}
          />
          <span
            className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${spaceMono.className}`}
            style={{ color: 'rgba(10,10,10,0.55)' }}
          >
            <Crosshair size={9} color={C.orange} />
            {hotTakes.length} takes, each backed by work
          </span>
        </div>

        <ol className="border-t-[2px] border-black">
          {hotTakes.map((take, i) => (
            <li
              key={take.title}
              className="border-b-[2px] border-black"
              style={{ background: i % 2 === 0 ? C.paper : C.white }}
            >
              <div className="max-w-6xl mx-auto grid md:grid-cols-[minmax(120px,220px)_1fr] gap-x-10 px-4 sm:px-6 py-8 sm:py-12">
                <div className="md:sticky md:top-24 self-start">
                  <span
                    aria-hidden="true"
                    className={`block font-black leading-none ${aeonik.className}`}
                    style={{ fontSize: 'clamp(56px, 9vw, 140px)', letterSpacing: '-0.04em', color: ACCENT_TEXT }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-4 md:mt-2">
                  <SplitReveal
                    as="h4"
                    text={take.title.toUpperCase()}
                    mode="words"
                    stagger={0.08}
                    className={`font-black uppercase leading-[0.95] ${aeonik.className}`}
                    style={{ fontSize: 'clamp(24px, 3.2vw, 44px)', letterSpacing: '-0.03em' }}
                  />
                  <p
                    className={`mt-4 max-w-[62ch] text-sm sm:text-base font-bold leading-relaxed ${spaceMono.className}`}
                    style={{ textWrap: 'pretty' }}
                  >
                    {take.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
