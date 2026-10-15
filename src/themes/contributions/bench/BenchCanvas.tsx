'use client'

// The data bench figure: BenchScene plus its loop, look-around controls and
// observers. The page passes the act; this component plays it, writes the
// live readout into `readoutRef` (only when the text changes), and sleeps once
// everything has settled. Look around as in the hero: a small mouse parallax,
// drag (mouse, pen, horizontal touch), arrow keys when focused. Vertical
// touch swipes and the wheel always scroll the page.

import * as React from 'react'
import { LookController } from '../contrib/look'
import { ACT_LABELS, finalReadout, readoutOf } from './acts'
import { BenchScene, type BenchFrame, type Projected } from './BenchScene'
import { MODE_EVENT, type Mode } from '../mode'

const STILLNESS = '(prefers-reduced-motion: reduce)'
const MAX_DPR = 1.75
const AXIS_PX = 8
const ARROWS: Record<string, 'left' | 'right' | 'up' | 'down'> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
}

function webgl2Available(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

export interface BenchCanvasProps {
  act: number
  /** Bumped by the page to replay the current act. */
  run: number
  readoutRef: React.RefObject<HTMLElement | null>
  label: string
  className?: string
}

export function BenchCanvas({ act, run, readoutRef, label, className }: BenchCanvasProps): React.JSX.Element {
  const boxRef = React.useRef<HTMLDivElement>(null)
  const sceneRef = React.useRef<{ setAct: (act: number) => void } | null>(null)
  const actRef = React.useRef(act)
  const labelEls = React.useRef<(HTMLSpanElement | null)[]>([])
  const labelsDirty = React.useRef(true)
  const [failed, setFailed] = React.useState(false)
  const [ring, setRing] = React.useState(false)

  React.useEffect(() => {
    const box = boxRef.current
    if (!box || failed) return
    if (!webgl2Available()) {
      setFailed(true)
      return
    }
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;'
    box.appendChild(canvas)

    let view: BenchScene
    try {
      view = new BenchScene(canvas)
    } catch {
      canvas.remove()
      setFailed(true)
      return
    }
    const look = new LookController()
    const frame: BenchFrame = { dt: 0, motion: true, yaw: 0, pitch: 0 }
    const media = window.matchMedia(STILLNESS)
    let reduced = media.matches
    let raf = 0
    let last = performance.now()
    let inView = false
    let pageVisible = document.visibilityState !== 'hidden'
    let dirty = true
    let busy = true
    let lookMoving = false
    let width = 0
    let height = 0
    let shownText = ''
    let labelVersion = -1
    const P: Projected = { x: 0, y: 0 }
    const labelPos = new Float32Array(8).fill(Number.NaN)
    let started = false // the first act starts when the figure is first seen

    let rectLeft = 0
    let rectTop = 0
    let rectDirty = true
    let ptrPending = false
    let ptrX = 0
    let ptrY = 0
    let ptrHover = false
    let dragDx = 0
    let dragDy = 0
    let dragId: number | null = null
    let lastX = 0
    let lastY = 0
    let touchId: number | null = null
    let touchX0 = 0
    let touchY0 = 0
    let touchAxis: 'x' | 'y' | null = null

    const writeReadout = () => {
      const el = readoutRef.current
      if (!el) return
      const text = reduced ? finalReadout(view.currentAct) : readoutOf(view.currentAct, view.actTime)
      if (text !== shownText) {
        shownText = text
        el.textContent = text
      }
    }

    // Labels follow their anchors; the DOM is touched only when a rounded position changes.
    const placeLabels = () => {
      if (labelsDirty.current) {
        labelsDirty.current = false
        labelPos.fill(Number.NaN)
      } else if (view.viewVersion === labelVersion) return
      labelVersion = view.viewVersion
      const defs = ACT_LABELS[actRef.current]
      for (let k = 0; k < defs.length; k++) {
        const el = labelEls.current[k]
        if (!el) continue
        const d = defs[k]
        view.project(d.x, d.y, d.z, P)
        const x = Math.round(P.x)
        const y = Math.round(P.y)
        if (x === labelPos[2 * k] && y === labelPos[2 * k + 1]) continue
        labelPos[2 * k] = x
        labelPos[2 * k + 1] = y
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
    }

    const draw = (dt: number, now: number) => {
      lookMoving = look.update(dt, now, !reduced)
      frame.dt = dt
      frame.motion = !reduced
      frame.yaw = look.yaw
      frame.pitch = look.pitch
      busy = view.render(frame)
      placeLabels()
      writeReadout()
      dirty = false
    }

    const applyPointer = (now: number) => {
      if (dragDx || dragDy) {
        look.drag(dragDx, dragDy, now)
        dragDx = dragDy = 0
        dirty = true
      }
      if (!ptrPending) return
      ptrPending = false
      dirty = true
      if (rectDirty) {
        const r = box.getBoundingClientRect()
        rectLeft = r.left
        rectTop = r.top
        rectDirty = false
      }
      if (ptrHover && width > 0 && height > 0) look.setParallax(((ptrX - rectLeft) / width) * 2 - 1, ((ptrY - rectTop) / height) * 2 - 1)
      else look.setParallax(null, null)
    }

    const tick = (now: number) => {
      raf = 0
      const dt = Math.min(0.1, Math.max(0, (now - last) / 1000))
      last = now
      applyPointer(now)
      if (dirty || busy || lookMoving || look.idleDue(now)) draw(dt, now)
      const settled = !dirty && !busy && !lookMoving && !ptrPending && !dragDx && !dragDy
      if (!settled) schedule()
    }

    const running = () => inView && pageVisible
    const schedule = () => {
      if (!raf && running()) raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!running() || raf) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const halt = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    const resume = () => {
      if (!running()) return halt()
      dirty = true
      wake()
    }

    sceneRef.current = {
      setAct: (next: number) => {
        if (dragId !== null) releaseDrag(false)
        look.home(reduced)
        view.setAct(next, reduced)
        dirty = true
        wake()
      },
    }

    const resize = () => {
      width = box.clientWidth
      height = box.clientHeight
      rectDirty = true
      look.setWidth(width)
      view.resize(width, height, Math.min(window.devicePixelRatio || 1, MAX_DPR))
      dirty = true
      if (running() && width > 0 && height > 0) draw(0, performance.now())
      wake()
    }
    // Light / dark: recolour and repaint now, so a view transition captures the new frame.
    const onMode = (e: Event) => {
      view.setMode((e as CustomEvent<Mode>).detail)
      dirty = true
      if (running() && width > 0 && height > 0) draw(0, performance.now())
      wake()
    }
    window.addEventListener(MODE_EVENT, onMode)
    const ro = new ResizeObserver(resize)
    ro.observe(box)
    resize()

    const io = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1]?.isIntersecting ?? true
      if (inView && !started) {
        // Play the current act from the top the first time it is seen.
        started = true
        view.setAct(actRef.current, reduced)
      }
      resume()
    }, { threshold: 0.2 })
    io.observe(box)

    const onVisibility = () => {
      pageVisible = document.visibilityState !== 'hidden'
      resume()
    }
    document.addEventListener('visibilitychange', onVisibility)
    const onMotionPref = () => {
      reduced = media.matches
      look.home(true)
      if (reduced) view.setAct(view.currentAct, true)
      dirty = true
      wake()
    }
    media.addEventListener('change', onMotionPref)
    const onScroll = () => {
      rectDirty = true
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    function releaseDrag(inertia: boolean) {
      const id = dragId
      dragId = null
      if (id !== null) {
        try {
          if (box!.hasPointerCapture(id)) box!.releasePointerCapture(id)
        } catch {
          // already gone
        }
      }
      if (dragDx || dragDy) look.drag(dragDx, dragDy, performance.now())
      dragDx = dragDy = 0
      look.endDrag(performance.now(), inertia)
      box!.style.cursor = 'grab'
      dirty = true
    }
    const startDrag = (e: PointerEvent) => {
      dragId = e.pointerId
      lastX = e.clientX
      lastY = e.clientY
      dragDx = dragDy = 0
      look.beginDrag(performance.now())
      try {
        box.setPointerCapture(e.pointerId)
      } catch {
        // the drag still works over the box
      }
      box.style.cursor = 'grabbing'
      dirty = true
    }
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        if (touchId !== e.pointerId) return
        if (touchAxis === null) {
          const dx = e.clientX - touchX0
          const dy = e.clientY - touchY0
          if (Math.hypot(dx, dy) < AXIS_PX) return
          touchAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
          if (touchAxis === 'x') {
            startDrag(e)
            lastX = touchX0
            lastY = touchY0
          }
        }
        if (touchAxis === 'x' && dragId === e.pointerId) {
          dragDx += e.clientX - lastX
          lastX = e.clientX
          wake()
        }
        return
      }
      ptrHover = true
      ptrX = e.clientX
      ptrY = e.clientY
      ptrPending = true
      if (dragId === e.pointerId) {
        dragDx += e.clientX - lastX
        dragDy += e.clientY - lastY
        lastX = e.clientX
        lastY = e.clientY
      }
      wake()
    }
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || dragId === e.pointerId) return
      ptrHover = false
      ptrPending = true
      wake()
    }
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        touchId = e.pointerId
        touchX0 = e.clientX
        touchY0 = e.clientY
        touchAxis = null
        return
      }
      ptrHover = true
      ptrX = e.clientX
      ptrY = e.clientY
      ptrPending = true
      if (e.button === 0) startDrag(e)
      wake()
    }
    const onPointerEnd = (e: PointerEvent) => {
      if (touchId === e.pointerId) touchId = null
      if (dragId === e.pointerId) releaseDrag(e.type === 'pointerup' && !reduced)
      wake()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const dir = ARROWS[e.key]
      if (!dir || e.altKey || e.ctrlKey || e.metaKey) return
      e.preventDefault()
      look.step(dir, performance.now(), reduced)
      dirty = true
      wake()
    }
    const passive = { passive: true } as const
    box.addEventListener('pointermove', onPointerMove, passive)
    box.addEventListener('pointerleave', onPointerLeave, passive)
    box.addEventListener('pointerdown', onPointerDown, passive)
    box.addEventListener('pointerup', onPointerEnd, passive)
    box.addEventListener('pointercancel', onPointerEnd, passive)
    box.addEventListener('keydown', onKeyDown)
    const onContextLost = () => setFailed(true)
    canvas.addEventListener('webglcontextlost', onContextLost)
    box.style.cursor = 'grab'
    box.style.touchAction = 'pan-y'

    return () => {
      sceneRef.current = null
      halt()
      window.removeEventListener(MODE_EVENT, onMode)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      media.removeEventListener('change', onMotionPref)
      window.removeEventListener('scroll', onScroll)
      box.removeEventListener('pointermove', onPointerMove)
      box.removeEventListener('pointerleave', onPointerLeave)
      box.removeEventListener('pointerdown', onPointerDown)
      box.removeEventListener('pointerup', onPointerEnd)
      box.removeEventListener('pointercancel', onPointerEnd)
      box.removeEventListener('keydown', onKeyDown)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      box.style.cursor = ''
      box.style.touchAction = ''
      view.dispose()
      canvas.remove()
    }
  }, [failed, readoutRef])

  // A new act (or a replay of the same one) from the page.
  React.useEffect(() => {
    actRef.current = act
    labelsDirty.current = true
    sceneRef.current?.setAct(act)
  }, [act, run])

  // Without WebGL the readout still states the act's result.
  React.useEffect(() => {
    if (failed && readoutRef.current) readoutRef.current.textContent = finalReadout(act)
  }, [failed, act, readoutRef])

  const labels = failed ? [] : ACT_LABELS[act]
  return (
    <>
      <div
        ref={boxRef}
        className={className}
        tabIndex={failed ? -1 : 0}
        role={failed ? undefined : 'application'}
        aria-roledescription={failed ? undefined : '3D figure'}
        aria-label={failed ? undefined : `${label}. Use the arrow keys to look around`}
        onFocus={(e) => setRing(e.currentTarget.matches(':focus-visible'))}
        onBlur={() => setRing(false)}
        style={{ position: 'absolute', inset: 0, outline: ring ? '2px solid var(--amber)' : 'none', outlineOffset: -2, borderRadius: 'inherit' }}
      />
      <div className="dk-bench__labels" aria-hidden="true">
        {labels.map((l, k) => (
          <span
            key={`${act}-${run}-${k}`}
            ref={(el) => {
              labelEls.current[k] = el
            }}
            className={`dk-bench__label dk-bench__label--${l.align}`}
          >
            <span className="dk-bench__label-full">{l.text}</span>
            <span className="dk-bench__label-short">{l.short}</span>
          </span>
        ))}
      </div>
    </>
  )
}
