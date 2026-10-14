"use client";

// The contact printer: a darkroom machine that performs a 2D convolution.
// The drawing is built once as static SVG markup (geometry.ts). One effect owns
// the live parts: it moves the carriage and shuttle, turns the knobs, prints the
// map, repaints the kernel plate and writes the readout, all through attributes.
// React renders once; nothing re-renders per frame.

import * as React from "react";
import { BLANK, N, PARK, POOL_ID, START, START_KERNEL, carriageAt, figureMarkup, knobPointer, plateHex, selPointer, shuttleAt, toneHex } from "./geometry";
import { CELLS, KERNELS, ORDER, cellOf, displayOf, plateOf, readoutOf, valueTextOf, type Grid, type KernelName } from "./model";
import "./conv.css";

const STILLNESS = "(prefers-reduced-motion: reduce)";
const RATE = 11; // cells per second while scanning
const HOLD = 2.4; // seconds the finished map rests before the tour moves on
const EASE = 0.07; // seconds: the carriage's follow time constant

const isKernel = (value: string | undefined): value is KernelName => value === "edges" || value === "blur" || value === "sharpen";
const nextOf = (kernel: KernelName) => ORDER[(ORDER.indexOf(kernel) + 1) % ORDER.length];

export interface ConvPrinterProps {
  className?: string;
}

