// Camera offsets for the network stages, in radians: a small mouse parallax
// plus the visitor's own "look around" rotation (drag, arrow keys) with
// inertia and an eased return to the default pose. Pure state, no DOM; the
// component feeds it input and the scene adds `yaw`/`pitch` to its stage pose.

const DEG = Math.PI / 180;

export const PARALLAX_YAW = 12 * DEG; // at the canvas edge
export const PARALLAX_PITCH = 6 * DEG;
export const YAW_LIMIT = 70 * DEG;
export const PITCH_MIN = -10 * DEG;
export const PITCH_MAX = 35 * DEG;
export const KEY_YAW = 10 * DEG;
export const KEY_PITCH = 5 * DEG;
const DRAG_GAIN = 0.32 * DEG; // per CSS pixel, on a desktop-width canvas
// Narrower canvases turn less per pixel, so a full-width phone swipe is about
// 55° rather than racing to the yaw limit.
const DRAG_FULL_WIDTH = 860;
const DRAG_MIN_SCALE = 0.4;
const FOLLOW_RATE = 5; // 1/s, parallax (time constant 0.2 s, as the scroll follow)
const RETURN_RATE = 4.5; // 1/s, user rotation easing (keys, return home): ~1 s
const FRICTION = 6; // 1/s, inertia decay
const MAX_SPIN = 2.4; // rad/s: a hard flick coasts at most MAX_SPIN / FRICTION (~23°)
const IDLE_MS = 6000;
const EPS = 1e-4;

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const approach = (cur: number, target: number, rate: number, dt: number) => {
  const next = cur + (target - cur) * (1 - Math.exp(-dt * rate));
  return Math.abs(target - next) < EPS ? target : next;
};

export class LookController {
  /** Offsets to add to the stage pose. */
  yaw = 0;
  pitch = 0;

  private parYaw = 0;
  private parPitch = 0;
  private parYawTarget = 0;
  private parPitchTarget = 0;

  private userYaw = 0;
  private userPitch = 0;
  private userYawTarget = 0;
  private userPitchTarget = 0;
  private velYaw = 0;
  private velPitch = 0;
  private dragging = false;
  private lastMove = 0;
  private lastInput = -Infinity;
  private dragGain = DRAG_GAIN;

  /** Canvas width in CSS pixels; scales the drag gain down on narrow screens. */
  setWidth(width: number) {
    this.dragGain = DRAG_GAIN * clamp(width / DRAG_FULL_WIDTH, DRAG_MIN_SCALE, 1);
  }

  /** Pointer position over the canvas as -1..1 on each axis; null when it left. */
  setParallax(nx: number | null, ny: number | null) {
    this.parYawTarget = nx === null ? 0 : clamp(nx, -1, 1) * PARALLAX_YAW;
    this.parPitchTarget = ny === null ? 0 : -clamp(ny, -1, 1) * PARALLAX_PITCH;
  }

  get isDragging() {
    return this.dragging;
  }

  beginDrag(now: number) {
    this.dragging = true;
    this.velYaw = this.velPitch = 0;
    // Grab the model where it currently is (also stops an eased return).
    this.userYawTarget = this.userYaw;
    this.userPitchTarget = this.userPitch;
    this.lastMove = now;
    this.lastInput = now;
  }

  /** Pointer moved by (dx, dy) CSS pixels while dragging. */
  drag(dx: number, dy: number, now: number) {
    if (!this.dragging) return;
    const dYaw = -dx * this.dragGain;
    const dPitch = dy * this.dragGain;
    this.userYawTarget = clamp(this.userYawTarget + dYaw, -YAW_LIMIT, YAW_LIMIT);
    this.userPitchTarget = clamp(this.userPitchTarget + dPitch, PITCH_MIN, PITCH_MAX);
    this.userYaw = this.userYawTarget;
    this.userPitch = this.userPitchTarget;
    const dt = Math.max(8, now - this.lastMove) / 1000;
    this.velYaw = clamp(this.velYaw * 0.6 + (dYaw / dt) * 0.4, -MAX_SPIN, MAX_SPIN);
    this.velPitch = clamp(this.velPitch * 0.6 + (dPitch / dt) * 0.4, -MAX_SPIN, MAX_SPIN);
    this.lastMove = now;
    this.lastInput = now;
  }

