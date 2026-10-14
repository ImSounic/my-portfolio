// The imperative half of ContribCanvas: one three.js scene in which the cells
// of a GitHub contribution graph (one InstancedMesh of rounded boxes) lift off
// and become an MLP, then fold into a CNN. Edges (one LineSegments per network,
// crossfaded) and forward-pass pulses are copied from the network canvas
// (the Darkroom theme's network scene, since removed). It knows nothing about React, scroll or observers; the
// component owns the loop and calls render() with the state to draw.

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { GREENS, LETTER_GREEN, backgroundColorOf } from "./grid";
import { buildLayerLabels } from "./layers";
import { CELL, CnnKind, PITCH, Role, buildTargets, type Targets } from "./targets";

const PALETTE = {
  ground: "#0d1117", // the page behind the transparent canvas
  hoverTop: "#7ee787", // a letter cell under the pointer: one notch past the top level
  edge: "#26a641",
  pulse: "#39d353",
  glow: "#aff5b4",
  feature: "#26a641",
  dense: LETTER_GREEN,
} as const;

const EDGE_OPACITY = 0.22;
const EDGE_GLOW_GAIN = 4;
const PULSE_COUNT = 60;
const PULSE_SPEED = 0.35;
const FOV_GRAPH = 5; // long lens: the flat graph reads orthographic
const FOV_NET = 28; // as the network canvas
const GRAPH_FILL = 0.9; // share of the binding axis the graph may occupy
const NET_FILL = 0.84;
const DEPTH_FLAT = 0.2; // cell thickness as a share of its side, graph stage
const DEPTH_NET = 0.9; // network stages: near-cubes
const CORNER = 0.18; // rounded-corner radius as a share of the side
const LIFT = 1.1; // how far letters arc toward the camera while flying
const STAGGER_LETTERS = 0.4; // share of the 0 -> 1 span used to stagger letters by column
const STAGGER_SINK = 0.25;
const STAGGER_FOLD = 0.3; // 1 -> 2, by column
const SINK_FADE = 0.82; // how far sunk cells fade into the ground colour
const INPUT_BRIGHTEN = 0.3; // input-plane cells: real level colour pushed toward green
const GLOW_SCALE = 0.4;
const GLOW_RATE = 12; // 1/s
const BREATH_AMP = 0.035;
const BREATH_RATE = 1.3; // rad/s
const ORBIT = { base: -0.62, perT: 0.18, elevation: Math.atan2(6.6, 23) } as const;
const NET_TARGET = new THREE.Vector3(0.3, -0.1, 0);
const GRAPH_TARGET = new THREE.Vector3(0, 0, 0);
const NARROW_PX = 640;
const LABEL_ROOM_PX = 34; // kept free above the network for the layer labels
const MAX_ELEVATION = 1.35; // rad: never look straight down

