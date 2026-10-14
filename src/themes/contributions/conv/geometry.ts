// A darkroom contact printer that performs a 2D convolution, in isometric.
// World layout, the projection, every static path, and the few helpers the live
// loop needs to rebuild a moving part. Pure math and strings: no DOM, no window.

import * as k from "./iso/iso-kit";
import type { Flat, Plan, Plane, Point3, SolidPaths, SolidStyle, LineStyle, Tone } from "./iso/iso-kit";
import * as M from "./model";
import type { KernelName } from "./model";

export const WIDTH = 640;
export const HEIGHT = 470;
const AZ = 15;
const EL = 50;

// ---------- world (x, y on the base, z up; columns run along -y, rows along +x) ----------
const BASE: Plan = { x: -126, y: -192, w: 256, d: 384, r: 9 };
const BASE_H = 16;
const FOOT_H = 10;

export const CELL = 10;
export const N = M.SIZE;
const GAP = 0.75; // gutter on each side of a cell
const GX = -60; // first row's far edge
const NEG_Y = 145; // negative: column 0's left edge
const OUT_Y = -25; // print: column 0's left edge
const OFFSET = NEG_Y - OUT_Y; // the two heads are this far apart on the shuttle
const NEG: Plan = { x: -74, y: 11, w: 148, d: 148, r: 4 };
const OUT: Plan = { x: -74, y: -159, w: 148, d: 148, r: 4 };
const BED_H = 5;
const GLASS_Z = 6;
const FRAME_Z = 8.5;
const PAPER_Z = 5.3;

const RAIL_X = [-122, 70];
const RAILS = [166, -176]; // y of each rail's low edge, rail is 10 wide
const RAIL_H = 5;

export const PARK = -2.5; // the carriage's row when the pass is done: clear behind both grids
const rowX = (row: number) => GX + (row + 0.5) * CELL;
const colY = (col: number, gy: number) => gy - (col + 0.5) * CELL;

export const P = k.fitProjection(
  [...k.boxCorners(BASE, -BASE_H - FOOT_H, 0), [rowX(PARK) - 29, 0, 34], [rowX(N - 1) - 29, 0, 34]],
  WIDTH,
  HEIGHT,
  { pad: 10, azimuth: AZ, elevation: EL },
);

const at = (point: Point3) => k.iso(point, P);
const S = (paths: SolidPaths, style?: SolidStyle) => k.solidSvg(paths, style);
const L = (d: string, style?: LineStyle) => k.lineSvg(d, style);
const D = (points: Flat[], style?: { size?: number; tone?: Tone }) => k.dotsSvg(points, style);
const byDepth = (points: Plane[]) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const halo = (plan: Plan, z: number, h: number, blur = 9) => `<path class="iso-halo" d="${k.haloOf(plan, z, h, P)}"${blur !== 9 ? ` style="filter:blur(${blur}px)"` : ""}/>`;
const r2 = (value: number) => Math.round(value * 100) / 100;

// ---------- tones ----------
type RGB = [number, number, number];
const SILVER: RGB = [228, 218, 208];
const INK: RGB = [16, 7, 5];
const FACE: RGB = [78, 41, 30]; // plate cell at weight 0
export const hex = (rgb: number[]) => "#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
export const BLANK = hex(SILVER);
export const toneHex = (v: number) => hex(INK.map((c, i) => c + (SILVER[i] - c) * Math.min(1, Math.max(0, v))));
// plate cell tone: weight / largest |weight| from the model, shown through a square root so a weight of 1 in 4 still reads
export const plateHex = (w: number) =>
  w >= 0 ? hex(FACE.map((c, i) => c + (SILVER[i] - c) * Math.sqrt(w))) : hex(FACE.map((c, i) => c + (INK[i] - c) * Math.sqrt(-w)));

