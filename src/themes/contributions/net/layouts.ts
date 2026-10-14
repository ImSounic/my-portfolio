// The three layouts one pool of NODE_COUNT nodes morphs between. Ported as-is
// from the prototype (scratchpad/net/net.js) so the shapes match its stills.
// Pure data: no three, no DOM. Every layout uses all NODE_COUNT slots; slots a
// layout does not need collapse onto its last group with scale 0 (invisible).

export const NODE_COUNT = 400;

type Vec3 = [number, number, number];

interface Group {
  pts: Vec3[];
  size: number;
}

export interface Layout {
  /** NODE_COUNT * 3 positions. */
  pos: Float32Array;
  /** NODE_COUNT scales (0 = unused slot). */
  scale: Float32Array;
  /** NODE_COUNT flags, 1 for an accent ("hot") node. */
  hot: Float32Array;
  /** Flat [a0, b0, a1, b1, ...] node-index pairs. */
  edges: Uint16Array;
  edgeCount: number;
}

interface Packed {
  pos: Float32Array;
  scale: Float32Array;
  index: number[][];
}

function grid(cx: number, cy: number, cz: number, cols: number, rows: number, gap: number, plane: "yz" | "xy" = "yz"): Vec3[] {
  const out: Vec3[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = (c - (cols - 1) / 2) * gap;
      const b = (r - (rows - 1) / 2) * gap;
      out.push(plane === "yz" ? [cx, cy + b, cz + a] : [cx + a, cy + b, cz]);
    }
  }
  return out;
}

function pack(groups: Group[]): Packed {
  const pos = new Float32Array(NODE_COUNT * 3);
  const scale = new Float32Array(NODE_COUNT);
  const index: number[][] = [];
  let k = 0;
  for (const g of groups) {
    const ids: number[] = [];
    for (const p of g.pts) {
      if (k >= NODE_COUNT) break;
      pos.set(p, k * 3);
      scale[k] = g.size;
      ids.push(k);
      k++;
    }
    index.push(ids);
  }
  const last = groups[groups.length - 1].pts[0];
  for (; k < NODE_COUNT; k++) {
    pos.set(last, k * 3);
    scale[k] = 0;
  }
  return { pos, scale, index };
}

function dense(a: number[], b: number[], edges: number[], every = 1) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if ((i + j) % every === 0) edges.push(a[i], b[j]);
    }
  }
}

function finish(packed: Packed, edges: number[], hot: number[]): Layout {
  const hotFlags = new Float32Array(NODE_COUNT);
  for (const h of hot) hotFlags[h] = 1;
  return { pos: packed.pos, scale: packed.scale, hot: hotFlags, edges: Uint16Array.from(edges), edgeCount: edges.length / 2 };
}

// Classic MLP: each layer a column of neurons, two deep so it reads in 3D.
function mlp(): Layout {
  const sizes: [number, number][] = [[2, 4], [2, 6], [2, 6], [2, 4], [1, 3]];
  const xs = [-6.5, -3.2, 0, 3.2, 6.5];
  const L = pack(sizes.map(([c, r], i) => ({ pts: grid(xs[i], 0, 0, c, r, 0.95), size: 1.25 })));
  const edges: number[] = [];
  for (let i = 0; i < L.index.length - 1; i++) dense(L.index[i], L.index[i + 1], edges);
  return finish(L, edges, [L.index[4][1], L.index[2][5], L.index[1][9]]);
}