export function ConvPrinter({ className }: ConvPrinterProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const readoutRef = React.useRef<HTMLParagraphElement | null>(null);
  const sliderRef = React.useRef<HTMLInputElement | null>(null);
  const kernelsRef = React.useRef<HTMLDivElement | null>(null);

  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sliderId = `cv-scan-${uid}`;
  // The pool gradient's id is per instance, so two printers on a page never share one.
  const drawing = React.useMemo(() => ({ __html: figureMarkup().split(POOL_ID).join(`cv-pool-${uid}`) }), [uid]);

  React.useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const readout = readoutRef.current;
    const slider = sliderRef.current;
    const group = kernelsRef.current;
    const svg = stage?.querySelector("svg");
    if (!root || !stage || !readout || !slider || !group || !svg) return;

    const carriageEl = svg.querySelector('[data-part="carriage"]');
    const shuttleEl = svg.querySelector('[data-part="shuttle"]');
    const knobEl = svg.querySelector('[data-part="knob"]');
    const selEl = svg.querySelector('[data-part="selector"]');
    const selHit = svg.querySelector('[data-part="selector-hit"]');
    const mapCells = Array.from(svg.querySelectorAll('[data-part="map"] rect'));
    const plateCells = Array.from(svg.querySelectorAll('[data-part="plate"] rect'));
    const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>("button[data-kernel]"));
    if (!carriageEl || !shuttleEl || !knobEl || !selEl || !selHit) return;

    const still = window.matchMedia(STILLNESS);
    const set = (node: Element, name: string, value: string) => {
      if (node.getAttribute(name) !== value) node.setAttribute(name, value);
    };

    let kernel: KernelName = START_KERNEL;
    let display: Grid = displayOf(kernel);
    let index = still.matches ? CELLS : 0;
    let pos = { x: PARK, y: 0 };
    let said = "";
    let painted = "";
    let touring = !still.matches;
    let playing = false;
    let clock = 0;
    let frame = 0;
    let last = 0;
    let visible = false;
    let alive = true;

    const target = () => {
      if (index >= CELLS) return { x: PARK, y: 0 };
      const { row, col } = cellOf(index);
      return { x: row, y: col };
    };

    function paintPlate() {
      const w = plateOf(kernel);
      plateCells.forEach((rect, i) => set(rect, "fill", plateHex(w[Math.floor(i / 3)][i % 3])));
      set(selEl!, "d", selPointer(kernel));
      buttons.forEach((b) => set(b, "aria-pressed", String(b.dataset.kernel === kernel)));
      root!.dataset.current = kernel;
    }

    function paintMap() {
      const key = `${kernel}:${index}`;
      if (key === painted) return;
      const upto = Math.min(index, CELLS - 1);
      for (let i = 0; i < mapCells.length; i++) {
        const fill = i <= upto ? toneHex(display[Math.floor(i / N)][i % N]) : BLANK;
        set(mapCells[i], "fill", fill);
      }
      painted = key;
    }

    function draw() {
      set(carriageEl!, "transform", carriageAt(pos.x));
      set(shuttleEl!, "transform", shuttleAt(pos.y));
      set(knobEl!, "d", knobPointer((pos.x * N + pos.y) / 24));
      paintMap();
      const text = readoutOf(kernel, index);
      if (text !== said) {
        readout!.textContent = text;
        said = text;
        root!.dataset.index = String(index);
      }
      if (document.activeElement !== slider && slider!.value !== String(index)) slider!.value = String(index);
      set(slider!, "aria-valuetext", valueTextOf(index));
    }

    function setKernel(next: KernelName) {
      kernel = next;
      display = displayOf(kernel);
      painted = "";
      paintPlate();
    }

    function tick(now: number) {
      frame = 0;
      if (!alive) return;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      if (touring || playing) {
        clock += dt;
        if (index < CELLS) {
          index = Math.min(CELLS, Math.floor(clock * RATE));
          if (index >= CELLS) clock = 0;
        } else if (touring && clock > HOLD) {
          setKernel(nextOf(kernel));
          index = 0;
          clock = 0;
        } else if (playing) {
          playing = false;
          readout!.removeAttribute("aria-busy");
        }
      }
      const want = target();
      const calm = still.matches;
      const ease = 1 - Math.exp(-dt / EASE);
      pos.x = calm ? want.x : pos.x + (want.x - pos.x) * ease;
      pos.y = calm ? want.y : pos.y + (want.y - pos.y) * ease;
      if (Math.abs(want.x - pos.x) < 0.002) pos.x = want.x;
      if (Math.abs(want.y - pos.y) < 0.002) pos.y = want.y;
      draw();
      const settled = !touring && !playing && pos.x === want.x && pos.y === want.y;
      if (visible && !document.hidden && !settled) frame = requestAnimationFrame(tick);
    }

    const run = () => {
      if (alive && !frame && visible && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    // The first touch ends the idle tour and lets the readout speak from then on.
    const take = () => {
      if (readout.getAttribute("aria-live") !== "polite") readout.setAttribute("aria-live", "polite");
      touring = false;
    };

    function choose(next: KernelName) {
      take();
      setKernel(next);
      if (still.matches) {
        index = CELLS;
        playing = false;
        pos = target();
        draw();
        return;
      }
      index = 0;
      clock = 0;
      playing = true;
      readout!.setAttribute("aria-busy", "true");
      run();
    }

    function scrub(next: number) {
      take();
      playing = false;
      readout!.removeAttribute("aria-busy");
      index = Math.max(0, Math.min(CELLS, next));
      if (still.matches) pos = target();
      run();
      draw();
    }

    const onKernel = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>("button[data-kernel]");
      const name = button?.dataset.kernel;
      if (isKernel(name)) choose(name);
    };
    const onSelector = () => choose(nextOf(kernel));
    const onInput = () => scrub(Number(slider.value));
    const onKey = () => take();
    const onVisibility = () => {
      if (!document.hidden) run();
    };
    const onStill = () => {
      if (!still.matches) return;
      touring = false;
      playing = false;
      readout.removeAttribute("aria-busy");
      index = CELLS;
      pos = target();
      draw();
    };

    group.addEventListener("click", onKernel);
    selHit.addEventListener("click", onSelector);
    slider.addEventListener("input", onInput);
    slider.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    still.addEventListener("change", onStill);
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) run();
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(root);

    paintPlate();
    pos = still.matches ? target() : { x: PARK, y: 0 };
    draw();

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      observer.disconnect();
      group.removeEventListener("click", onKernel);
      selHit.removeEventListener("click", onSelector);
      slider.removeEventListener("input", onInput);
      slider.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      still.removeEventListener("change", onStill);
    };
  }, []);

  return (
    <figure ref={rootRef} className={className ? `cv ${className}` : "cv"} data-current={START_KERNEL}>
      <div ref={stageRef} className="cv-stage" dangerouslySetInnerHTML={drawing} />
      <p className="cv-hint">Pick a kernel, then scrub the carriage cell by cell</p>
      <div className="cv-controls">
        <div ref={kernelsRef} className="cv-kernels" role="group" aria-label="Kernel">
          {ORDER.map((name) => (
            <button key={name} type="button" data-kernel={name} aria-pressed={name === START_KERNEL}>
              {KERNELS[name].name}
            </button>
          ))}
        </div>
        <label className="cv-label" htmlFor={sliderId}>
          Scan position
        </label>
        <input
          ref={sliderRef}
          className="cv-range"
          id={sliderId}
          type="range"
          min={0}
          max={CELLS}
          step={1}
          defaultValue={START}
          aria-valuetext={valueTextOf(START)}
        />
      </div>
      <p ref={readoutRef} className="cv-readout" data-readout="">
        {readoutOf(START_KERNEL, START)}
      </p>
      <p className="cv-line">The same nine weights slide over every pixel. That is a convolution.</p>
      <figcaption className="cv-caption">
        A real convolution of the 12 by 12 input shown. Same size output; the border is padded by repeating the edge pixel. Edges are shown as the size of the
        sum, scaled to the largest; sharpen is clipped to black and white.
      </figcaption>
    </figure>
  );
}

export default ConvPrinter;