/** Pulse clock used for still frames. */
export const STILL_TIME = 1.3;

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const smooth01 = (x: number) => {
  const c = clamp(x, 0, 1);
  return c * c * (3 - 2 * c);
};
const ease = (x: number) => {
  const c = clamp(x, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
const stagger = (u: number, delay: number, spread: number) => ease((u - delay * spread) / (1 - spread));

/** How much the network-stage camera offsets (parallax, look around) apply at t: 0 at t <= 0.3, 1 at t >= 0.7. */
export const lookWeight = (t: number) => smooth01((t - 0.3) / 0.4);

export interface FrameState {
  /** Stage parameter, 0..2 (already smoothed by the caller). */
  t: number;
  /** Seconds of animation clock; drives pulses and breathing. */
  time: number;
  /** Seconds since the previous frame. */
  dt: number;
  /** false: no breathing or pulses, glow snaps instead of easing. */
  motion: boolean;
  /** Camera offsets from the stage pose in radians (parallax + look around); weighted by lookWeight(t) here. */
  look?: { yaw: number; pitch: number };
}

/** A projected point in CSS pixels; `front` is false behind the camera. */
export interface Projected {
  x: number;
  y: number;
  front: boolean;
}

interface EdgeLayer {
  pairs: Uint16Array;
  count: number;
  /** Per-cell size this layer's nodes have when fully formed. */
  size: Float32Array;
  line: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  position: THREE.BufferAttribute;
  color: THREE.BufferAttribute;
  /** t at which `position` / `color` were last written (NaN = never or stale). */
  posT: number;
  colT: number;
}

interface Fit {
  D: number;
  sx: number;
  sy: number;
}

const linear = (hex: string) => new THREE.Color(hex);
// Mix two hex colours in sRGB (perceptual) space: a linear-space mix of a near
// black and a bright green is mostly green, which would erase the data levels.
const mixSrgb = (a: string, b: string, k: number) => {
  const A = new THREE.Color(a).getRGB(new THREE.Color(), THREE.SRGBColorSpace);
  const B = new THREE.Color(b).getRGB(new THREE.Color(), THREE.SRGBColorSpace);
  return new THREE.Color().setRGB(A.r + (B.r - A.r) * k, A.g + (B.g - A.g) * k, A.b + (B.b - A.b) * k, THREE.SRGBColorSpace);
};

export class ContribScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(FOV_GRAPH, 1, 0.5, 600);
  private readonly T: Targets = buildTargets();
  private readonly n: number;

  private readonly cellGeometry = new RoundedBoxGeometry(1, 1, 1, 3, CORNER);
  private readonly cellMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  private readonly cellsMesh: THREE.InstancedMesh;
  private readonly cellMatrix: Float32Array;
  private readonly cellColor: Float32Array;

  private readonly pulseGeometry = new THREE.SphereGeometry(0.07, 10, 8);
  private readonly pulseMaterial = new THREE.MeshBasicMaterial({ color: PALETTE.pulse });
  private readonly pulses: THREE.InstancedMesh;
  private readonly pulseMatrix = new Float32Array(PULSE_COUNT * 16);

  private readonly ambient = new THREE.AmbientLight(0xffffff, Math.PI);
  private readonly hemi = new THREE.HemisphereLight(0xffffff, 0x0d1117, 0);
  private readonly sun = new THREE.DirectionalLight(0xffffff, 0);

  private readonly layers: EdgeLayer[];

  // Linear-space colours per cell and stage.
  private readonly colGraph: Float32Array;
  private readonly colUp: Float32Array;
  private readonly colMlp: Float32Array;
  private readonly colCnn: Float32Array;
  private readonly cGlow = linear(PALETTE.glow);
  private readonly cEdge = linear(PALETTE.edge);

  // Current interpolated state.
  private readonly cur: Float32Array;
  private readonly curSize: Float32Array;
  private readonly curDepth: Float32Array;
  private readonly curCol: Float32Array;
  private readonly glow: Float32Array;
  private stateT = Number.NaN;

  private readonly netFit: Float32Array;
  private readonly graphCorners: Float32Array;
  private readonly wordCorners: Float32Array;
  private readonly viewProj = new THREE.Matrix4();
  private pitchPx = 20;

  // Camera cache: the pose is re-solved only when one of these changes.
  private fitT = Number.NaN;
  private fitAspect = Number.NaN;
  private fitNarrow = false;
  private fitYaw = Number.NaN;
  private fitPitch = Number.NaN;
  /** Bumped whenever the camera (and so every projection) changes. */
  viewVersion = 0;

  // Scratch for frame(): no allocation per frame.
  private readonly vDir = new THREE.Vector3();
  private readonly vFwd = new THREE.Vector3();
  private readonly vRight = new THREE.Vector3();
  private readonly vUp = new THREE.Vector3();
  private readonly vTarget = new THREE.Vector3();
  private readonly fitA: Float32Array;
  private readonly fitB: Float32Array;
  private readonly fitC: Float32Array;
  private readonly bounds = { x0: 0, x1: 0, y0: 0, y1: 0 };
  private readonly fitG: Fit = { D: 0, sx: 0, sy: 0 };
  private readonly fitN: Fit = { D: 0, sx: 0, sy: 0 };
  private tanV = 1;
  private tanH = 1;

  // What the buffers currently hold, so unchanged frames skip the rewrite.
  private cellsT = Number.NaN;
  private cellsMotion = false;
  private glowChanged = true;
  private anyGlow = false;
  private glowT = Number.NaN;
  private glowView = -1;
  private pointerDirty = false;
  private glowEasing = false;

  private width = 0;
  private height = 0;
  private pointerX = 0;
  private pointerY = 0;
  private pointerStrength = 0;

  /** Throws when WebGL is unavailable; the caller falls back to the SVG graph. */
  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);

    const T = this.T;
    const n = (this.n = T.count);
    this.cellMatrix = new Float32Array(n * 16);
    this.cellColor = new Float32Array(n * 3);
    this.cur = new Float32Array(n * 3);
    this.curSize = new Float32Array(n);
    this.curDepth = new Float32Array(n);
    this.curCol = new Float32Array(n * 3);
    this.glow = new Float32Array(n);

    this.colGraph = new Float32Array(n * 3);
    this.colUp = new Float32Array(n * 3);
    this.colMlp = new Float32Array(n * 3);
    this.colCnn = new Float32Array(n * 3);
    const letter = linear(LETTER_GREEN);
    const hoverTop = linear(PALETTE.hoverTop);
    const feature = linear(PALETTE.feature);
    const dense = linear(PALETTE.dense);
    T.cells.forEach((c, i) => {
      const shown = c.letter ? 4 : GREENS.indexOf(backgroundColorOf(c.shown));
      const base = c.letter ? letter : linear(GREENS[Math.max(0, shown)]);
      base.toArray(this.colGraph, i * 3);
      (shown >= 4 ? hoverTop : linear(GREENS[Math.min(4, shown + 1)])).toArray(this.colUp, i * 3);
      (c.letter ? letter : mixSrgb(GREENS[Math.max(0, shown)], PALETTE.ground, SINK_FADE)).toArray(this.colMlp, i * 3);
      const kind = T.cnnKind[i];
      const cnnColor =
        kind === CnnKind.Input
          ? mixSrgb(GREENS[clamp(c.level, 0, 4)], LETTER_GREEN, INPUT_BRIGHTEN)
          : kind === CnnKind.Dense
            ? dense
            : feature;
      cnnColor.toArray(this.colCnn, i * 3);
    });

    this.cellsMesh = new THREE.InstancedMesh(this.cellGeometry, this.cellMaterial, n);
    this.cellsMesh.instanceMatrix = new THREE.InstancedBufferAttribute(this.cellMatrix, 16).setUsage(THREE.DynamicDrawUsage);
    this.cellsMesh.instanceColor = new THREE.InstancedBufferAttribute(this.cellColor, 3).setUsage(THREE.DynamicDrawUsage);
    this.cellsMesh.frustumCulled = false;
    this.scene.add(this.cellsMesh);

    this.sun.position.set(-4, 8, 10);
    this.scene.add(this.ambient, this.hemi, this.sun);

    this.layers = [
      { pairs: T.mlpEdges, size: T.mlpSize },
      { pairs: T.cnnEdges, size: T.cnnSize },
    ].map(({ pairs, size }) => {
      const count = pairs.length / 2;
      const geometry = new THREE.BufferGeometry();
      const position = new THREE.BufferAttribute(new Float32Array(count * 6), 3).setUsage(THREE.DynamicDrawUsage);
      const color = new THREE.BufferAttribute(new Float32Array(count * 6), 3).setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("position", position);
      geometry.setAttribute("color", color);
      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.LineSegments(geometry, material);
      line.frustumCulled = false;
      line.visible = false;
      this.scene.add(line);
      return { pairs, count, size, line, position, color, posT: Number.NaN, colT: Number.NaN };
    });

    this.pulses = new THREE.InstancedMesh(this.pulseGeometry, this.pulseMaterial, PULSE_COUNT);
    this.pulses.instanceMatrix = new THREE.InstancedBufferAttribute(this.pulseMatrix, 16).setUsage(THREE.DynamicDrawUsage);
    this.pulses.frustumCulled = false;
    this.scene.add(this.pulses);

    const corners = (box: [number, number, number, number]) => {
      const zh = (CELL * DEPTH_FLAT) / 2;
      const out: number[] = [];
      for (const x of [box[0], box[1]]) for (const y of [box[2], box[3]]) for (const z of [-zh, zh]) out.push(x, y, z, 0);
      return Float32Array.from(out);
    };
    // The network framing also keeps every layer-label anchor in view.
    const anchors = buildLayerLabels().flat().flatMap((l) => [...l.anchor, 0]);
    this.netFit = Float32Array.from([...T.netFit, ...anchors]);
    this.graphCorners = corners(T.graphBox);
    this.wordCorners = corners(T.wordBox);
    const most = Math.max(this.netFit.length, this.graphCorners.length) / 4;
    this.fitA = new Float32Array(most);
    this.fitB = new Float32Array(most);
    this.fitC = new Float32Array(most);
  }

  /** Size in CSS pixels. */
  resize(width: number, height: number, dpr: number) {
    this.width = width;
    this.height = height;
    if (width <= 0 || height <= 0) return;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.fitAspect = Number.NaN;
  }

  /** Pointer in CSS pixels relative to the canvas; strength 0 turns the glow off. */
  setPointer(x: number, y: number, strength: number) {
    if (x === this.pointerX && y === this.pointerY && strength === this.pointerStrength) return;
    this.pointerX = x;
    this.pointerY = y;
    this.pointerStrength = strength;
    this.pointerDirty = true;
  }

  /** Projects a world point with the camera of the last rendered frame. */
  project(x: number, y: number, z: number, out: Projected): Projected {
    const e = this.viewProj.elements;
    const cw = e[3] * x + e[7] * y + e[11] * z + e[15];
    out.front = cw > 1e-6;
    out.x = ((e[0] * x + e[4] * y + e[8] * z + e[12]) / cw + 1) * 0.5 * this.width;
    out.y = (1 - (e[1] * x + e[5] * y + e[9] * z + e[13]) / cw) * 0.5 * this.height;
    return out;
  }

  /**
   * Draws one frame. Returns true while something still moves on its own
   * (easing glow, or the network stages' pulses and breathing); false means
   * the next frame would be identical, so the caller can stop its loop.
   * Buffers whose inputs did not change since the last frame are not rewritten.
   */
  render(state: FrameState): boolean {
    if (this.width <= 0 || this.height <= 0) return false;
    const { time, dt, motion, look } = state;
    const t = clamp(Number.isFinite(state.t) ? state.t : 0, 0, 2);
    const net = ease(t); // 0 flat graph .. 1 network look (stays 1 past t = 1)

    if (t !== this.stateT) {
      this.interpolate(t);
      this.stateT = t;
    }
    const lw = lookWeight(t);
    this.frame(t, net, (look ? look.yaw : 0) * lw, (look ? look.pitch : 0) * lw);
    this.light(net);
    const glowMoving = this.updateGlow(t, net, motion ? 1 - Math.exp(-dt * GLOW_RATE) : 1);
    const breathing = motion && net > 1e-3;
    this.writeCells(t, net, time, motion, breathing);
    this.writeEdges(t);
    const pulsing = this.writePulses(t, time, motion);
    this.glowChanged = false;

    this.renderer.render(this.scene, this.camera);
    return glowMoving || pulsing || breathing;
  }

  dispose() {
    for (const L of this.layers) {
      L.line.geometry.dispose();
      L.line.material.dispose();
    }
    this.cellsMesh.dispose();
    this.pulses.dispose();
    this.cellGeometry.dispose();
    this.cellMaterial.dispose();
    this.pulseGeometry.dispose();
    this.pulseMaterial.dispose();
    this.ambient.dispose();
    this.hemi.dispose();
    this.sun.dispose();
    this.scene.clear();
    this.renderer.dispose();
    try {
      this.renderer.forceContextLoss();
    } catch {
      // Context already lost; nothing left to release.
    }
  }

  // Positions, sizes, thickness and base colours of every cell at t.
  private interpolate(t: number) {
    const T = this.T;
    const { cur, curSize, curDepth, curCol } = this;
    const toMlp = t <= 1;
    const u = toMlp ? t : t - 1;
    for (let i = 0; i < this.n; i++) {
      const letter = T.cells[i].letter;
      let p: number;
      let A: Float32Array, B: Float32Array, sA: Float32Array, sB: Float32Array, cA: Float32Array, cB: Float32Array;
      let lift = 0;
      if (toMlp) {
        p = letter ? stagger(u, T.wordNorm[i], STAGGER_LETTERS) : stagger(u, T.colNorm[i], STAGGER_SINK);
        A = T.graphPos;
        B = T.mlpPos;
        sA = T.graphSize;
        sB = T.mlpSize;
        cA = this.colGraph;
        cB = this.colMlp;
        if (letter) lift = Math.sin(Math.PI * p) * LIFT;
        curDepth[i] = DEPTH_FLAT + (DEPTH_NET - DEPTH_FLAT) * p;
      } else {
        p = stagger(u, T.colNorm[i], STAGGER_FOLD);
        A = T.mlpPos;
        B = T.cnnPos;
        sA = T.mlpSize;
        sB = T.cnnSize;
        cA = this.colMlp;
        cB = this.colCnn;
        // Cells rising from the sunk graph arc up into place.
        if (T.mlpRole[i] === Role.Idle) lift = Math.sin(Math.PI * p) * LIFT * 0.6;
        curDepth[i] = DEPTH_NET;
      }
      const o = i * 3;
      cur[o] = A[o] + (B[o] - A[o]) * p;
      cur[o + 1] = A[o + 1] + (B[o + 1] - A[o + 1]) * p;
      cur[o + 2] = A[o + 2] + (B[o + 2] - A[o + 2]) * p + lift;
      curSize[i] = sA[i] + (sB[i] - sA[i]) * p;
      curCol[o] = cA[o] + (cB[o] - cA[o]) * p;
      curCol[o + 1] = cA[o + 1] + (cB[o + 1] - cA[o + 1]) * p;
      curCol[o + 2] = cA[o + 2] + (cB[o + 2] - cA[o + 2]) * p;
    }
  }

  // Flat: ambient only, at the strength (pi) that returns each albedo exactly,
  // so the graph shows GitHub's hex values. Network: light from the upper left
  // plus a sky/ground hemisphere so the cubes read as solids.
  private light(net: number) {
    this.ambient.intensity = Math.PI * (1 - 0.58 * net);
    this.hemi.intensity = Math.PI * 0.3 * net;
    this.sun.intensity = Math.PI * 0.78 * net;
  }

  // Camera: straight on through a long lens for the graph, easing into the
  // network canvas's 3/4 orbit. For each look, distance and lens shift are
  // solved so the framed set fits centred at any aspect; graph and network
  // framings are blended by `net`. Cached until t or the size changes.
  //
  // `dYaw`/`dPitch` (already weighted) turn the camera around the model's
  // centre; the framing is re-solved for the turned view so nothing clips.
  private frame(t: number, net: number, dYaw: number, dPitch: number) {
    const aspect = this.width / this.height;
    const narrow = this.width < NARROW_PX;
    if (t === this.fitT && aspect === this.fitAspect && narrow === this.fitNarrow && dYaw === this.fitYaw && dPitch === this.fitPitch) return;
    this.fitT = t;
    this.fitAspect = aspect;
    this.fitNarrow = narrow;
    this.fitYaw = dYaw;
    this.fitPitch = dPitch;
    this.viewVersion++;

    const yaw = (t <= 1 ? ORBIT.base * net : ORBIT.base + (t - 1) * ORBIT.perT) + dYaw;
    const elev = clamp(ORBIT.elevation * net + dPitch, -MAX_ELEVATION, MAX_ELEVATION);
    const fov = FOV_GRAPH + (FOV_NET - FOV_GRAPH) * net;
    const target = this.vTarget.copy(GRAPH_TARGET).lerp(NET_TARGET, net);
    const dir = this.vDir.set(Math.sin(yaw) * Math.cos(elev), Math.sin(elev), Math.cos(yaw) * Math.cos(elev));
    const fwd = this.vFwd.copy(dir).negate();
    this.vRight.crossVectors(fwd, this.camera.up).normalize();
    this.vUp.crossVectors(this.vRight, fwd);
    this.tanV = Math.tan((fov * Math.PI) / 360);
    this.tanH = this.tanV * aspect;

    const g = net < 1 ? this.solve(narrow ? this.wordCorners : this.graphCorners, GRAPH_FILL, 0, this.fitG) : null;
    const nf = net > 0 ? this.solve(this.netFit, NET_FILL, LABEL_ROOM_PX, this.fitN) : null;
    let D: number, sx: number, sy: number;
    if (g && nf) {
      D = Math.exp(Math.log(g.D) * (1 - net) + Math.log(nf.D) * net);
      sx = g.sx * (1 - net) + nf.sx * net;
      sy = g.sy * (1 - net) + nf.sy * net;
    } else {
      const f = (g ?? nf) as Fit;
      D = f.D;
      sx = f.sx;
      sy = f.sy;
    }

    const cam = this.camera;
    cam.fov = fov;
    cam.aspect = aspect;
    cam.near = Math.max(0.1, D * 0.05);
    cam.far = D + 60;
    cam.position.copy(target).addScaledVector(dir, D);
    cam.lookAt(target);
    cam.updateProjectionMatrix();
    const e = cam.projectionMatrix.elements;
    e[8] = sx;
    e[9] = sy;
    cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    cam.updateMatrixWorld();
    this.viewProj.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
    // One graph pitch in pixels at the graph plane, for the hover radius.
    this.pitchPx = ((PITCH / (D * this.tanH)) * this.width) / 2;
  }

  // Distance and lens shift that fit the [x, y, z, r] points `P` in `fill` of
  // the view from the current camera direction (vRight/vUp/vFwd around
  // vTarget). `roomPx` reserves that many pixels above them (label space).
  private solve(P: Float32Array, fill: number, roomPx: number, out: Fit): Fit {
    const { vRight: right, vUp: up, vFwd: fwd, vTarget: target, fitA: a, fitB: b, fitC: c, tanH, tanV } = this;
    const room = Math.min(0.3, roomPx / Math.max(1, this.height)); // in NDC half-units
    const count = P.length / 4;
    for (let i = 0; i < count; i++) {
      const x = P[i * 4] - target.x;
      const y = P[i * 4 + 1] - target.y;
      const z = P[i * 4 + 2] - target.z;
      a[i] = x * right.x + y * right.y + z * right.z;
      b[i] = x * up.x + y * up.y + z * up.z;
      c[i] = x * fwd.x + y * fwd.y + z * fwd.z;
    }
    let lo = 1;
    let hi = 4000;
    // Geometric bisection: 24 steps pin D to within ~5e-7 of itself (sub-pixel).
    for (let it = 0; it < 24; it++) {
      const mid = Math.sqrt(lo * hi);
      if (this.measure(P, count, mid, fill, room)) hi = mid;
      else lo = mid;
    }
    this.measure(P, count, hi, fill, room);
    const bd = this.bounds;
    out.D = hi;
    out.sx = (bd.x0 + bd.x1) / 2 / tanH;
    out.sy = (bd.y0 + bd.y1) / 2 / tanV + room;
    return out;
  }

  private measure(P: Float32Array, count: number, D: number, fill: number, room: number): boolean {
    const { fitA: a, fitB: b, fitC: c, bounds } = this;
    bounds.x0 = bounds.y0 = Infinity;
    bounds.x1 = bounds.y1 = -Infinity;
    for (let i = 0; i < count; i++) {
      const depth = c[i] + D;
      if (depth <= 0.2) return false;
      const r = P[i * 4 + 3];
      bounds.x0 = Math.min(bounds.x0, (a[i] - r) / depth);
      bounds.x1 = Math.max(bounds.x1, (a[i] + r) / depth);
      bounds.y0 = Math.min(bounds.y0, (b[i] - r) / depth);
      bounds.y1 = Math.max(bounds.y1, (b[i] + r) / depth);
    }
    return (bounds.x1 - bounds.x0) / 2 <= this.tanH * fill && (bounds.y1 - bounds.y0) / 2 <= this.tanV * (fill - room);
  }

  // Graph: cells within about a cell of the pointer brighten one level, as
  // when hovering GitHub's graph. Network: the network canvas's proximity glow.
  // Skipped when pointer, camera and t are unchanged and every glow has
  // settled. Returns whether any glow is still easing; sets glowChanged.
  private updateGlow(t: number, net: number, follow: number): boolean {
    const glow = this.glow;
    const n = this.n;
    let moving = false;
    if (this.pointerStrength <= 0) {
      this.pointerDirty = false;
      if (!this.anyGlow) return false;
      let any = false;
      for (let k = 0; k < n; k++) {
        if (glow[k] === 0) continue;
        glow[k] = glow[k] < 1e-3 ? 0 : glow[k] * (1 - follow);
        any = any || glow[k] > 0;
        moving = true;
      }
      this.anyGlow = any;
      this.glowChanged = this.glowChanged || moving;
      return any;
    }
    const settled = !this.pointerDirty && t === this.glowT && this.viewVersion === this.glowView && !this.glowEasing;
    if (settled) return false;
    this.pointerDirty = false;
    this.glowT = t;
    this.glowView = this.viewVersion;

    const e = this.viewProj.elements;
    const w = this.width;
    const h = this.height;
    const netRadius = clamp(Math.min(w, h) * 0.15, 70, 140);
    const hoverRadius = Math.max(8, this.pitchPx * 1.6);
    const radius = hoverRadius + (netRadius - hoverRadius) * net;
    const cur = this.cur;
    let any = false;
    let changed = false;
    for (let k = 0; k < n; k++) {
      let target = 0;
      // Sunk (and merging) cells stay dark: only cells at least ~half a graph
      // cell wide respond.
      if (this.curSize[k] > CELL * 0.6) {
        const x = cur[k * 3];
        const y = cur[k * 3 + 1];
        const z = cur[k * 3 + 2];
        const cw = e[3] * x + e[7] * y + e[11] * z + e[15];
        const sx = ((e[0] * x + e[4] * y + e[8] * z + e[12]) / cw + 1) * 0.5 * w;
        const sy = (1 - (e[1] * x + e[5] * y + e[9] * z + e[13]) / cw) * 0.5 * h;
        const d = Math.hypot(sx - this.pointerX, sy - this.pointerY);
        target = this.pointerStrength * smooth01(1 - d / radius);
      }
      const prev = glow[k];
      let g = prev + (target - prev) * follow;
      if (g < 1e-3) g = 0;
      if (Math.abs(target - g) < 1e-3) g = target < 1e-3 ? 0 : target;
      glow[k] = g;
      if (g !== prev) changed = true;
      if (Math.abs(g - target) > 0) moving = true;
      if (g > 0) any = true;
    }
    this.anyGlow = any;
    this.glowEasing = moving;
    this.glowChanged = this.glowChanged || changed;
    return moving;
  }

  // Matrices: rewritten when t, glow or breathing changed them. Colours: only
  // the range of cells whose colour actually changed is re-uploaded.
  private writeCells(t: number, net: number, time: number, motion: boolean, breathing: boolean) {
    const tChanged = t !== this.cellsT || motion !== this.cellsMotion;
    const glowChanged = this.glowChanged;
    if (!tChanged && !glowChanged && !breathing) return;
    this.cellsT = t;
    this.cellsMotion = motion;
    // Only the diagonal and translation are ever non-zero (zero-initialised).
    const m = this.cellMatrix;
    const { cur, curSize, curDepth, glow, n } = this;
    for (let k = 0; k < n; k++) {
      const breath = breathing ? Math.sin(time * BREATH_RATE + k * 0.71) * net : 0;
      const s = curSize[k] * (1 + BREATH_AMP * breath) * (1 + GLOW_SCALE * glow[k] * net);
      const o = k * 16;
      m[o] = s;
      m[o + 5] = s;
      m[o + 10] = s * curDepth[k];
      m[o + 12] = cur[k * 3];
      m[o + 13] = cur[k * 3 + 1];
      m[o + 14] = cur[k * 3 + 2];
      m[o + 15] = 1;
    }
    this.cellsMesh.instanceMatrix.needsUpdate = true;
    if (tChanged || glowChanged) this.writeColors(net);
  }

  private writeColors(net: number) {
    const col = this.cellColor;
    const { curCol, colUp, glow, cGlow, n } = this;
    let lo = n;
    let hi = -1;
    for (let k = 0; k < n; k++) {
      const g = glow[k];
      const up = g * (1 - net);
      const lit = g * net * 0.7;
      const o = k * 3;
      let r = curCol[o];
      let gr = curCol[o + 1];
      let b = curCol[o + 2];
      r += (colUp[o] - r) * up;
      gr += (colUp[o + 1] - gr) * up;
      b += (colUp[o + 2] - b) * up;
      r += (cGlow.r - r) * lit;
      gr += (cGlow.g - gr) * lit;
      b += (cGlow.b - b) * lit;
      // Compare as stored (float32), or every value would look changed.
      if (Math.fround(r) !== col[o] || Math.fround(gr) !== col[o + 1] || Math.fround(b) !== col[o + 2]) {
        col[o] = r;
        col[o + 1] = gr;
        col[o + 2] = b;
        if (k < lo) lo = k;
        hi = k;
      }
    }
    const attr = this.cellsMesh.instanceColor;
    if (!attr || hi < 0) return;
    attr.clearUpdateRanges();
    attr.addUpdateRange(lo * 3, (hi - lo + 1) * 3);
    attr.needsUpdate = true;
  }

  // MLP edges fade in as the letters land and out as the CNN forms; CNN edges
  // fade in over the fold. Edges dim with whichever end is still small.
  // Positions are rewritten only when t moved; colours when t or glow did.
  private writeEdges(t: number) {
    const density = clamp(Math.sqrt(this.width * this.height) / 900, 0.55, 1);
    const { cur, curSize, glow, cEdge } = this;
    for (let li = 0; li < this.layers.length; li++) {
      const L = this.layers[li];
      const w = li === 0 ? (t <= 1 ? smooth01((t - 0.55) / 0.45) : 1 - ease(t - 1)) : t <= 1 ? 0 : ease(t - 1);
      L.line.visible = w > 0.01 && L.count > 0;
      if (!L.line.visible) continue;
      L.line.material.opacity = EDGE_OPACITY * w * density;
      if (L.posT !== t) {
        const arr = L.position.array as Float32Array;
        for (let e = 0; e < L.count; e++) {
          const a = L.pairs[e * 2] * 3;
          const b = L.pairs[e * 2 + 1] * 3;
          const o = e * 6;
          arr[o] = cur[a];
          arr[o + 1] = cur[a + 1];
          arr[o + 2] = cur[a + 2];
          arr[o + 3] = cur[b];
          arr[o + 4] = cur[b + 1];
          arr[o + 5] = cur[b + 2];
        }
        L.position.needsUpdate = true;
        L.posT = t;
      }
      if (L.colT !== t || this.glowChanged) {
        const arr = L.color.array as Float32Array;
        for (let e = 0; e < L.count; e++) {
          const a = L.pairs[e * 2];
          const b = L.pairs[e * 2 + 1];
          const presence = Math.min(1, curSize[a] / L.size[a], curSize[b] / L.size[b]);
          const gain = presence * (1 + EDGE_GLOW_GAIN * Math.max(glow[a], glow[b]));
          const o = e * 6;
          arr[o] = arr[o + 3] = cEdge.r * gain;
          arr[o + 1] = arr[o + 4] = cEdge.g * gain;
          arr[o + 2] = arr[o + 5] = cEdge.b * gain;
        }
        L.color.needsUpdate = true;
        L.colT = t;
      }
    }
  }

  // Pulses ride the active network's edges: they appear once the MLP has
  // formed, shrink away mid-fold where the active network flips, and grow back.
  private writePulses(t: number, time: number, motion: boolean): boolean {
    const L = this.layers[t < 1.5 ? 0 : 1];
    const vis = !motion || L.count === 0 ? 0 : t <= 1 ? smooth01((t - 0.75) / 0.25) : smooth01((Math.abs(ease(t - 1) - 0.5) - 0.08) / 0.34);
    this.pulses.visible = vis > 0.001;
    if (!this.pulses.visible) return false;
    const m = this.pulseMatrix;
    const cur = this.cur;
    for (let p = 0; p < PULSE_COUNT; p++) {
      const e = (p * 37) % L.count;
      const a = L.pairs[e * 2] * 3;
      const b = L.pairs[e * 2 + 1] * 3;
      const u = (time * PULSE_SPEED + p * 0.173) % 1;
      const o = p * 16;
      m.fill(0, o, o + 16);
      m[o] = m[o + 5] = m[o + 10] = vis;
      m[o + 12] = cur[a] + (cur[b] - cur[a]) * u;
      m[o + 13] = cur[a + 1] + (cur[b + 1] - cur[a + 1]) * u;
      m[o + 14] = cur[a + 2] + (cur[b + 2] - cur[a + 2]) * u;
      m[o + 15] = 1;
    }
    this.pulses.instanceMatrix.needsUpdate = true;
    return true;
  }
}