// ---------- base ----------
function base() {
  const out = [halo(BASE, -BASE_H - FOOT_H, BASE_H)];
  for (const [x, y] of byDepth(k.corners(BASE, 18))) {
    out.push(S(k.cylinder(x, y, 10, -BASE_H - FOOT_H, 2.2, P, 32), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 7.6, -BASE_H - FOOT_H + 2.2, FOOT_H - 2.2, P, 32), { tone: "mid" }));
  }
  out.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.4), { tone: "mid", inner: L(k.sideSeam(BASE, -6, P, 8), { tone: "lo" }) }));
  out.push(L(k.planOutline(k.insetPlan(BASE, 6), 0, P), { tone: "faint" }));
  const screws = k.corners(BASE, 12);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.6, 0, P, 18)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.6 }));
  // a centre rib between the two beds, and a label plate at the front
  out.push(S(k.slabOf({ x: -70, y: -5, w: 140, d: 10, r: 2 }, 0, 2, P, 3, 0.4), { tone: "mid" }));
  out.push(D([at([-58, 0, 2]), at([58, 0, 2])], { size: 0.5 }));
  const plate: Plan = { x: 92, y: -34, w: 24, d: 68, r: 1.4 };
  out.push(S(k.slabOf(plate, 0, 1, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(plate, 1.8), 1, P, 3), { tone: "faint" }));
  [44, 30, 38].forEach((len, i) =>
    out.push(L(k.lineOnTop([plate.x + 7 + i * 5, plate.y + plate.d - 7], [plate.x + 7 + i * 5, plate.y + plate.d - 7 - len], 1, P), { tone: "lo", free: true })),
  );
  out.push(D([at([plate.x + 3.6, plate.y + 3.6, 1]), at([plate.x + plate.w - 3.6, plate.y + plate.d - 3.6, 1])], { size: 0.5 }));
  return out.join("");
}

// ---------- rails and the lead screw ----------
function rails() {
  const out: string[] = [];
  for (const y of RAILS) {
    out.push(S(k.slabOf({ x: RAIL_X[0], y, w: RAIL_X[1] - RAIL_X[0], d: 10, r: 1.5 }, 0, RAIL_H, P, 3, 0.5), { tone: "mid" }));
    out.push(L(k.lineOnTop([RAIL_X[0] + 0.2, y + 5], [RAIL_X[1] - 0.2, y + 5], RAIL_H, P), { tone: "faint" }));
    out.push(D([RAIL_X[0] + 8, -40, 30, RAIL_X[1] - 8].map((x) => at([x, y + 5, RAIL_H])), { size: 0.5 }));
    for (const x of [RAIL_X[0] - 6, RAIL_X[1]]) out.push(S(k.slabOf({ x, y: y - 2, w: 6, d: 14, r: 1.2 }, 0, 9, P, 3, 0.5), { tone: "mid" }));
  }
  // lead screw along the +y rail, turned by the advance knob in its gearbox at the front
  out.push(S(k.slabOf({ x: RAIL_X[0], y: RAILS[0] + 3.5, w: RAIL_X[1] - RAIL_X[0], d: 3, r: 1.4 }, RAIL_H + 1, 2.6, P, 3), { tone: "lo", crease: "none" }));
  const box: Plan = { x: RAIL_X[1] + 6, y: RAILS[0] - 4, w: 22, d: 18, r: 2.4 };
  out.push(S(k.slabOf(box, 0, 13, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(box, 8, P, 4), { tone: "faint" }) }));
  out.push(D(k.corners(box, 3).map(([x, y]) => at([x, y, 13])), { size: 0.45 }));
  return out.join("");
}

const KNOB: Plane = [RAIL_X[1] + 17, RAILS[0] + 5];
const KNOB_Z = 13;
/** The advance knob's pointer, `turn` whole turns round. */
export const knobPointer = (turn: number) => {
  const a = turn * Math.PI * 2;
  return k.lineOnTop([KNOB[0] + Math.cos(a) * 1.4, KNOB[1] + Math.sin(a) * 1.4], [KNOB[0] + Math.cos(a) * 6.6, KNOB[1] + Math.sin(a) * 6.6], KNOB_Z + 7, P);
};
function knob() {
  const out: string[] = [];
  out.push(S(k.cylinder(KNOB[0], KNOB[1], 8.4, KNOB_Z, 1.4, P, 36), { tone: "mid" }));
  out.push(S(k.cylinder(KNOB[0], KNOB[1], 7, KNOB_Z + 1.4, 5.6, P, 40, 0.4), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(KNOB[0], KNOB[1], 7, KNOB_Z + 1.4, KNOB_Z + 7, 36, P), { tone: "lo" }));
  out.push(`<path class="iso-line" data-part="knob" data-tone="hi" data-free="start" d="${knobPointer(0)}"/>`);
  return out.join("");
}

// ---------- the two beds: negative on glass, print on paper ----------
const gridMatrix = (gy: number, z: number) => k.topMatrix([GX, gy], z, P, "y");
const cellRect = (row: number, col: number, fill: string) =>
  `<rect x="${r2(col * CELL + GAP)}" y="${r2(row * CELL + GAP)}" width="${CELL - GAP * 2}" height="${CELL - GAP * 2}" fill="${fill}"/>`;

