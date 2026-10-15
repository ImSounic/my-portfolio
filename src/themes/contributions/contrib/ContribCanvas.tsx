"use client";

// Sounic's GitHub contribution graph, with SOUNIC lettered across it, that
// tilts into 3D as the page scrolls: the letter cells lift off and become an
// MLP, then every cell folds into a CNN. The page's ScrollTrigger writes 0..2
// into `progress`; this component eases toward it every frame. One effect owns
// the canvas, the three.js scene (scene.ts), the loop, the layer labels
// (labelOverlay.ts), the look-around controls (look.ts) and every observer.
//
// In the network stages the model can be looked around: a small mouse
// parallax, drag to rotate (mouse and pen; horizontal touch drags), arrow keys
// when focused. Vertical touch swipes and the wheel always scroll the page.
//
// The canvas is created inside the effect (not in JSX) so a remount, including
// React's dev double-invoke, always gets a fresh canvas: a canvas whose context
// was force-lost cannot hand out a working context again.

import * as React from "react";
import { ContribFallback } from "./ContribFallback";
import { contribStageIndex } from "./contribStages";
import { LabelOverlay } from "./labelOverlay";
import { buildLayerLabels } from "./layers";
import { LookController } from "./look";
import { ContribScene, STILL_TIME, type FrameState, type Projected } from "./scene";
import { CONTRIB_INTRO } from "@/components/ContribLoader";

const STILLNESS = "(prefers-reduced-motion: reduce)";
const MAX_DPR = 1.75;
const FOLLOW_RATE = 5; // 1/s: exponential follow toward progress (time constant 0.2 s)
const TAP_MS = 1100; // how long a touch keeps its area lit
const WATCHDOG_MS = 200; // while asleep: how often to check for progress written without a scroll event
const AXIS_PX = 8; // a touch decides between rotate (horizontal) and scroll after this much travel
const FOCUS_RING = "#39d353";
const DROP_LEAD_MS = 140; // the loader's zoom is under way before the squares fall
const DROP_FALLBACK_MS = 9000; // no loader handover: fall anyway
const MODEL_LABEL = "3D model of the network. Use the arrow keys to look around";

const LABELS = buildLayerLabels();
const NETWORK_NAMES = ["", "MLP", "CNN"] as const;

const VISUALLY_HIDDEN: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

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

const ARROWS: Record<string, "left" | "right" | "up" | "down"> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};

