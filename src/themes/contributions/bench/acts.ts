// The data bench: four problems from projects Sounic shipped, acted out by the
// same rounded cells as the hero graph. Pure: where every cell is, how big and
// what colour, for an act at s seconds since it started, plus the live readout
// and the labels. No three.js and no DOM; BenchScene draws it and BenchCanvas
// runs the clock.
//
// The numbers the readouts settle on are the real ones: 1.84% sepsis hours (so
// a model that always says no scores 98.2%), 80 to 95% of each lab missing,
// the 92 F1 races of 2022 to 2025 (22, 22, 24, 24) validated in race order,
// and 30 Monte Carlo paths per forecast. The walks themselves are a seeded
// sketch, not market data.

import { GREENS } from '../contrib/grid'

export const COLS = 32
export const ROWS = 17
/** Cells in one sheet: 544, so 10 sepsis hours are 1.84%. */
export const SHEET = COLS * ROWS
export const ACT_COUNT = 4
/** Seconds after which an act no longer changes on its own. */
export const ACT_END = [4.9, 4.1, 4.7, 4.8] as const

const TILE = 0.82 // side of a sheet cell (pitch 1)
const TILE_H = 0.22 // its thickness

// ─── colours (linear RGB, as three.js stores instance colours) ──────────
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16)
  return [lin(((n >> 16) & 255) / 255), lin(((n >> 8) & 255) / 255), lin((n & 255) / 255)]
}
const C = {
  empty: rgb(GREENS[0]),
  checked: rgb('#21262d'),
  idle: rgb('#3d444d'),
  ground: rgb('#0d1117'),
  glow: rgb('#aff5b4'),
  bright: rgb(GREENS[4]),
  levels: GREENS.map(rgb),
}