  endDrag(now: number, inertia: boolean) {
    if (!this.dragging) return;
    this.dragging = false;
    // A pointer held still before release throws nothing.
    if (!inertia || now - this.lastMove > 90) this.velYaw = this.velPitch = 0;
    this.lastInput = now;
  }

  /** Arrow keys: one step. Returns false when already at the limit. */
  step(dir: "left" | "right" | "up" | "down", now: number, instant: boolean): boolean {
    const yaw = dir === "left" ? KEY_YAW : dir === "right" ? -KEY_YAW : 0;
    // Same sense as dragging the model in that direction.
    const pitch = dir === "up" ? -KEY_PITCH : dir === "down" ? KEY_PITCH : 0;
    const ny = clamp(this.userYawTarget + yaw, -YAW_LIMIT, YAW_LIMIT);
    const np = clamp(this.userPitchTarget + pitch, PITCH_MIN, PITCH_MAX);
    const moved = ny !== this.userYawTarget || np !== this.userPitchTarget;
    this.userYawTarget = ny;
    this.userPitchTarget = np;
    this.velYaw = this.velPitch = 0;
    if (instant) {
      this.userYaw = ny;
      this.userPitch = np;
    }
    this.lastInput = now;
    return moved;
  }

  /** Ease the visitor's rotation back to the default pose (instantly when `instant`). */
  home(instant: boolean) {
    this.userYawTarget = this.userPitchTarget = 0;
    this.velYaw = this.velPitch = 0;
    this.dragging = false;
    if (instant) this.userYaw = this.userPitch = 0;
  }

  /** True when the visitor's rotation has sat idle long enough to go home (lets a still loop wake up). */
  idleDue(now: number): boolean {
    return !this.dragging && now - this.lastInput > IDLE_MS && (this.userYawTarget !== 0 || this.userPitchTarget !== 0);
  }

  /** Advances one frame. `motion` false: no parallax, no inertia, no easing. Returns true while anything moves. */
  update(dt: number, now: number, motion: boolean): boolean {
    if (this.idleDue(now)) this.home(!motion);

    if (motion) {
      this.parYaw = approach(this.parYaw, this.parYawTarget, FOLLOW_RATE, dt);
      this.parPitch = approach(this.parPitch, this.parPitchTarget, FOLLOW_RATE, dt);
    } else {
      this.parYaw = this.parPitch = 0;
    }

    let coasting = false;
    if (!this.dragging) {
      if (motion && (Math.abs(this.velYaw) > 0.01 || Math.abs(this.velPitch) > 0.01)) {
        coasting = true;
        const ny = clamp(this.userYawTarget + this.velYaw * dt, -YAW_LIMIT, YAW_LIMIT);
        const np = clamp(this.userPitchTarget + this.velPitch * dt, PITCH_MIN, PITCH_MAX);
        if (ny === this.userYawTarget) this.velYaw = 0;
        if (np === this.userPitchTarget) this.velPitch = 0;
        this.userYawTarget = this.userYaw = ny;
        this.userPitchTarget = this.userPitch = np;
        const decay = Math.exp(-dt * FRICTION);
        this.velYaw *= decay;
        this.velPitch *= decay;
      } else {
        this.velYaw = this.velPitch = 0;
        if (motion) {
          this.userYaw = approach(this.userYaw, this.userYawTarget, RETURN_RATE, dt);
          this.userPitch = approach(this.userPitch, this.userPitchTarget, RETURN_RATE, dt);
        } else {
          this.userYaw = this.userYawTarget;
          this.userPitch = this.userPitchTarget;
        }
      }
    }

    const yaw = this.parYaw + this.userYaw;
    const pitch = this.parPitch + this.userPitch;
    const moving =
      coasting ||
      yaw !== this.yaw ||
      pitch !== this.pitch ||
      this.parYaw !== this.parYawTarget ||
      this.parPitch !== this.parPitchTarget ||
      this.userYaw !== this.userYawTarget ||
      this.userPitch !== this.userPitchTarget;
    this.yaw = yaw;
    this.pitch = pitch;
    return moving;
  }
}
