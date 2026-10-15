// The imperative half of BenchCanvas: one InstancedMesh of rounded cells that
// acts out the four problems in acts.ts. Switching acts snapshots where every
// cell is and blends from there into the new act (a wave from left to right),
// so a click mid-act never jumps. The camera eases to each act's angle and
// framing; the look-around offsets are added on top. Nothing is allocated per
// frame, and buffers are only rewritten while an act or a blend still moves.

import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { ACT_END, ACT_VIEWS, CELL_COUNT, actCellCount, sample, setBenchMode, viewBoxOf, type CellOut } from './acts'
import { PALETTES, currentMode, type Mode } from '../mode'

const FOV = 28
const FILL = 0.86 // share of the frame the act's box may use
const BLEND = 1.15 // seconds for the wave from the old act into the new one
const BLEND_WAVE = 0.32 // share of the blend spent on the left-to-right delay
const LIFT = 0.7 // cells arc up while they travel between acts
const CAMERA_RATE = 3.2 // 1/s, camera easing between acts
const MIN_ELEVATION = 0.12
const MAX_ELEVATION = 1.42
const EPS = 1e-4

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const easeInOut = (x: number) => {
  const c = clamp01(x)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

export interface BenchFrame {
  dt: number
  motion: boolean
  yaw: number // look-around offsets, radians
  pitch: number
}

/** A projected point in CSS pixels. */
export interface Projected {
  x: number
  y: number
}

export class BenchScene {
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 400)
  private readonly geometry = new RoundedBoxGeometry(1, 1, 1, 1, 0.16) // ~108 triangles a cell
  private readonly material = new THREE.MeshLambertMaterial({ color: 0xffffff })
  private readonly mesh: THREE.InstancedMesh
  private readonly matrix = new Float32Array(CELL_COUNT * 16)
  private readonly color = new Float32Array(CELL_COUNT * 3)
  private readonly ambient = new THREE.AmbientLight(0xffffff, Math.PI * 0.42)
  private readonly hemi = new THREE.HemisphereLight(0xffffff, 0x0d1117, Math.PI * 0.3)
  private readonly sun = new THREE.DirectionalLight(0xffffff, Math.PI * 0.78)

  // What is on screen now (pos xyz, scale xyz, colour rgb per cell) and the snapshot blended from.
  private readonly cur = new Float32Array(CELL_COUNT * 9)
  private readonly snap = new Float32Array(CELL_COUNT * 9)
  private readonly out: CellOut = { x: 0, y: 0, z: 0, sx: 0, sy: 0, sz: 0, r: 0, g: 0, b: 0 }
  private snapCount = 0

  private act = 0
  private s = 0 // seconds into the act
  private blend = BLEND // seconds into the blend; >= BLEND when done
  private written = false // the buffers hold the settled act

  // Camera: eased angle and box.
  private yaw = ACT_VIEWS[0].yaw
  private elevation = ACT_VIEWS[0].elevation
  private readonly box = Float32Array.from(ACT_VIEWS[0].box)
  private readonly boxTarget = new Float32Array(6)
  private readonly camLast = new Float32Array(10).fill(Number.NaN) // yaw, elev, box x6, width, height
  private camMoving = false
  private readonly vDir = new THREE.Vector3()
  private readonly vRight = new THREE.Vector3()
  private readonly vUp = new THREE.Vector3()
  private readonly vFwd = new THREE.Vector3()
  private readonly up = new THREE.Vector3(0, 1, 0)

  private readonly viewProj = new THREE.Matrix4()
  /** Bumped whenever the camera (and so every projection) changes. */
  viewVersion = 0

  private width = 0
  private height = 0

  /** Throws when WebGL is unavailable; the caller shows the fallback. */
  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setClearColor(0x000000, 0)
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, CELL_COUNT)
    this.mesh.instanceMatrix = new THREE.InstancedBufferAttribute(this.matrix, 16).setUsage(THREE.DynamicDrawUsage)
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(this.color, 3).setUsage(THREE.DynamicDrawUsage)
    this.mesh.frustumCulled = false
    this.sun.position.set(-4, 10, 8)
    this.scene.add(this.mesh, this.ambient, this.hemi, this.sun)
    this.setMode(currentMode())
    // Start on act 0 already settled at its first frame (no blend from nothing).
    this.fill(0, 0)
    this.snapCount = actCellCount(0)
  }

  resize(width: number, height: number, dpr: number) {
    this.width = width
    this.height = height
    if (width <= 0 || height <= 0) return
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(width, height, false)
    this.camLast[0] = Number.NaN
  }

  /** Light or dark: the next render rewrites every cell in the mode's colours. */
  setMode(mode: Mode) {
    setBenchMode(mode)
    this.hemi.groundColor.set(PALETTES[mode].ground)
    this.written = false
  }

  /** Starts act `act` from the top (also replays the current one). `instant` skips the blend and the act's own motion. */
  setAct(act: number, instant: boolean) {
    this.snap.set(this.cur)
    this.snapCount = Math.max(this.snapCount, actCellCount(this.act))
    this.act = act
    this.s = instant ? ACT_END[act] + 1 : 0
    this.blend = instant ? BLEND : 0
    this.written = false
  }

  /** Projects a world point with the camera of the last frame, in CSS pixels. */
  project(x: number, y: number, z: number, out: Projected): Projected {
    const e = this.viewProj.elements
    const w = e[3] * x + e[7] * y + e[11] * z + e[15]
    out.x = ((e[0] * x + e[4] * y + e[8] * z + e[12]) / w + 1) * 0.5 * this.width
    out.y = (1 - (e[1] * x + e[5] * y + e[9] * z + e[13]) / w) * 0.5 * this.height
    return out
  }

  get actTime() {
    return this.s
  }
  get currentAct() {
    return this.act
  }

  /** Draws a frame; returns true while anything still moves on its own. */
  render(f: BenchFrame): boolean {
    if (this.width <= 0 || this.height <= 0) return false
    if (f.motion) {
      this.s += f.dt
      this.blend += f.dt
    } else {
      this.s = Math.max(this.s, ACT_END[this.act] + 1)
      this.blend = BLEND
    }
    const acting = this.s <= ACT_END[this.act] || this.blend < BLEND
    if (acting || !this.written) {
      this.writeCells()
      this.written = !acting
    }
    const camMoving = this.frame(f)
    this.renderer.render(this.scene, this.camera)
    return acting || camMoving
  }

  dispose() {
    this.mesh.dispose()
    this.geometry.dispose()
    this.material.dispose()
    this.ambient.dispose()
    this.hemi.dispose()
    this.sun.dispose()
    this.scene.clear()
    this.renderer.dispose()
    try {
      this.renderer.forceContextLoss()
    } catch {
      // Context already lost.
    }
  }

  // Settled state of act at s straight into `cur`, no blend.
  private fill(act: number, s: number) {
    const o = this.out
    const cur = this.cur
    for (let i = 0; i < CELL_COUNT; i++) {
      sample(act, s, i, o)
      const k = i * 9
      cur[k] = o.x
      cur[k + 1] = o.y
      cur[k + 2] = o.z
      cur[k + 3] = o.sx
      cur[k + 4] = o.sy
      cur[k + 5] = o.sz
      cur[k + 6] = o.r
      cur[k + 7] = o.g
      cur[k + 8] = o.b
    }
    this.upload(actCellCount(act))
  }

  private writeCells() {
    const o = this.out
    const { cur, snap } = this
    const blending = this.blend < BLEND
    // Cells the previous act showed are written until the blend has fully hidden them.
    const count = Math.max(this.snapCount, actCellCount(this.act))
    const u = this.blend / BLEND
    for (let i = 0; i < count; i++) {
      sample(this.act, this.s, i, o)
      const k = i * 9
      if (!blending) {
        cur[k] = o.x
        cur[k + 1] = o.y
        cur[k + 2] = o.z
        cur[k + 3] = o.sx
        cur[k + 4] = o.sy
        cur[k + 5] = o.sz
        cur[k + 6] = o.r
        cur[k + 7] = o.g
        cur[k + 8] = o.b
        continue
      }
      // A left-to-right wave: each cell starts by its x across the figure.
      const wave = clamp01((snap[k] + 17) / 34)
      const p = easeInOut((u - wave * BLEND_WAVE) / (1 - BLEND_WAVE))
      const dx = o.x - snap[k]
      const dz = o.z - snap[k + 2]
      const travel = Math.min(1, Math.sqrt(dx * dx + dz * dz) / 4)
      cur[k] = snap[k] + dx * p
      cur[k + 1] = snap[k + 1] + (o.y - snap[k + 1]) * p + Math.sin(Math.PI * p) * LIFT * travel
      cur[k + 2] = snap[k + 2] + dz * p
      cur[k + 3] = snap[k + 3] + (o.sx - snap[k + 3]) * p
      cur[k + 4] = snap[k + 4] + (o.sy - snap[k + 4]) * p
      cur[k + 5] = snap[k + 5] + (o.sz - snap[k + 5]) * p
      cur[k + 6] = snap[k + 6] + (o.r - snap[k + 6]) * p
      cur[k + 7] = snap[k + 7] + (o.g - snap[k + 7]) * p
      cur[k + 8] = snap[k + 8] + (o.b - snap[k + 8]) * p
    }
    if (!blending) this.snapCount = actCellCount(this.act)
    this.upload(count)
  }

  // cur -> instance buffers for the first `count` cells; trailing hidden cells are not drawn.
  private upload(count: number) {
    const { cur, matrix, color } = this
    let shown = 0
    for (let i = 0; i < count; i++) {
      const k = i * 9
      const m = i * 16
      const sx = cur[k + 3]
      const sy = cur[k + 4]
      const sz = cur[k + 5]
      matrix[m] = sx
      matrix[m + 5] = sy
      matrix[m + 10] = sz
      matrix[m + 12] = cur[k]
      matrix[m + 13] = cur[k + 1]
      matrix[m + 14] = cur[k + 2]
      matrix[m + 15] = 1
      color[i * 3] = cur[k + 6]
      color[i * 3 + 1] = cur[k + 7]
      color[i * 3 + 2] = cur[k + 8]
      if (sx > 0 && sy > 0 && sz > 0) shown = i + 1
    }
    this.mesh.count = shown
    const im = this.mesh.instanceMatrix
    im.clearUpdateRanges()
    im.addUpdateRange(0, shown * 16)
    im.needsUpdate = true
    const ic = this.mesh.instanceColor!
    ic.clearUpdateRanges()
    ic.addUpdateRange(0, shown * 3)
    ic.needsUpdate = true
  }

  private ease(cur: number, target: number, k: number) {
    const next = cur + (target - cur) * k
    if (Math.abs(target - next) < EPS) return target
    this.camMoving = true
    return next
  }

  // Eases the camera toward the act's view, adds the look offsets, and fits the box.
  private frame(f: BenchFrame): boolean {
    const view = ACT_VIEWS[this.act]
    const k = f.motion ? 1 - Math.exp(-f.dt * CAMERA_RATE) : 1
    this.camMoving = false
    this.yaw = this.ease(this.yaw, view.yaw, k)
    this.elevation = this.ease(this.elevation, view.elevation, k)
    viewBoxOf(this.act, this.s, this.boxTarget)
    for (let i = 0; i < 6; i++) this.box[i] = this.ease(this.box[i], this.boxTarget[i], k)
    const moving = this.camMoving

    const yaw = this.yaw + f.yaw
    const elev = Math.min(MAX_ELEVATION, Math.max(MIN_ELEVATION, this.elevation + f.pitch))
    const b = this.box
    const L = this.camLast
    if (L[0] === yaw && L[1] === elev && L[2] === b[0] && L[3] === b[1] && L[4] === b[2] && L[5] === b[3] && L[6] === b[4] && L[7] === b[5] && L[8] === this.width && L[9] === this.height) return moving
    L[0] = yaw
    L[1] = elev
    for (let i = 0; i < 6; i++) L[2 + i] = b[i]
    L[8] = this.width
    L[9] = this.height

    const aspect = this.width / this.height
    const tanV = Math.tan((FOV * Math.PI) / 360)
    const tanH = tanV * aspect
    const dir = this.vDir.set(Math.sin(yaw) * Math.cos(elev), Math.sin(elev), Math.cos(yaw) * Math.cos(elev))
    this.vFwd.copy(dir).negate()
    this.vRight.crossVectors(this.vFwd, this.up).normalize()
    this.vUp.crossVectors(this.vRight, this.vFwd)
    const cx = (b[0] + b[3]) / 2
    const cy = (b[1] + b[4]) / 2
    const cz = (b[2] + b[5]) / 2
    // Distance at which every corner of the box fits the frame, centred.
    let D = 0
    for (let c = 0; c < 8; c++) {
      const x = (c & 1 ? b[3] : b[0]) - cx
      const y = (c & 2 ? b[4] : b[1]) - cy
      const z = (c & 4 ? b[5] : b[2]) - cz
      const px = x * this.vRight.x + y * this.vRight.y + z * this.vRight.z
      const py = x * this.vUp.x + y * this.vUp.y + z * this.vUp.z
      const along = x * dir.x + y * dir.y + z * dir.z
      D = Math.max(D, Math.abs(px) / (tanH * FILL) + along, Math.abs(py) / (tanV * FILL) + along)
    }
    this.camera.fov = FOV
    this.camera.aspect = aspect
    this.camera.position.set(cx + dir.x * D, cy + dir.y * D, cz + dir.z * D)
    this.camera.lookAt(cx, cy, cz)
    this.camera.near = Math.max(0.5, D * 0.2)
    this.camera.far = D * 3
    this.camera.updateProjectionMatrix()
    this.camera.updateMatrixWorld()
    this.viewProj.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
    this.viewVersion++
    return moving
  }
}