// ─── small maths ────────────────────────────────────────────────────────
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3)
const easeInOut = (x: number) => {
  const c = clamp01(x)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** One cell's state, written by sample(); reused, never reallocated. */
export interface CellOut {
  x: number
  y: number
  z: number
  sx: number
  sy: number
  sz: number
  r: number
  g: number
  b: number
}

/** The box each act keeps in frame, and the camera's resting angle on it. */
export interface ActView {
  box: readonly [number, number, number, number, number, number] // x0 y0 z0 x1 y1 z1
  yaw: number
  elevation: number
}

/** A word pinned to a point of the figure. */
export interface BenchLabel {
  text: string
  short: string
  /** 'above': centred over the point; 'left': ends just left of it. */
  align: 'above' | 'left'
  x: number
  y: number
  z: number
}

const HALF_X = COLS / 2 + 0.4
const HALF_Z = ROWS / 2 + 0.4

// ─── act 1, Rare: 10 sepsis hours in 544 ────────────────────────────────
const POSITIVES = 10
const SWEEP_FROM = 2.4
const SWEEP_TO = 4.6
const SWEEP_X0 = -HALF_X - 1
const SWEEP_X1 = HALF_X + 1
const BEAM = 1.4

// ─── act 2, Missing: 8 vitals columns, 24 lab columns 80 to 95% missing ─
const VITALS = 8
const VITAL_MISSING = 0.08
const FALL = 0.6

// ─── act 3, 92 races: the real calendar, tested one race at a time ──────
const SEASONS = [
  { year: 2022, races: 22 },
  { year: 2023, races: 22 },
  { year: 2024, races: 24 },
  { year: 2025, races: 24 },
] as const
const RACES = SEASONS.reduce((n, s) => n + s.races, 0) // 92
const RACE_COLS = 24
const SEASON_GAP = 2.3
const FIRST_TEST = SEASONS[0].races // the first race of 2023, trained on 2022 alone
const WALK_FROM = 0.9
const WALK_TO = 4.3
const PILLAR = 1.9
const RACE_H = 0.36 // races stand a little taller than sheet cells

// ─── act 4, 30 paths: Monte Carlo futures from a forecast ───────────────
export const CELL_COUNT = SHEET // every act fits in one sheet of cells
const HISTORY = 21 // candles so far, the last one is now
const PATHS = 30
const STEPS = 17
const FAN_CELLS = HISTORY + PATHS * STEPS // 531
const HIST_DX = 0.55
const Y_SCALE = 1.9 // prices are stretched upward so the fan opens across the frame
const STEP_DX = 0.82
const PATH_DZ = 0.13
const DOT = 0.5
const HIST_FROM = 0.2
const HIST_STEP = 0.045
const GROW_FROM = 1.3
const GROW_STEP = 0.11
const BAND_FROM = 3.6
const BAND_SPAN = 0.8
const BAND_TAIL = 3 // paths below the 10th / above the 90th percentile at each step

// Seeded random walks: the price so far, then 30 futures from now.
const FAN = (() => {
  const rand = mulberry32(30)
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand())
  const hist = new Float32Array(HISTORY)
  for (let j = 1; j < HISTORY; j++) hist[j] = hist[j - 1] + 0.32 * gauss() + 0.06
  const now = hist[HISTORY - 1]
  for (let j = 0; j < HISTORY; j++) hist[j] = (hist[j] - now) * Y_SCALE
  const y = new Float32Array(PATHS * (STEPS + 1)) // y[p * (STEPS + 1) + k], k = 0 is now
  for (let p = 0; p < PATHS; p++) for (let k = 1; k <= STEPS; k++) y[p * (STEPS + 1) + k] = y[p * (STEPS + 1) + k - 1] + (0.62 * gauss() + 0.03) * Y_SCALE
  // per step: which paths sit inside the band, and the median path by final value
  const inside = new Uint8Array(PATHS * (STEPS + 1))
  const order = Array.from({ length: PATHS }, (_, q) => q)
  for (let k = 1; k <= STEPS; k++) {
    order.sort((a, b) => y[a * (STEPS + 1) + k] - y[b * (STEPS + 1) + k])
    order.forEach((q, rank) => (inside[q * (STEPS + 1) + k] = rank >= BAND_TAIL && rank < PATHS - BAND_TAIL ? 1 : 0))
  }
  const median = order[PATHS >> 1]
  let lo = 0
  let hi = 0
  for (const v of hist) {
    lo = Math.min(lo, v)
    hi = Math.max(hi, v)
  }
  for (const v of y) {
    lo = Math.min(lo, v)
    hi = Math.max(hi, v)
  }
  let histTop = -Infinity
  for (let j = 0; j < HISTORY; j++) histTop = Math.max(histTop, hist[j])
  let fanTop = -Infinity
  for (let p = 0; p < PATHS; p++) fanTop = Math.max(fanTop, y[p * (STEPS + 1) + STEPS])
  return { hist, y, inside, median, lo, hi, histTop, fanTop }
})()

const raceRowZ = (r: number) => (r - (SEASONS.length - 1) / 2) * SEASON_GAP
const RACE_X0 = -(RACE_COLS - 1) / 2

export const ACT_VIEWS: readonly ActView[] = [
  { box: [-HALF_X, 0, -HALF_Z, HALF_X, 2.1, HALF_Z], yaw: -0.55, elevation: 0.74 },
  { box: [-HALF_X, -0.4, -HALF_Z, HALF_X, 0.3, HALF_Z], yaw: -0.6, elevation: 0.8 },
  { box: [RACE_X0 - 2.6, 0, raceRowZ(0) - 0.8, -RACE_X0 + 0.6, PILLAR, raceRowZ(3) + 0.8], yaw: -0.36, elevation: 1.02 },
  { box: [-(HISTORY - 1) * HIST_DX - 0.6, FAN.lo - 0.4, -PATHS * PATH_DZ * 0.5 - 0.4, STEPS * STEP_DX + 0.6, FAN.hi + 0.9, PATHS * PATH_DZ * 0.5 + 0.4], yaw: -0.24, elevation: 0.2 },
]

export const ACT_LABELS: readonly (readonly BenchLabel[])[] = [
  [],
  [],
  SEASONS.map((s, r) => ({ text: String(s.year), short: String(s.year), align: 'left' as const, x: RACE_X0 - 0.9, y: 0.1, z: raceRowZ(r) })),
  [
    { text: 'Price so far', short: 'Past', align: 'above', x: -(HISTORY - 1) * HIST_DX * 0.5, y: FAN.histTop + 0.5, z: 0 },
    { text: '30 futures', short: '30 paths', align: 'above', x: STEPS * STEP_DX - 1.5, y: FAN.fanTop + 0.6, z: 0 },
  ],
]

