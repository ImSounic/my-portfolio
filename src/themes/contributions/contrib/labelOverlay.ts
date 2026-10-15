// HTML layer labels drawn over the canvas, each anchored to a 3D point just
// above its layer and re-projected every frame (so they follow scroll,
// parallax and rotation). Purely decorative: the host is aria-hidden and
// pointer-events none; the component renders a screen-reader list instead.
// Imperative (no React state per frame): the component calls update() after
// each rendered frame.

import type { LayerLabel } from "./layers";
import type { Projected } from "./scene";

// Theme tokens, so the labels follow light and dark without a repaint.
const COLORS = { name: "var(--silver)", count: "var(--soft)", mark: "var(--amber)", halo: "var(--ground)" } as const;
const NARROW_PX = 480;
const MAX_NARROW = 5;
const LEADER_PX = 9; // leader length between the dot and the text
const DOT_PX = 5;
const EDGE_PX = 4; // text never closer than this to the canvas sides
const GAP_PX = 6; // minimum space between two labels
const SLIDE_PX = 8;

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const smooth01 = (x: number) => {
  const c = clamp(x, 0, 1);
  return c * c * (3 - 2 * c);
};

/** Label opacity per network at stage parameter t: MLP around 0.7..1.3, CNN from 1.6. Writes into `out`. */
export function labelWeights(t: number, out: [number, number]): [number, number] {
  out[0] = smooth01((t - 0.55) / 0.15) * (1 - smooth01((t - 1.3) / 0.15));
  out[1] = smooth01((t - 1.45) / 0.15);
  return out;
}

// Insertion sort by reading order (left to right, then top to bottom): at most
// ten items, and unlike Array#sort it never allocates.
function sortReading(a: Item[], count: number) {
  for (let i = 1; i < count; i++) {
    const it = a[i];
    let j = i - 1;
    while (j >= 0 && (a[j].sx > it.sx || (a[j].sx === it.sx && a[j].sy > it.sy))) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = it;
  }
}

interface Item {
  label: LayerLabel;
  net: 0 | 1;
  root: HTMLDivElement;
  text: HTMLSpanElement;
  name: HTMLSpanElement;
  count: HTMLSpanElement;
  w: number;
  h: number;
  // Per-frame scratch.
  sx: number;
  sy: number;
  left: number;
  weight: number;
  shown: boolean;
  // What the DOM currently holds (rounded), so unchanged labels are not rewritten.
  domShown: boolean;
  domX: number;
  domY: number;
  domLeft: number;
  domDy: number;
  domOpacity: number;
}

export class LabelOverlay {
  private readonly host: HTMLDivElement;
  private readonly items: Item[] = [];
  private narrow: boolean | null = null;
  private measured = false;
  private readonly p: Projected = { x: 0, y: 0, front: false };
  private readonly weights: [number, number] = [0, 0];
  private readonly candidates: Item[];
  private readonly placed: Float32Array;
  // Inputs of the last update(): an identical call is a no-op.
  private lastT = Number.NaN;
  private lastW = -1;
  private lastH = -1;
  private lastView = -1;
  private lastSlide = true;
  private lastLive = true;

  constructor(parent: HTMLElement, sets: [LayerLabel[], LayerLabel[]]) {
    this.host = document.createElement("div");
    this.host.setAttribute("aria-hidden", "true");
    this.host.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;";
    parent.appendChild(this.host);

    sets.forEach((labels, net) => {
      for (const label of labels) {
        const root = document.createElement("div");
        root.style.cssText = "position:absolute;left:0;top:0;opacity:0;visibility:hidden;will-change:transform,opacity;";
        const dot = document.createElement("span");
        dot.style.cssText = `position:absolute;left:${-DOT_PX / 2}px;top:${-DOT_PX / 2}px;width:${DOT_PX}px;height:${DOT_PX}px;border-radius:50%;background:${COLORS.mark};`;
        const leader = document.createElement("span");
        leader.style.cssText = `position:absolute;left:-0.5px;top:${-DOT_PX / 2 - LEADER_PX}px;width:1px;height:${LEADER_PX}px;background:${COLORS.mark};opacity:0.55;`;
        const text = document.createElement("span");
        text.style.cssText =
          `position:absolute;left:0;bottom:${DOT_PX / 2 + LEADER_PX + 3}px;white-space:nowrap;` +
          `font-family:var(--font-clash),system-ui,sans-serif;font-weight:500;line-height:1.2;letter-spacing:0.01em;` +
          `color:${COLORS.name};text-shadow:0 0 6px ${COLORS.halo},0 0 2px ${COLORS.halo};`;
        const name = document.createElement("span");
        const count = document.createElement("span");
        count.style.cssText = `color:${COLORS.count};font-weight:400;`;
        text.append(name, count);
        root.append(dot, leader, text);
        this.host.appendChild(root);
        this.items.push({
          label, net: net as 0 | 1, root, text, name, count, w: 0, h: 0, sx: 0, sy: 0, left: 0, weight: 0, shown: false,
          domShown: false, domX: Number.NaN, domY: Number.NaN, domLeft: Number.NaN, domDy: Number.NaN, domOpacity: -1,
        });
      }
    });
    this.placed = new Float32Array(this.items.length * 4);
    this.candidates = this.items.slice(); // fixed-size scratch, reordered in place
  }

