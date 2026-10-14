"use client";

// Sounic's GitHub contribution graph, with SOUNIC lettered across it, that
// tilts into 3D as the page scrolls: the letter cells lift off and become an
// MLP, then every cell folds into a CNN. The page's ScrollTrigger writes 0..2
// into `progress`; this component eases toward it every frame. One effect owns
// the canvas, the three.js scene (scene.ts), the loop and every observer.
//
// The canvas is created inside the effect (not in JSX) so a remount, including
// React's dev double-invoke, always gets a fresh canvas: a canvas whose context
// was force-lost cannot hand out a working context again.

import * as React from "react";
import { ContribFallback } from "./ContribFallback";
import { contribStageIndex } from "./contribStages";
import { ContribScene, STILL_TIME } from "./scene";

const STILLNESS = "(prefers-reduced-motion: reduce)";
const MAX_DPR = 1.75;
const FOLLOW_RATE = 5; // 1/s: exponential follow toward progress (time constant 0.2 s)
const TAP_MS = 1100; // how long a touch keeps its area lit

export interface ContribCanvasProps {
  /** 0..2 (0 contribution graph, 1 MLP, 2 CNN), written by the page; read every frame. */
  progress: React.MutableRefObject<number>;
  className?: string;
}

const clampProgress = (p: number) => (Number.isFinite(p) ? Math.min(2, Math.max(0, p)) : 0);

// three 0.182 needs WebGL2. Probe on a throwaway canvas first so an unsupported
// browser goes straight to the SVG graph instead of three logging a context error.
function webgl2Available(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function ContribCanvas({ progress, className }: ContribCanvasProps): React.JSX.Element {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (failed) return;
    const box = boxRef.current;
    const host = hostRef.current;
    if (!box || !host) return;
    if (!webgl2Available()) {
      setFailed(true);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    host.appendChild(canvas);

    let view: ContribScene;
    try {
      view = new ContribScene(canvas);
    } catch {
      canvas.remove();
      setFailed(true);
      return;
    }

    const media = window.matchMedia(STILLNESS);
    let reduced = media.matches;
    let t = clampProgress(progress.current);
    let clock = 0;
    let last = performance.now();
    let raf = 0;
    let inView = true;
    let pageVisible = document.visibilityState !== "hidden";
    let dirty = true; // something changed since the last frame: draw once
    let busy = true; // the scene asked for another frame (pulses, breathing, easing glow)
    let shownStage = -1;
    let tapUntil = 0;

    const draw = (dt: number) => {
      if (reduced) {
        const idx = contribStageIndex(progress.current);
        t = idx;
        shownStage = idx;
        busy = view.render({ t: idx, time: STILL_TIME, dt, motion: false });
      } else {
        busy = view.render({ t, time: clock, dt, motion: true });
      }
      dirty = false;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
      last = now;
      if (tapUntil && now > tapUntil) {
        tapUntil = 0;
        view.setPointer(0, 0, 0);
        dirty = true;
      }
      if (reduced) {
        if (dirty || busy || contribStageIndex(progress.current) !== shownStage) draw(dt);
      } else {
        const target = clampProgress(progress.current);
        const settled = t === target;
        t += (target - t) * (1 - Math.exp(-dt * FOLLOW_RATE));
        if (Math.abs(target - t) < 1e-4) t = target;
        clock += dt;
        // The flat graph at rest has nothing to animate: skip frames until
        // scroll or the pointer changes something.
        if (dirty || busy || !settled) draw(dt);
      }
      schedule();
    };

    const running = () => inView && pageVisible;
    const schedule = () => {
      if (!raf && running()) raf = requestAnimationFrame(tick);
    };
    const halt = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const resume = () => {
      if (!running()) return halt();
      if (!raf) last = performance.now();
      dirty = true;
      schedule();
    };

    const resize = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      view.resize(w, h, Math.min(window.devicePixelRatio || 1, MAX_DPR));
      dirty = true;
      // Resizing clears the canvas; repaint now so there is no blank frame.
      if (running() && w > 0 && h > 0) draw(0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();

    const io = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1]?.isIntersecting ?? true;
      resume();
    });
    io.observe(box);

    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      resume();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionPref = () => {
      reduced = media.matches;
      t = clampProgress(progress.current);
      dirty = true;
    };
    media.addEventListener("change", onMotionPref);

    const local = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const [x, y] = local(e);
      view.setPointer(x, y, 1);
      dirty = true;
    };
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      view.setPointer(0, 0, 0);
      dirty = true;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const [x, y] = local(e);
      view.setPointer(x, y, 1);
      tapUntil = performance.now() + TAP_MS;
      dirty = true;
    };
    // Passive and never preventDefault: the canvas must not hold up page scroll.
    const passive = { passive: true } as const;
    box.addEventListener("pointermove", onPointerMove, passive);
    box.addEventListener("pointerleave", onPointerLeave, passive);
    box.addEventListener("pointerdown", onPointerDown, passive);

    const onContextLost = () => setFailed(true);
    canvas.addEventListener("webglcontextlost", onContextLost);

    schedule();

    return () => {
      halt();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", onMotionPref);
      box.removeEventListener("pointermove", onPointerMove);
      box.removeEventListener("pointerleave", onPointerLeave);
      box.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      view.dispose();
      canvas.remove();
    };
  }, [failed, progress]);

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <div ref={boxRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
        <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />
        {failed ? <ContribFallback /> : null}
      </div>
    </div>
  );
}