// ─── precomputed layout, built once ─────────────────────────────────────

interface Bench {
  baseX: Float32Array
  baseZ: Float32Array
  positiveRank: Int16Array // act 1: -1, or the order the pillar rises in
  level: Uint8Array // act 2: the value's green level, 1..4
  dropAt: Float32Array // act 2: when a missing value starts to fall; Infinity if present
  labDrops: Float32Array // act 2: drop times of missing labs, sorted
  vitalDrops: Float32Array
  labCount: number
  vitalCount: number
  raceX: Float32Array // act 3
  raceZ: Float32Array
}

let built: Bench | null = null

function build(): Bench {
  const rand = mulberry32(1840)

  const baseX = new Float32Array(SHEET)
  const baseZ = new Float32Array(SHEET)
  const colNorm = new Float32Array(SHEET)
  for (let j = 0; j < SHEET; j++) {
    const col = j % COLS
    const row = (j / COLS) | 0
    baseX[j] = col - (COLS - 1) / 2
    baseZ[j] = row - (ROWS - 1) / 2
    colNorm[j] = col / (COLS - 1)
    rand() // keeps the seeded sequence (and so acts 1 and 2) as first drawn
  }

  // Act 1: ten positives, spread out (no two within two cells of each other).
  const positiveRank = new Int16Array(SHEET).fill(-1)
  const picked: number[] = []
  while (picked.length < POSITIVES) {
    const j = Math.floor(rand() * SHEET)
    if (picked.some((k) => Math.abs(baseX[k] - baseX[j]) < 3 && Math.abs(baseZ[k] - baseZ[j]) < 3)) continue
    picked.push(j)
  }
  picked.sort((a, b) => baseX[a] - baseX[b]).forEach((j, k) => (positiveRank[j] = k))

  // Act 2: each lab column gets its own missing rate in 80..95%.
  const rate = Array.from({ length: COLS }, (_, c) => (c < VITALS ? VITAL_MISSING : 0.8 + 0.15 * rand()))
  const level = new Uint8Array(SHEET)
  const dropAt = new Float32Array(SHEET)
  const labDrops: number[] = []
  const vitalDrops: number[] = []
  for (let j = 0; j < SHEET; j++) {
    const col = j % COLS
    level[j] = 1 + Math.min(3, Math.floor(rand() * 4))
    const missing = rand() < rate[col]
    const t = 1.1 + 1.6 * colNorm[j] + 0.6 * rand()
    dropAt[j] = missing ? t : Infinity
    if (missing) (col < VITALS ? vitalDrops : labDrops).push(t)
  }
  labDrops.sort((a, b) => a - b)
  vitalDrops.sort((a, b) => a - b)

  // Act 3: one row per season, races left to right.
  const raceX = new Float32Array(RACES)
  const raceZ = new Float32Array(RACES)
  let g = 0
  SEASONS.forEach((season, r) => {
    for (let k = 0; k < season.races; k++, g++) {
      raceX[g] = RACE_X0 + k
      raceZ[g] = raceRowZ(r)
    }
  })

  return {
    baseX, baseZ, positiveRank, level, dropAt,
    labDrops: Float32Array.from(labDrops),
    vitalDrops: Float32Array.from(vitalDrops),
    labCount: (COLS - VITALS) * ROWS,
    vitalCount: VITALS * ROWS,
    raceX, raceZ,
  }
}

const bench = () => (built ??= build())

// ─── per-cell state ─────────────────────────────────────────────────────

const setCol = (o: CellOut, c: readonly number[]) => {
  o.r = c[0]
  o.g = c[1]
  o.b = c[2]
}
const mixCol = (o: CellOut, a: readonly number[], b: readonly number[], k: number) => {
  o.r = a[0] + (b[0] - a[0]) * k
  o.g = a[1] + (b[1] - a[1]) * k
  o.b = a[2] + (b[2] - a[2]) * k
}
/** Moves the cell's own colour toward c by k. */
const tint = (o: CellOut, c: readonly number[], k: number) => {
  o.r += (c[0] - o.r) * k
  o.g += (c[1] - o.g) * k
  o.b += (c[2] - o.b) * k
}
const hide = (o: CellOut) => {
  o.sx = o.sy = o.sz = 0
}
const tile = (o: CellOut, x: number, z: number) => {
  o.x = x
  o.z = z
  o.y = TILE_H / 2
  o.sx = o.sz = TILE
  o.sy = TILE_H
}

