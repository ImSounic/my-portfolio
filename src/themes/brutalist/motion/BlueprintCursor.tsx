'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { spaceMono } from '@/themes/fonts'
import { canHover, ACCENT, ON_ACCENT, C } from '@/themes/brutalist/tokens'

const TARGETS = 'button, a, [role="button"], [data-cursor]'
const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0')

// Drafting-table cursor. Two dashed guides cross at the pointer with a live
// X / Y / section readout beside an ink nib. Over anything interactive the
// guides split into four and snap to the element's box, and the readout
// becomes the element's data-cursor label. Pointer devices only.
export function BlueprintCursor() {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const readRef = useRef<HTMLSpanElement>(null)
  const shown = useRef(false)
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const l = useMotionValue(-100)
  const r = useMotionValue(-100)
  const t = useMotionValue(-100)
  const b = useMotionValue(-100)
  const nib = { stiffness: 900, damping: 50, mass: 0.3 }
  const guide = { stiffness: 340, damping: 34, mass: 0.5 }
  const sx = useSpring(x, nib)
  const sy = useSpring(y, nib)
  const sl = useSpring(l, guide)
  const sr = useSpring(r, guide)
  const st = useSpring(t, guide)
  const sb = useSpring(b, guide)
  const px = reduced ? x : sx
  const py = reduced ? y : sy
  const pl = reduced ? l : sl
  const pr = reduced ? r : sr
  const pt = reduced ? t : st
  const pb = reduced ? b : sb

  useEffect(() => {
    if (!canHover) return
    let host: HTMLElement | null = null

    const setGuides = () => {
      if (host) {
        const rc = host.getBoundingClientRect()
        l.set(rc.left)
        r.set(rc.right)
        t.set(rc.top)
        b.set(rc.bottom)
      } else {
        l.set(x.get())
        r.set(x.get())
        t.set(y.get())
        b.set(y.get())
      }
    }
    const setHost = (next: HTMLElement | null) => {
      if (next === host) return
      host = next
      setLabel(host?.dataset.cursor ?? null)
      rootRef.current?.setAttribute('data-snapped', host ? '1' : '0')
      setGuides()
    }
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!host) setGuides()
      const read = readRef.current
      if (read) {
        const region = document.elementFromPoint(e.clientX, e.clientY)?.closest('section, footer, nav') as HTMLElement | null
        const name = region?.id || (region ? region.tagName.toLowerCase() : 'home')
        read.textContent = `X ${pad(e.clientX)} · Y ${pad(e.clientY)} · ${name.toUpperCase()}`
      }
      if (!shown.current) {
        shown.current = true
        setVisible(true)
      }
    }
    const over = (e: MouseEvent) => {
      setHost(((e.target as Element | null)?.closest?.(TARGETS) as HTMLElement | null) ?? null)
    }
    const out = (e: MouseEvent) => {
      if (e.relatedTarget) return
      shown.current = false
      setVisible(false)
      setHost(null)
    }
    const scroll = () => {
      if (!host) return
      const under = document.elementFromPoint(x.get(), y.get())
      if (!under || !host.contains(under)) setHost(null)
      else setGuides()
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    window.addEventListener('mouseout', out)
    window.addEventListener('scroll', scroll, { passive: true, capture: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mouseout', out)
      window.removeEventListener('scroll', scroll, { capture: true })
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [x, y, l, r, t, b])

  if (!canHover) return null

  const line = 'absolute border-dashed border-white'
  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
      data-blueprint-cursor
      data-snapped="0"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 160ms ease-out' }}
    >
      {/* Guides: difference-blended so they read on paper, ink and the accent fields */}
      <div className="absolute inset-0" style={{ mixBlendMode: 'difference', opacity: 0.85 }}>
        <motion.div className={`${line} top-0 bottom-0 w-0 border-l`} style={{ x: pl }} />
        <motion.div className={`${line} top-0 bottom-0 w-0 border-l`} style={{ x: pr }} />
        <motion.div className={`${line} left-0 right-0 h-0 border-t`} style={{ y: pt }} />
        <motion.div className={`${line} left-0 right-0 h-0 border-t`} style={{ y: pb }} />
      </div>

      {/* Nib */}
      <motion.div className="absolute top-0 left-0" style={{ x: px, y: py }}>
        <div
          style={{
            width: 12,
            height: 12,
            background: C.ink,
            border: `2px solid ${C.paper}`,
            transform: `translate(-50%, -50%) rotate(45deg) scale(${pressed ? 0.55 : 1})`,
            transition: 'transform 120ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />
      </motion.div>

      {/* Readout, or the action label over a target */}
      <motion.div className="absolute top-0 left-0" style={{ x: px, y: py }}>
        <div style={{ transform: 'translate(16px, 14px)' }}>
          {label ? (
            <span
              className={`inline-block border-[2px] border-black px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap ${spaceMono.className}`}
              style={{ background: ACCENT, color: ON_ACCENT, boxShadow: '3px 3px 0 #000' }}
            >
              {label}
            </span>
          ) : (
            <span
              ref={readRef}
              className={`inline-block border border-black px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] whitespace-nowrap ${spaceMono.className}`}
              style={{ background: C.paper, color: C.ink }}
            >
              X 0000 · Y 0000 · HOME
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
