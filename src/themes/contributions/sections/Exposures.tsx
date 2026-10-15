'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { EXPOSURES } from '@/themes/contributions/data'
import { BenchCanvas } from '@/themes/contributions/bench/BenchCanvas'

export const ACT_SECONDS = 8

// ─── After the hero: the data bench. Four problems from projects I shipped,
// acted out in 3D by the same cells as the graph. The acts advance every
// 8 seconds (a CSS animation on the active bar, so no timer loop); the bar
// holds while the bench is hovered or focused, off screen or the tab is
// hidden, and under reduced motion acts only change on click.
export function Exposures() {
  const [act, setAct] = useState(0)
  const [run, setRun] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLSpanElement>(null)
  const hold = useRef({ hover: false, focus: false, offscreen: true })

  const applyHold = useCallback(() => {
    const h = hold.current
    stage.current?.classList.toggle('is-held', h.hover || h.focus || h.offscreen)
  }, [])

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      hold.current.offscreen = !e.isIntersecting
      applyHold()
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [applyHold])

  const choose = (i: number) => {
    setAct(i)
    setRun((r) => r + 1)
  }
  const next = () => setAct((a) => (a + 1) % EXPOSURES.length)
  const current = EXPOSURES[act]

  return (
    <section className="dk-section" aria-labelledby="expo-title">
      <h2 id="expo-title" className="dk-expo__title" data-reveal>
        Most of my work lives at the unglamorous end.
      </h2>
      <p className="dk-expo__lede" data-reveal style={{ ['--i' as string]: 1 }}>
        A model is only as honest as the data under it. Four problems from projects I shipped, played out in the same squares as the graph above.
      </p>

      <div
        ref={stage}
        className="dk-bench is-held"
        style={{ ['--act-s' as string]: `${ACT_SECONDS}s` }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'touch') return
          hold.current.hover = true
          applyHold()
        }}
        onPointerLeave={() => {
          hold.current.hover = false
          applyHold()
        }}
        onFocus={() => {
          hold.current.focus = true
          applyHold()
        }}
        onBlur={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return
          hold.current.focus = false
          applyHold()
        }}
      >
        <figure className="dk-bench__fig" data-reveal style={{ ['--i' as string]: 1 }}>
          <BenchCanvas act={act} run={run} readoutRef={readout} label={`${current.name}: ${current.big} ${current.body}`} className="dk-bench__canvas" />
          <figcaption className="dk-bench__cap">
            <span className="dk-bench__hint">
              <span className="dk-bench__hint--pointer">Drag to look around</span>
              <span className="dk-bench__hint--touch">Swipe sideways to turn</span>
            </span>
            <span ref={readout} className="dk-bench__readout dk-num" />
          </figcaption>
        </figure>

        <ol className="dk-bench__acts" aria-label="Problems">
          {EXPOSURES.map((e, i) => (
            <li key={e.key} data-reveal style={{ ['--i' as string]: i + 2 }}>
              <button type="button" className="dk-bench__act" aria-pressed={i === act} onClick={() => choose(i)}>
                <span className="dk-bench__top">
                  <span className="dk-bench__mark" aria-hidden="true" />
                  <span className="dk-bench__big dk-num">{e.big}</span>
                </span>
                <span className="dk-bench__body">{e.body}</span>
                <span className="dk-bench__from">{e.from}</span>
                <span className="dk-bench__track" aria-hidden="true">
                  {i === act && <span key={`${act}-${run}`} className="dk-bench__bar" onAnimationEnd={next} />}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