function frameBars(plan: Plan, z0: number, z1: number, tone: Tone = "mid") {
  const inner = k.insetPlan(plan, 6);
  const t = 7;
  const bars: Plan[] = [
    { x: inner.x, y: inner.y, w: t, d: inner.d, r: 0.8 },
    { x: inner.x + inner.w - t, y: inner.y, w: t, d: inner.d, r: 0.8 },
    { x: inner.x + t, y: inner.y + inner.d - t, w: inner.w - 2 * t, d: t, r: 0.8 },
    { x: inner.x + t, y: inner.y, w: inner.w - 2 * t, d: t, r: 0.8 },
  ];
  return bars
    .map((b) => ({ b, depth: k.depthOf([b.x + b.w / 2, b.y + b.d / 2, z0], P) }))
    .sort((a, b) => a.depth - b.depth)
    .map(({ b }) => S(k.slabOf(b, z0, z1 - z0, P, 2, 0.3), { tone }))
    .join("");
}

function negative() {
  const out = [halo(NEG, 0, BED_H, 6)];
  out.push(S(k.slabOf(NEG, 0, BED_H, P, 4, 0.6), { tone: "mid" }));
  const glass = k.insetPlan(NEG, 6);
  out.push(`<path class="cv-glass" d="${k.pathOf(k.ringOf(glass, 2).map(([x, y]) => at([x, y, GLASS_Z])), true)}"/>`);
  out.push(L(k.pathOf(k.ringOf(glass, 2).map(([x, y]) => at([x, y, GLASS_Z])), true), { tone: "lo" }));
  const cells: string[] = [];
  for (let row = 0; row < N; row++) for (let col = 0; col < N; col++) cells.push(cellRect(row, col, toneHex(M.INPUT[row][col])));
  out.push(`<g class="cv-cells" transform="${gridMatrix(NEG_Y, GLASS_Z)}">${cells.join("")}</g>`);
  out.push(frameBars(NEG, GLASS_Z, FRAME_Z));
  // four low cam clamps on the frame corners
  const inner = k.insetPlan(NEG, 6);
  for (const [x, y] of byDepth(k.corners(inner, 3.5))) {
    out.push(S(k.cylinder(x, y, 3.4, FRAME_Z, 1.4, P, 20), { tone: "mid" }));
    out.push(D([at([x, y, FRAME_Z + 1.4])], { size: 0.5 }));
  }
  return out.join("");
}

function print(kernel: KernelName, index: number) {
  const out = [halo(OUT, 0, BED_H, 6)];
  out.push(S(k.slabOf(OUT, 0, BED_H, P, 4, 0.6), { tone: "mid" }));
  const paper = k.insetPlan(OUT, 6);
  out.push(`<path class="cv-paper" d="${k.pathOf(k.ringOf(paper, 2).map(([x, y]) => at([x, y, PAPER_Z])), true)}"/>`);
  const shown = M.displayOf(kernel);
  const cells: string[] = [];
  for (let row = 0; row < N; row++)
    for (let col = 0; col < N; col++) {
      const i = row * N + col;
      cells.push(cellRect(row, col, i <= index ? toneHex(shown[row][col]) : BLANK));
    }
  out.push(`<g class="cv-cells" data-part="map" transform="${gridMatrix(OUT_Y, PAPER_Z)}">${cells.join("")}</g>`);
  out.push(frameBars(OUT, PAPER_Z, FRAME_Z));
  // two paper clips at the far corners
  const inner = k.insetPlan(OUT, 6);
  for (const [x, y] of byDepth([
    [inner.x + 3.5, inner.y + inner.d - 3.5],
    [inner.x + 3.5, inner.y + 3.5],
  ])) {
    out.push(S(k.slabOf({ x: x - 3.5, y: y - 3.5, w: 7, d: 7, r: 1 }, FRAME_Z, 1.2, P, 2, 0.3), { tone: "hi", crease: "lo" }));
  }
  return out.join("");
}