  /** Call when the container size changes or fonts load. */
  invalidate() {
    this.measured = false;
    this.lastT = Number.NaN;
  }

  /**
   * Places the labels for stage parameter t. `slide` false (reduced motion):
   * labels fade only. Labels whose anchor is behind the camera or outside
   * the canvas are hidden; of two that would overlap, the later one in
   * reading order is dropped.
   */
  update(t: number, width: number, height: number, viewVersion: number, project: (x: number, y: number, z: number, out: Projected) => Projected, slide: boolean) {
    // Positions depend only on t, the canvas size and the camera.
    if (t === this.lastT && width === this.lastW && height === this.lastH && viewVersion === this.lastView && slide === this.lastSlide && (this.measured || !this.lastLive)) return;
    const narrow = width < NARROW_PX;
    if (narrow !== this.narrow) {
      this.narrow = narrow;
      this.measured = false;
      for (const it of this.items) {
        it.name.textContent = narrow ? it.label.shortName : it.label.name;
        it.count.textContent = ` · ${narrow ? it.label.shortCount : it.label.count}`;
        it.text.style.fontSize = narrow ? "13px" : "14px";
      }
    }
    const weights = labelWeights(t, this.weights);
    let live = false;
    for (const it of this.items) if (weights[it.net] > 0.01) live = true;
    this.lastLive = live;
    if (!live) {
      // Nothing to show: hide what is showing, keep the inputs (no measuring).
      for (const it of this.items) this.hide(it);
      this.remember(t, width, height, viewVersion, slide);
      return;
    }
    if (!this.measured) {
      // Layout is read only here (after a resize, font load or text change),
      // never per frame: every size first, then the writes below.
      for (const it of this.items) {
        it.w = it.text.offsetWidth;
        it.h = it.text.offsetHeight;
      }
      this.measured = true;
    }
    this.remember(t, width, height, viewVersion, slide);

    const candidates = this.candidates;
    let n = 0;
    const above = DOT_PX / 2 + LEADER_PX + 3;
    for (const it of this.items) {
      it.shown = false;
      it.weight = weights[it.net];
      if (it.weight <= 0.01) continue;
      const a = it.label.anchor;
      const p = project(a[0], a[1], a[2], this.p);
      if (!p.front || p.x < 0 || p.x > width || p.y < 0 || p.y > height) continue;
      // The text must fit below the top edge too.
      if (p.y - above - it.h < 0) continue;
      it.sx = p.x;
      it.sy = p.y;
      it.left = clamp(-it.w / 2, EDGE_PX - p.x, width - EDGE_PX - p.x - it.w);
      candidates[n++] = it;
    }
    sortReading(candidates, n);
    const placed = this.placed;
    let count = 0;
    for (let i = 0; i < n; i++) {
      const it = candidates[i];
      if (narrow && count >= MAX_NARROW) break;
      const x0 = it.sx + it.left - GAP_PX / 2;
      const x1 = it.sx + it.left + it.w + GAP_PX / 2;
      const y1 = it.sy + DOT_PX / 2 + GAP_PX / 2;
      const y0 = it.sy - above - it.h - GAP_PX / 2;
      let hit = false;
      for (let j = 0; j < count && !hit; j++) {
        const o = j * 4;
        hit = x0 < placed[o + 1] && x1 > placed[o] && y0 < placed[o + 3] && y1 > placed[o + 2];
      }
      if (hit) continue;
      placed[count * 4] = x0;
      placed[count * 4 + 1] = x1;
      placed[count * 4 + 2] = y0;
      placed[count * 4 + 3] = y1;
      it.shown = true;
      count++;
    }

    for (const it of this.items) {
      if (!it.shown) {
        this.hide(it);
        continue;
      }
      // DOM writes only when the rounded value changed (0.1 px, 0.01 opacity).
      const x = Math.round(it.sx * 10) / 10;
      const y = Math.round(it.sy * 10) / 10;
      const left = Math.round(it.left * 10) / 10;
      const dy = slide ? Math.round((1 - it.weight) * SLIDE_PX * 10) / 10 : 0;
      const op = Math.round(it.weight * 100) / 100;
      const style = it.root.style;
      if (!it.domShown) {
        style.visibility = "visible";
        it.domShown = true;
      }
      if (op !== it.domOpacity) {
        style.opacity = String(op);
        it.domOpacity = op;
      }
      if (x !== it.domX || y !== it.domY) {
        style.transform = `translate3d(${x}px,${y}px,0)`;
        it.domX = x;
        it.domY = y;
      }
      if (left !== it.domLeft || dy !== it.domDy) {
        it.text.style.transform = `translate3d(${left}px,${dy}px,0)`;
        it.domLeft = left;
        it.domDy = dy;
      }
    }
  }

  private remember(t: number, width: number, height: number, viewVersion: number, slide: boolean) {
    this.lastT = t;
    this.lastW = width;
    this.lastH = height;
    this.lastView = viewVersion;
    this.lastSlide = slide;
  }

  private hide(it: Item) {
    if (!it.domShown) return;
    it.root.style.visibility = "hidden";
    it.root.style.opacity = "0";
    it.domShown = false;
    it.domOpacity = 0;
  }

  dispose() {
    this.host.remove();
  }
}