/** Where cell i is in act `act`, s seconds after the act began. */
export function sample(act: number, s: number, i: number, o: CellOut) {
  const B = bench()
  if (act === 3) return sampleFan(s, i, o)
  if (act === 2) return sampleRaces(s, i, o, B)
  tile(o, B.baseX[i], B.baseZ[i])

  if (act === 0) {
    // Rare: ten pillars rise, then a model that always says no sweeps across.
    const rank = B.positiveRank[i]
    const front = SWEEP_X0 + (SWEEP_X1 - SWEEP_X0) * clamp01((s - SWEEP_FROM) / (SWEEP_TO - SWEEP_FROM))
    const swept = s >= SWEEP_FROM && front >= o.x
    const beam = s >= SWEEP_FROM && s <= SWEEP_TO + 0.4 ? Math.max(0, 1 - Math.abs(front - o.x) / BEAM) : 0
    if (rank >= 0) {
      const p = easeOut((s - 0.9 - 0.06 * rank) / 0.7)
      o.sy = TILE_H + (2.0 - TILE_H) * p
      o.y = o.sy / 2
      setCol(o, swept ? C.levels[1] : C.bright)
    } else {
      setCol(o, swept ? C.checked : C.empty)
      o.y -= 0.08 * beam
    }
    if (beam > 0) tint(o, C.glow, 0.55 * beam * beam)
    return
  }

  if (act === 1) {
    // Missing: most lab values fall through the floor.
    setCol(o, C.levels[B.level[i]])
    const t0 = B.dropAt[i]
    if (s > t0) {
      const p = clamp01((s - t0) / FALL)
      if (p >= 1) return hide(o)
      o.y -= 2.2 * p * p
      o.sx = o.sz = TILE * (1 - p)
      o.sy = TILE_H * (1 - p)
      mixCol(o, C.levels[B.level[i]], C.ground, p)
    }
    return
  }
}

/** The race being tested at s, as a continuous index (FIRST_TEST .. RACES - 1). */
const testAt = (s: number) => FIRST_TEST + (RACES - 1 - FIRST_TEST) * easeInOut((s - WALK_FROM) / (WALK_TO - WALK_FROM))

// 92 races: a test pillar walks forward through the calendar. Behind it the
// races it may train on (green); ahead, races still to come, sunk and dark.
function sampleRaces(s: number, i: number, o: CellOut, B: Bench) {
  if (i >= RACES) {
    tile(o, B.baseX[i], B.baseZ[i])
    setCol(o, C.empty)
    return hide(o)
  }
  tile(o, B.raceX[i], B.raceZ[i])
  o.sy = RACE_H
  const rise = easeOut((s - 0.3) / 0.6)
  const d = testAt(s) - i // > 0: already raced
  const pillar = Math.max(0, 1 - Math.abs(d)) * rise
  const past = clamp01(d + 0.5)
  mixCol(o, C.empty, C.levels[3], past)
  if (pillar > 0) tint(o, C.bright, Math.min(1, pillar * 1.6))
  o.sy = RACE_H + (PILLAR - RACE_H) * pillar
  o.y = o.sy / 2 - 0.16 * (1 - past) * (1 - pillar)
  const size = TILE * (0.84 + 0.16 * Math.max(past, pillar))
  o.sx = o.sz = size
}

const dot = (o: CellOut, x: number, y: number, z: number, size: number) => {
  o.x = x
  o.y = y
  o.z = z
  o.sx = o.sy = o.sz = size
}

