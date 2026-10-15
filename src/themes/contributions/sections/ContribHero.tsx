'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { profile, socials } from '@/data/portfolio'
import { Nav } from '@/themes/contributions/sections/Nav'
import { gsap, ScrollTrigger, WIDE, MOTION_OK } from '@/themes/contributions/parts'
import { ContribCanvas } from '@/themes/contributions/contrib/ContribCanvas'
import { stageOf, type ContribStage } from '@/themes/contributions/contrib/contribStages'
import { TOTAL } from '@/themes/contributions/contrib/grid'
import { CONTRIB_INTRO } from '@/components/ContribLoader'

const HEADLINE = 'AI/ML Engineer'

const STAGES: ContribStage[] = ['Graph', 'MLP', 'CNN']
// What each network is, in a name and two short lines (shown as it morphs).
// The graph stage has no caption or button: it speaks for itself.
const CAPTIONS: Partial<Record<ContribStage, { name: string; line: string }>> = {
  MLP: { name: 'Multilayer perceptron', line: 'Every neuron feeds every neuron in the next layer. It learns patterns in tables of numbers.' },
  CNN: { name: 'Convolutional neural network', line: 'Small filters slide across an image and stack feature maps, from edges up to shapes.' },
}

// ─── HERO (contributions version): SOUNIC drawn in Sounic's real GitHub
// contribution graph. Desktop: pinned while scroll lifts the green cells into
// an MLP, then folds the whole graph into a CNN. Phones pin the whole hero
// too. The stage buttons jump between the three states.
export function ContribHero() {
  const hero = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const trigger = useRef<ScrollTrigger | null>(null)
  const [stage, setStage] = useState<ContribStage>('Graph')

  // The entrance: plays as the loader leaves (its zoom into the graph lands
  // here). The hero is fully visible without it; the class only adds motion,
  // and only when motion is welcome (see .dk-hero--intro in the CSS).
  useEffect(() => {
    const el = hero.current
    if (!el) return
    const play = () => el.classList.add('dk-hero--intro')
    if (window.__contribIntro) return play()
    window.addEventListener(CONTRIB_INTRO, play, { once: true })
    return () => window.removeEventListener(CONTRIB_INTRO, play)
  }, [])

  useEffect(() => {
    const el = hero.current
    if (!el) return
    const update = (p: number) => {
      progress.current = p * 2
      setStage(stageOf(p * 2))
    }
    const mm = gsap.matchMedia()
    mm.add({ wide: WIDE, motion: MOTION_OK }, (ctx) => {
      const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean }
      if (!motion) {
        trigger.current = null
        return
      }
      // The whole hero pins (it fits one screen on phones too) while scroll
      // lifts the name into an MLP and folds the graph into a CNN.
      trigger.current = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: wide ? '+=120%' : '+=110%',
        pin: true,
        anticipatePin: 1,
        scrub: 0.4,
        onUpdate: (s) => update(s.progress),
      })
      return () => {
        trigger.current = null
      }
    })
    return () => mm.revert()
  }, [])

  const goTo = (i: number) => {
    const st = trigger.current
    if (st) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: st.start + ((st.end - st.start) * i) / 2 + 1, behavior: reduce ? 'auto' : 'smooth' })
    } else {
      progress.current = i
      setStage(STAGES[i])
    }
  }

  return (
    <section ref={hero} id="home" className="dk-hero dk-hero--contrib" aria-labelledby="hero-name">
      <Nav />
      <h1 id="hero-name" className="dk-sr">{profile.name}</h1>

      <div className="dk-hero__graph">
        <ContribCanvas progress={progress} />
      </div>

      <div className="dk-graphbar">
        <p className="dk-graphbar__total">
          <span className="dk-num">{TOTAL.toLocaleString('en-US')}</span> contributions in the last year
        </p>
      </div>

      <div className="dk-hero__foot">
        <div className="dk-hero__copy">
          <p className="dk-hero__line">
            {HEADLINE.split(' ').map((w, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span className="dk-word">
                  <span style={{ ['--w' as string]: i }}>{w}</span>
                </span>
              </Fragment>
            ))}
          </p>
          <p className="dk-hero__sent">
            Studying MSc Computer Science at University of Twente
          </p>
          <div className="dk-hero__actions">
            <a className="dk-btn" href={socials.email}>Email me</a>
            <a className="dk-link" href={socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="dk-link" href={socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="dk-link" href={socials.resume} target="_blank" rel="noopener noreferrer">Résumé</a>
          </div>
        </div>
        <div className={`dk-timer dk-timer--contrib${stage === 'Graph' ? '' : ' is-net'}`}>
          {/* The caption box keeps its height on the graph stage, so nothing shifts when a network appears. */}
          <div key={stage} className="dk-caption">
            {CAPTIONS[stage] && (
              <>
                <p className="dk-caption__name">{CAPTIONS[stage].name}</p>
                <p className="dk-caption__line">{CAPTIONS[stage].line}</p>
              </>
            )}
          </div>
          {/* Only while a network is showing: hidden (and out of the tab order) over the name, they rise in with the model. */}
          <div className="dk-timer__steps" role="group" aria-label="Show the network as">
            {STAGES.map((s, i) =>
              i === 0 ? null : (
                <button key={s} type="button" aria-pressed={stage === s} onClick={() => goTo(i)}>
                  {s}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