export function ContribCanvas({ progress, className }: ContribCanvasProps): React.JSX.Element {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [failed, setFailed] = React.useState(false);
  // Stage nearest the eased progress (0 graph, 1 MLP, 2 CNN): drives focusability and the SR list.
  const [stage, setStage] = React.useState<0 | 1 | 2>(0);
  const [ring, setRing] = React.useState(false);

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
    const labels = new LabelOverlay(host, LABELS);
    const look = new LookController();
    const project = (x: number, y: number, z: number, out: Projected) => view.project(x, y, z, out);
    // One frame-state object, mutated per frame (no allocation in the loop).
    const frameState: FrameState = { t: 0, time: 0, dt: 0, motion: true, look, drop: -1 };

    const media = window.matchMedia(STILLNESS);
    let reduced = media.matches;
    let t = clampProgress(progress.current);
    let clock = 0;
    let last = performance.now();
    let raf = 0;
    let watchdog = 0;
    let inView = true;
    let pageVisible = document.visibilityState !== "hidden";
    let dirty = true; // something changed since the last frame: draw once
    let busy = true; // the scene asked for another frame (pulses, breathing, easing glow)
    let lookMoving = false;
    let shownStage = -1; // reduced motion: the stage last drawn
    let stageNow: 0 | 1 | 2 = contribStageIndex(t);
    let tapUntil = 0;
    let width = 0;
    let height = 0;
    let seenProgress = progress.current;

    // Box position, read at most once per frame and only after a resize or
    // scroll invalidated it (never per pointer event).
    let rectLeft = 0;
    let rectTop = 0;
    let rectDirty = true;

    // Pointer input, coalesced: handlers only record, tick() applies once per frame.
    let ptrPending = false;
    let ptrX = 0; // client coordinates of the latest event
    let ptrY = 0;
    let ptrHover = false; // a mouse / pen is over the box (parallax + glow)
    let ptrTap = false; // a touch put its glow down at ptrX/ptrY
    let ptrUp = false; // a mouse / pen button was released at ptrX/ptrY
    let dragDx = 0; // drag travel since the last frame, CSS px
    let dragDy = 0;

    // Mouse / pen drag.
    let dragId: number | null = null;
    let lastX = 0;
    let lastY = 0;
    // Touch: the axis is decided on the first few pixels of travel.
    let touchId: number | null = null;
    let touchX0 = 0;
    let touchY0 = 0;
    let touchAxis: "x" | "y" | null = null;

    const networkShown = () => stageNow >= 1;
    const applyCursor = () => {
      const net = networkShown();
      const cursor = net ? (look.isDragging ? "grabbing" : "grab") : "";
      const touchAction = net ? "pan-y" : "";
      if (box.style.cursor !== cursor) box.style.cursor = cursor;
      if (box.style.touchAction !== touchAction) box.style.touchAction = touchAction;
    };

    function releaseDrag(inertia: boolean) {
      const id = dragId;
      dragId = null;
      if (id !== null) {
        try {
          if (box!.hasPointerCapture(id)) box!.releasePointerCapture(id);
        } catch {
          // The pointer is already gone.
        }
      }
      if (dragDx || dragDy) look.drag(dragDx, dragDy, performance.now());
      dragDx = dragDy = 0;
      look.endDrag(performance.now(), inertia);
      applyCursor();
      dirty = true;
    }

    const setStageNow = (next: 0 | 1 | 2) => {
      if (next === stageNow) return;
      stageNow = next;
      // A new stage starts from its default pose.
      if (dragId !== null) releaseDrag(false);
      touchId = null;
      look.home(reduced);
      applyCursor();
      setStage(next); // React state only on a stage change, never per frame
    };

    // Applies the pointer input gathered since the last frame.
    const applyPointer = (now: number) => {
      if (dragDx || dragDy) {
        look.drag(dragDx, dragDy, now);
        dragDx = dragDy = 0;
        dirty = true;
      }
      if (!ptrPending) return;
      ptrPending = false;
      dirty = true;
      if (rectDirty) {
        const r = box.getBoundingClientRect();
        rectLeft = r.left;
        rectTop = r.top;
        rectDirty = false;
      }
      const x = ptrX - rectLeft;
      const y = ptrY - rectTop;
      const inside = x >= 0 && y >= 0 && x <= width && y <= height;
      if (ptrTap) {
        ptrTap = false;
        view.setPointer(x, y, 1);
        tapUntil = now + TAP_MS;
      }
      if (ptrUp) {
        ptrUp = false;
        // Released outside the box: let the hover go.
        if (!inside) ptrHover = false;
      }
      if (ptrHover) {
        view.setPointer(x, y, 1);
        if (width > 0 && height > 0) look.setParallax((x / width) * 2 - 1, (y / height) * 2 - 1);
      } else if (!tapUntil) {
        view.setPointer(0, 0, 0);
        look.setParallax(null, null);
      }
    };

    const draw = (dt: number, now: number) => {
      lookMoving = look.update(dt, now, !reduced);
      const shown = reduced ? contribStageIndex(progress.current) : t;
      if (reduced) {
        t = shown;
        shownStage = shown;
      }
      frameState.t = shown;
      frameState.time = reduced ? STILL_TIME : clock;
      frameState.dt = dt;
      frameState.motion = !reduced;
      // -1 holds the squares unseen until the handover; from then on the clock is
      // >= 0, so the scene reports motion and the loop stays awake through the lead-in.
      frameState.drop = reduced ? Infinity : dropStart === null ? -1 : Math.max(0, (now - dropStart) / 1000);
      busy = view.render(frameState);
      labels.update(shown, width, height, view.viewVersion, project, !reduced);
      dirty = false;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
      last = now;
      if (tapUntil && now > tapUntil) {
        tapUntil = 0;
        if (!ptrHover) {
          view.setPointer(0, 0, 0);
          look.setParallax(null, null);
        }
        dirty = true;
      }
      applyPointer(now);
      const target = clampProgress(progress.current);
      seenProgress = progress.current;
      if (reduced) {
        const idx = contribStageIndex(target);
        setStageNow(idx);
        if (dirty || busy || lookMoving || idx !== shownStage || look.idleDue(now)) draw(dt, now);
      } else {
        const moving = t !== target;
        if (moving) {
          t += (target - t) * (1 - Math.exp(-dt * FOLLOW_RATE));
          if (Math.abs(target - t) < 1e-4) t = target;
        }
        clock += dt;
        setStageNow(contribStageIndex(t));
        if (dirty || busy || lookMoving || moving || look.idleDue(now)) draw(dt, now);
      }
      // Keep the loop only while something still changes; otherwise sleep
      // (a slow watchdog notices progress written without a scroll event).
      const settled = !dirty && !busy && !lookMoving && !ptrPending && !dragDx && !dragDy && (reduced ? shownStage === contribStageIndex(target) : t === target);
      if (settled) sleep();
      else schedule();
    };

    const running = () => inView && pageVisible;
    const schedule = () => {
      if (!raf && running()) raf = requestAnimationFrame(tick);
    };
    const stopWatchdog = () => {
      if (watchdog) window.clearInterval(watchdog);
      watchdog = 0;
    };
    const sleep = () => {
      if (watchdog || !running()) return;
      watchdog = window.setInterval(() => {
        if (progress.current !== seenProgress || look.idleDue(performance.now())) wake();
      }, WATCHDOG_MS);
    };
    // Restart the loop (pointer, keys, scroll, resize, progress change).
    const wake = () => {
      if (!running()) return;
      stopWatchdog();
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const halt = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      stopWatchdog();
    };
    const resume = () => {
      if (!running()) return halt();
      dirty = true;
      wake();
    };

    // The entrance starts when the loader hands over (or at once if it already has).
    let dropStart: number | null = null;
    const startDrop = () => {
      if (dropStart !== null) return;
      dropStart = performance.now() + DROP_LEAD_MS;
      dirty = true;
      wake();
    };
    const dropFallback = window.setTimeout(startDrop, DROP_FALLBACK_MS);
    if (window.__contribIntro) startDrop();
    else window.addEventListener(CONTRIB_INTRO, startDrop);

    const resize = () => {
      width = box.clientWidth;
      height = box.clientHeight;
      rectDirty = true;
      look.setWidth(width);
      view.resize(width, height, Math.min(window.devicePixelRatio || 1, MAX_DPR));
      labels.invalidate();
      dirty = true;
      // Resizing clears the canvas; repaint now so there is no blank frame.
      if (running() && width > 0 && height > 0) draw(0, performance.now());
      wake();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();
    applyCursor();
    setStage(stageNow);

    // Label widths change once the web font arrives.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      labels.invalidate();
      dirty = true;
      wake();
    });

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
      look.home(true);
      dirty = true;
      wake();
    };
    media.addEventListener("change", onMotionPref);

    // Scrolling moves the (pinned) box and drives progress: re-read the rect
    // lazily and make sure the loop is awake.
    const onScroll = () => {
      rectDirty = true;
      wake();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const record = (e: PointerEvent) => {
      ptrX = e.clientX;
      ptrY = e.clientY;
      ptrPending = true;
    };
    const startDrag = (e: PointerEvent) => {
      dragId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      dragDx = dragDy = 0;
      look.beginDrag(performance.now());
      try {
        box.setPointerCapture(e.pointerId);
      } catch {
        // Capture is a nicety; the drag still works while over the box.
      }
      applyCursor();
      dirty = true;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        if (touchId !== e.pointerId) return;
        if (touchAxis === null) {
          const dx = e.clientX - touchX0;
          const dy = e.clientY - touchY0;
          if (Math.hypot(dx, dy) < AXIS_PX) return;
          // Vertical: leave it to the browser (touch-action: pan-y scrolls the page).
          touchAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
          if (touchAxis === "x") {
            startDrag(e);
            lastX = touchX0;
            lastY = touchY0;
          }
        }
        if (touchAxis === "x" && dragId === e.pointerId) {
          // Horizontal drags only turn the model (yaw); vertical travel is ignored.
          dragDx += e.clientX - lastX;
          lastX = e.clientX;
          lastY = e.clientY;
          wake();
        }
        return;
      }
      ptrHover = true;
      record(e);
      if (dragId === e.pointerId) {
        dragDx += e.clientX - lastX;
        dragDy += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
      }
      wake();
    };
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch" || dragId === e.pointerId) return;
      ptrHover = false;
      ptrPending = true;
      wake();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        record(e);
        ptrTap = true;
        if (networkShown()) {
          touchId = e.pointerId;
          touchX0 = e.clientX;
          touchY0 = e.clientY;
          touchAxis = null;
        } else {
          touchId = null;
        }
        wake();
        return;
      }
      ptrHover = true;
      record(e);
      if (e.button === 0 && networkShown()) startDrag(e);
      wake();
    };
    const onPointerEnd = (e: PointerEvent) => {
      if (touchId === e.pointerId) touchId = null;
      if (dragId === e.pointerId) releaseDrag(e.type === "pointerup" && !reduced);
      if (e.pointerType !== "touch" && e.type === "pointerup") {
        record(e);
        ptrUp = true;
      }
      wake();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const dir = ARROWS[e.key];
      if (!dir || !networkShown() || e.altKey || e.ctrlKey || e.metaKey) return;
      // The arrow turns the model instead of scrolling while it has focus.
      e.preventDefault();
      look.step(dir, performance.now(), reduced);
      dirty = true;
      wake();
    };
    // Pointer listeners are passive and never preventDefault: the canvas must
    // not hold up page scroll. No wheel listener: the wheel always scrolls.
    const passive = { passive: true } as const;
    box.addEventListener("pointermove", onPointerMove, passive);
    box.addEventListener("pointerleave", onPointerLeave, passive);
    box.addEventListener("pointerdown", onPointerDown, passive);
    box.addEventListener("pointerup", onPointerEnd, passive);
    box.addEventListener("pointercancel", onPointerEnd, passive);
    box.addEventListener("keydown", onKeyDown);

    const onContextLost = () => setFailed(true);
    canvas.addEventListener("webglcontextlost", onContextLost);

    wake();

    return () => {
      alive = false;
      halt();
      window.clearTimeout(dropFallback);
      window.removeEventListener(CONTRIB_INTRO, startDrop);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", onMotionPref);
      window.removeEventListener("scroll", onScroll);
      box.removeEventListener("pointermove", onPointerMove);
      box.removeEventListener("pointerleave", onPointerLeave);
      box.removeEventListener("pointerdown", onPointerDown);
      box.removeEventListener("pointerup", onPointerEnd);
      box.removeEventListener("pointercancel", onPointerEnd);
      box.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      box.style.cursor = "";
      box.style.touchAction = "";
      labels.dispose();
      view.dispose();
      canvas.remove();
    };
  }, [failed, progress]);

  const interactive = !failed && stage >= 1;
  const layers = stage >= 1 ? LABELS[stage - 1] : [];

  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={boxRef}
        tabIndex={interactive ? 0 : -1}
        role={interactive ? "application" : undefined}
        aria-label={interactive ? MODEL_LABEL : undefined}
        onFocus={(e) => setRing(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => setRing(false)}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          userSelect: "none",
          WebkitUserSelect: "none",
          outline: ring && interactive ? `2px solid ${FOCUS_RING}` : "none",
          outlineOffset: 4,
          borderRadius: 4,
        }}
      >
        <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />
        {failed ? <ContribFallback /> : null}
      </div>
      {layers.length > 0 ? (
        <ul style={VISUALLY_HIDDEN} aria-label={`Layers of the ${NETWORK_NAMES[stage]}`}>
          {layers.map((l, i) => (
            <li key={i}>
              {l.name}: {l.count}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