// 30 paths: the price so far draws in, then 30 futures fan out from now,
// step by step. The quantile band stays lit, the tails dim, the median glows.
function sampleFan(s: number, i: number, o: CellOut) {
  if (i >= FAN_CELLS) {
    tile(o, 0, 0)
    setCol(o, C.empty)
    return hide(o)
  }
  if (i < HISTORY) {
    const p = easeOut((s - HIST_FROM - HIST_STEP * i) / 0.25)
    dot(o, -(HISTORY - 1 - i) * HIST_DX, FAN.hist[i], 0, DOT * p)
    setCol(o, i === HISTORY - 1 ? C.bright : C.levels[3])
    return
  }
  const m = i - HISTORY
  const path = (m / STEPS) | 0
  const k = (m % STEPS) + 1
  const at = path * (STEPS + 1) + k
  const p = easeOut((s - GROW_FROM - GROW_STEP * k - 0.01 * path) / 0.3)
  // each cell grows out of the one before it on its path
  const prevY = FAN.y[at - 1]
  const x = (k - 1 + p) * STEP_DX
  const y = prevY + (FAN.y[at] - prevY) * p
  dot(o, x, y, (path - (PATHS - 1) / 2) * PATH_DZ, DOT * 0.72 * p)
  setCol(o, C.levels[2])
  const band = easeOut((s - BAND_FROM - (BAND_SPAN * k) / STEPS) / 0.3)
  if (band > 0) {
    if (path === FAN.median) mixCol(o, C.levels[2], C.glow, band)
    else if (FAN.inside[at]) mixCol(o, C.levels[2], C.bright, band)
    else {
      mixCol(o, C.levels[2], C.idle, band)
      o.sx = o.sy = o.sz = DOT * 0.72 * (1 - 0.3 * band)
    }
  }
}

/** Cells act `act` uses (from index 0): fewer instances to draw. */
export const actCellCount = (act: number) => (act === 2 ? RACES : act === 3 ? FAN_CELLS : SHEET)

/** The box act `act` keeps in frame (x0 y0 z0 x1 y1 z1), written into out. */
export function viewBoxOf(act: number, _s: number, out: Float32Array) {
  const v = ACT_VIEWS[act].box
  for (let k = 0; k < 6; k++) out[k] = v[k]
}

// ─── readouts ───────────────────────────────────────────────────────────

const countUntil = (sorted: Float32Array, s: number) => {
  let lo = 0
  let hi = sorted.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (sorted[mid] <= s) lo = mid + 1
    else hi = mid
  }
  return lo
}
const pct = (n: number, d: number, digits = 0) => `${((100 * n) / Math.max(1, d)).toFixed(digits)}%`

/** The live line under the figure for act `act` at s. */
export function readoutOf(act: number, s: number): string {
  const B = bench()
  if (act === 0) {
    if (s < SWEEP_FROM) return `${SHEET} ICU hours · ${POSITIVES} sepsis`
    const front = SWEEP_X0 + (SWEEP_X1 - SWEEP_X0) * clamp01((s - SWEEP_FROM) / (SWEEP_TO - SWEEP_FROM))
    let checked = 0
    let missed = 0
    for (let j = 0; j < SHEET; j++) {
      if (B.baseX[j] > front) continue
      checked++
      if (B.positiveRank[j] >= 0) missed++
    }
    if (checked === 0) return 'Model answers no to every hour'
    return `Always no · accuracy ${pct(checked - missed, checked, 1)} · caught 0 of ${POSITIVES}`
  }
  if (act === 1) {
    const labs = countUntil(B.labDrops, s)
    const vitals = countUntil(B.vitalDrops, s)
    return `Labs missing ${pct(labs, B.labCount)} · vitals ${pct(vitals, B.vitalCount)}`
  }
  if (act === 2) {
    if (s < WALK_FROM) return `${RACES} races · 2022 to 2025`
    if (s > WALK_TO + 0.2) return `${RACES} races · zero leakage`
    const t = Math.round(testAt(s))
    return `Train on races 1 to ${t} · test race ${t + 1} · ${RACES - 1 - t} unseen`
  }
  if (s < GROW_FROM) return 'Price so far · one forecast to make'
  if (s < BAND_FROM) {
    const step = Math.max(0, Math.min(STEPS, Math.floor((s - GROW_FROM) / GROW_STEP)))
    return `${PATHS} sampled futures · step ${step} of ${STEPS}`
  }
  if (s < BAND_FROM + BAND_SPAN + 0.3) return 'Quantile band · tails set aside'
  return `${PATHS} paths · risk set from the quantiles`
}

/** Same as readoutOf, for the moment the act has settled. */
export const finalReadout = (act: number) => readoutOf(act, ACT_END[act] + 1)