// CNN: input image plane, 4 then 8 stacked feature maps, a dense head.
function cnn(): Layout {
  const g: Group[] = [];
  g.push({ pts: grid(-6.5, 0, 0, 12, 12, 0.42), size: 0.62 });
  const maps: Vec3[] = [];
  for (let m = 0; m < 4; m++) maps.push(...grid(-3.2 + m * 0.55, 0.6 - m * 0.35, -0.9 + m * 0.6, 6, 6, 0.42));
  g.push({ pts: maps, size: 0.62 });
  const maps2: Vec3[] = [];
  for (let m = 0; m < 8; m++) maps2.push(...grid(0.4 + m * 0.32, 0.5 - m * 0.14, -1.1 + m * 0.32, 3, 3, 0.45));
  g.push({ pts: maps2, size: 0.62 });
  g.push({ pts: grid(4.6, 0, 0, 3, 4, 0.9), size: 0.95 });
  g.push({ pts: grid(6.6, 0, 0, 1, 3, 1.1), size: 1.15 });
  const L = pack(g);
  const [img, c1, c2, d, out] = L.index;
  const edges: number[] = [];
  // Receptive fields: a few conv1 cells each look at a 3x3 patch of the image.
  for (const cell of [0, 7, 14, 21, 35, 40, 70, 100]) {
    const m = Math.floor(cell / 36);
    const rc = cell % 36;
    const r = Math.floor(rc / 6);
    const c = rc % 6;
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        const ir = Math.min(11, r * 2 + dr);
        const ic = Math.min(11, c * 2 + dc);
        edges.push(img[ir * 12 + ic], c1[m * 36 + rc]);
      }
    }
  }
  for (let i = 0; i < c2.length; i += 3) edges.push(c1[(i * 2) % c1.length], c2[i]);
  dense(c2, d, edges, 5);
  dense(d, out, edges);
  return finish(L, edges, [out[1], d[4], c1[21], c1[35]]);
}

// Vision-language model: an 8x8 patch grid facing the camera and a row of
// text tokens feed three transformer blocks with cross-attention, then output tokens.
function vlm(): Layout {
  // Deterministic Park-Miller generator, seeded as in the prototype.
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const g: Group[] = [];
  g.push({ pts: grid(-5.6, 1.3, 0, 8, 8, 0.36, "xy"), size: 0.6 });
  const text: Vec3[] = [];
  for (let i = 0; i < 9; i++) text.push([-5.6 + (i - 4) * 0.38, -1.9, 0]);
  g.push({ pts: text, size: 0.85 });
  for (let b = 0; b < 3; b++) {
    const col: Vec3[] = [];
    for (let i = 0; i < 25; i++) col.push([-2 + b * 2.7, 3 - i * 0.26, i < 16 ? -0.6 : 0.6]);
    g.push({ pts: col, size: 0.72 });
  }
  const outTok: Vec3[] = [];
  for (let i = 0; i < 6; i++) outTok.push([6.4, 1.3 - i * 0.55, 0]);
  g.push({ pts: outTok, size: 0.95 });
  const L = pack(g);
  const [img, txt, b0, b1, b2, out] = L.index;
  const edges: number[] = [];
  // Patch embedding: each 2x2 pixel block feeds one patch token.
  for (let p = 0; p < 16; p++) {
    const pr = Math.floor(p / 4);
    const pc = p % 4;
    edges.push(img[pr * 2 * 8 + pc * 2], b0[p], img[(pr * 2 + 1) * 8 + pc * 2 + 1], b0[p]);
  }
  for (let t = 0; t < 9; t++) edges.push(txt[t], b0[16 + t]);
  // Cross-attention: text tokens attend to a few patches, per block.
  for (const blk of [b0, b1, b2]) {
    for (let t = 16; t < 25; t++) {
      for (let k = 0; k < 3; k++) edges.push(blk[t], blk[Math.floor(rand() * 16)]);
    }
  }
  for (let i = 0; i < 25; i++) edges.push(b0[i], b1[i], b1[i], b2[i]);
  for (let o = 0; o < 6; o++) edges.push(b2[16 + o], out[o]);
  return finish(L, edges, [b1[18], b1[5], out[0], b2[20]]);
}

/** [MLP, CNN, VLM]. Built on demand (call once per scene). */
export function buildLayouts(): [Layout, Layout, Layout] {
  return [mlp(), cnn(), vlm()];
}