// ---------- kernel selector: a three-position rotary switch ----------
const SEL: Plane = [104, -150];
const SEL_Z = 2.2;
const SEL_TOP = SEL_Z + 8;
const SEL_ANGLES: Record<KernelName, number> = { edges: -42, blur: 0, sharpen: 42 }; // degrees from "straight up the screen"
const UP = -(90 - AZ); // the bearing that points up the screen, in degrees from +x
const selDir = (kernel: KernelName): Plane => {
  const a = ((UP + 180 + SEL_ANGLES[kernel]) * Math.PI) / 180; // pointer swings over the front half
  return [Math.cos(a), Math.sin(a)];
};
/** The selector knob's pointer for a kernel. */
export const selPointer = (kernel: KernelName) => {
  const [dx, dy] = selDir(kernel);
  return k.lineOnTop([SEL[0] + dx * 1.6, SEL[1] + dy * 1.6], [SEL[0] + dx * 7.4, SEL[1] + dy * 7.4], SEL_TOP, P);
};
function selector(kernel: KernelName) {
  const out: string[] = [];
  const [x, y] = SEL;
  out.push(S(k.cylinder(x, y, 17, 0, SEL_Z, P, 48, 0.5), { tone: "mid" }));
  out.push(L(k.ring(x, y, 15, SEL_Z, P, 64), { tone: "lo" }));
  const ticks = M.ORDER.map((name) => {
    const [dx, dy] = selDir(name);
    return k.lineOnTop([x + dx * 11, y + dy * 11], [x + dx * 15, y + dy * 15], SEL_Z, P);
  });
  out.push(L(ticks.join(""), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 9.6, SEL_Z, 1.2, P, 40), { tone: "lo" }));
  out.push(S(k.cylinder(x, y, 8, SEL_Z + 1.2, SEL_TOP - SEL_Z - 1.2, P, 40, 0.4), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, 8, SEL_Z + 1.2, SEL_TOP, 40, P), { tone: "lo" }));
  out.push(`<path class="iso-line" data-part="selector" data-tone="hi" data-free="start" d="${selPointer(kernel)}"/>`);
  out.push(`<path class="cv-hit" data-part="selector-hit" d="${k.pathOf(k.circleRing(x, y, 18, 40).map(([px, py]) => at([px, py, SEL_TOP])), true)}"/>`);
  return out.join("");
}

// ---------- the carriage: two end trucks, the beam, the shuttle with both heads ----------
// Built at row 0 / column 0 and moved with translateAlong. xr: row centre; the beam rides 25 behind it.
const XR = rowX(0);
const YK = colY(0, NEG_Y);
const YS = colY(0, OUT_Y);
const BEAM = { x: XR - 29, w: 8, z: 24, h: 6 };
const SHUT = { x: XR - 21, w: 4, z: 22, h: 9 };
function truck(y: number) {
  const plan: Plan = { x: XR - 33, y, w: 16, d: 14, r: 2 };
  return (
    S(k.slabOf(plan, RAIL_H, BEAM.z + BEAM.h - RAIL_H, P, 3, 0.6), { tone: "mid", inner: L(k.sideSeam(plan, RAIL_H + 5, P, 3), { tone: "faint" }) }) +
    D([at([plan.x + 4, y + 7, BEAM.z + BEAM.h]), at([plan.x + 12, y + 7, BEAM.z + BEAM.h])], { size: 0.5 })
  );
}
function heads(kernel: KernelName) {
  const out: string[] = [];
  // kernel head: tab down from the shuttle, the holder, nine weight cells, the lit window frame
  out.push(S(k.slabOf({ x: XR - 20.5, y: YK - 4, w: 3.5, d: 8, r: 0.8 }, 13.6, SHUT.z - 13.6, P, 2), { tone: "mid" }));
  const stamp: Plan = { x: XR - 5.5, y: YS - 5.5, w: 11, d: 11, r: 1.4 };
  out.push(S(k.slabOf({ x: XR - 21, y: YS - 2.5, w: 15.5, d: 5, r: 1 }, 17, SHUT.z - 17, P, 2, 0.3), { tone: "mid" }));
  out.push(S(k.slabOf(k.insetPlan(stamp, 0.8), 9.2, 1.6, P, 3), { tone: "lo" }));
  out.push(S(k.slabOf(stamp, 10.8, 7.2, P, 3, 0.5), { tone: "hi", crease: "lo", inner: L(k.sideSeam(stamp, 13.5, P, 3), { tone: "faint" }) }));
  out.push(S(k.cylinder(XR + 1.5, YS, 2.4, 18, 1.6, P, 20), { tone: "mid" }));
  const holder: Plan = { x: XR - 18, y: YK - 18, w: 36, d: 36, r: 2 };
  out.push(S(k.slabOf(holder, 12, 1.6, P, 3, 0.4), { tone: "mid" }));
  const plate = M.plateOf(kernel);
  const cells: string[] = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      cells.push(
        `<rect data-w="${i * 3 + j}" x="${(j - 1.5) * CELL + GAP}" y="${(i - 1.5) * CELL + GAP}" width="${CELL - GAP * 2}" height="${CELL - GAP * 2}" fill="${plateHex(plate[i][j])}"/>`,
      );
  out.push(`<g class="cv-plate" data-part="plate" transform="${k.topMatrix([XR, YK], 13.6, P, "y")}">${cells.join("")}</g>`);
  const win: Plane[] = [
    [XR - 15, YK + 15],
    [XR - 15, YK - 15],
    [XR + 15, YK - 15],
    [XR + 15, YK + 15],
  ];
  out.push(`<path class="iso-line cv-lit" data-tone="lit" d="${k.onTop(win, 13.6, P, true)}"/>`);
  out.push(
    L(
      k.onTop([[XR - 5, YK + 15], [XR - 5, YK - 15]], 13.6, P) +
        k.onTop([[XR + 5, YK + 15], [XR + 5, YK - 15]], 13.6, P) +
        k.onTop([[XR - 15, YK + 5], [XR + 15, YK + 5]], 13.6, P) +
        k.onTop([[XR - 15, YK - 5], [XR + 15, YK - 5]], 13.6, P),
      { tone: "lo" },
    ),
  );
  return out.join("");
}
/** Where the carriage sits for a row (fractional while it moves). */
export const carriageAt = (row: number) => k.translateAlong(P, [row * CELL, 0, 0]);
/** Where the shuttle sits along the beam for a column (fractional while it moves). */
export const shuttleAt = (col: number) => k.translateAlong(P, [0, -col * CELL, 0]);
function carriage(kernel: KernelName) {
  const back = truck(RAILS[1] - 2);
  const beamPlan: Plan = { x: BEAM.x, y: RAILS[1] + 10, w: BEAM.w, d: RAILS[0] - RAILS[1] - 10, r: 1 };
  const beam = S(k.slabOf(beamPlan, BEAM.z, BEAM.h, P, 2, 0.5), { tone: "mid", inner: L(k.sideSeam(beamPlan, BEAM.z + 2, P, 2), { tone: "faint" }) });
  const shuttle: Plan = { x: SHUT.x, y: YS - 14, w: SHUT.w, d: OFFSET + 28, r: 1 };
  const shut =
    S(k.slabOf(shuttle, SHUT.z, SHUT.h, P, 2, 0.4), { tone: "hi", crease: "lo" }) +
    D([at([SHUT.x + SHUT.w, YK + 9, SHUT.z + 6]), at([SHUT.x + SHUT.w, YS - 9, SHUT.z + 6])], { size: 0.5 });
  const front = truck(RAILS[0] - 2);
  return `<g data-part="carriage" transform="${carriageAt(PARK)}">${back}${beam}<g data-part="shuttle">${shut}${heads(kernel)}</g>${front}</g>`;
}

// ---------- assemble ----------
export const START_KERNEL: KernelName = "edges";
export const START = M.CELLS; // the resting drawing shows the finished edges map, carriage parked
export const POOL_ID = "cv-pool-grad";

const LABEL =
  "A darkroom contact printer. On the left a 12 by 12 negative of a house lies on a glass bed; on the right a print lies in a paper tray. A carriage on two rails carries a shuttle with two heads: a 3 by 3 kernel plate over the negative and a stamp over the print. The plate visits every cell in turn, and the stamp prints the weighted sum of the nine cells under the plate onto the matching cell of the print.";

let markup = "";
/** The whole drawing as SVG markup, built once on first use. */
export function figureMarkup() {
  if (markup) return markup;
  const defs = `<defs><radialGradient id="${POOL_ID}"><stop offset="0" style="stop-color:var(--cv-amber);stop-opacity:.13"/><stop offset=".5" style="stop-color:var(--cv-amber);stop-opacity:.05"/><stop offset="1" style="stop-color:var(--cv-amber);stop-opacity:0"/></radialGradient></defs>`;
  const pool = `<g class="cv-pool-g" transform="${k.topMatrix([-40, 40], 0, P, "y")}"><ellipse class="cv-pool" cx="0" cy="0" rx="230" ry="190" fill="url(#${POOL_ID})"/></g>`;
  markup = k.figureSvg({
    width: WIDTH,
    height: HEIGHT,
    className: "cv-svg",
    label: LABEL,
    body: [defs, base(), rails(), negative(), print(START_KERNEL, START), selector(START_KERNEL), knob(), carriage(START_KERNEL), pool],
  });
  return markup;
}
